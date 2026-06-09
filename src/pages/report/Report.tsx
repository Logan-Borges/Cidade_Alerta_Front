import { ChangeEvent, useEffect, useState, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { OccurrenceData } from "../../components/Occurrence/Occurrence"
import { ArrowLeft, Camera, Sparkles, Shield, MapPin, AlertTriangle, Zap } from "lucide-react"
import Alert from "../../components/Alert/Alert"
import { CreateOccurrenceDTO, OccurrenceService } from "../../services/OccurrenceService"
import { BairroService } from "../../services/BairroService"
import { Bairro } from "../../models/Bairro"
import { UserService } from "../../services/UserService"
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const occurrenceService = new OccurrenceService()
const bairroService = new BairroService()
const userService = new UserService()

const TYPE_OPTIONS = [
    { value: "seguranca", label: "Segurança" },
    { value: "transito", label: "Trânsito" },
    { value: "infraestrutura", label: "Infraestrutura" },
    { value: "meio_ambiente", label: "Meio Ambiente" },
    { value: "saude", label: "Saúde Pública" },
]

const URGENCY_OPTIONS = [
    { value: "baixa", label: "Baixa" },
    { value: "media", label: "Média" },
    { value: "alta", label: "Alta" },
    { value: "critica", label: "Crítica" },
]

function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const result = reader.result as string
            resolve(result)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

export default function Reportar() {
    const location = useLocation()
    const editOccurrence = (location.state as { editOccurrence?: OccurrenceData } | null)?.editOccurrence
    const editingId = editOccurrence?.id
    const isEditing = Boolean(editingId)

    const [titulo, setTitulo] = useState("")
    const [descricao, setDescricao] = useState("")
    const [tipo, setTipo] = useState<string | null>(null)
    const [urgencia, setUrgencia] = useState<string | null>(null)
    const [bairroId, setBairroId] = useState<number | null>(null)
    const [bairros, setBairros] = useState<Bairro[]>([])
    const [bairroLoading, setBairroLoading] = useState(false)
    const [cep, setCep] = useState<string>("")
    const [rua, setRua] = useState<string | null>(null)
    const [bairroNomeLocal, setBairroNomeLocal] = useState<string | null>(null)
    const [lat, setLat] = useState<number | null>(null)
    const [lng, setLng] = useState<number | null>(null)
    const [cepLoading, setCepLoading] = useState(false)
    const [fotoBase64, setFotoBase64] = useState<string | null>(null)
    const [cepMatchedBairroId, setCepMatchedBairroId] = useState<number | null>(null)
    const [cepMatchedBairroName, setCepMatchedBairroName] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState<{ type: "success" | "error" | "warning" | "info"; title: string; description?: string } | null>(null)
    const navigate = useNavigate()

    const bairroSelectRef = useRef<HTMLSelectElement | null>(null)

    useDocumentTitle(isEditing ? "Editar Ocorrência" : "Reportar Ocorrência")

    useEffect(() => {
        const loadBairros = async () => {
            setBairroLoading(true)
            try {
                const data = await bairroService.getBairros()
                setBairros(data)
                if (!isEditing && data.length > 0) {
                    setBairroId(data[0].id ?? null)
                }
            } catch {
                setAlert({ type: "error", title: "Falha ao carregar bairros", description: "Não foi possível obter a lista de bairros." })
            } finally {
                setBairroLoading(false)
            }
        }

        loadBairros()
    }, [isEditing])

    useEffect(() => {
        if (!editOccurrence) return

        setTitulo(editOccurrence.title ?? "")
        setDescricao(editOccurrence.description ?? "")
        setTipo(editOccurrence.category ?? null)
        setUrgencia(editOccurrence.urgency ?? null)
        if (editOccurrence.neighborhoodId != null) {
            setBairroId(Number(editOccurrence.neighborhoodId))
        }
        setCep(editOccurrence.cep ?? "")
        setRua(editOccurrence.rua ?? null)
        setBairroNomeLocal(editOccurrence.bairroNome ?? null)
        setLat(editOccurrence.lat ?? null)
        setLng(editOccurrence.lng ?? null)
        if (editOccurrence.image_url) {
            setFotoBase64(editOccurrence.image_url)
        }
    }, [editOccurrence])

    const handleFotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) {
            setFotoBase64(null)
            return
        }

        try {
            const imageBase64 = await readFileAsBase64(file)
            setFotoBase64(imageBase64)
        } catch {
            setAlert({ type: "error", title: "Falha ao carregar imagem", description: "Verifique o arquivo e tente novamente." })
        }
    }

    const lookupCep = async (value: string) => {
        const raw = String(value || "").replace(/\D/g, "")
        if (raw.length !== 8) return

        setCepLoading(true)
        try {
            // ViaCEP para obter rua/bairro/localidade/uf
            const viaRes = await fetch(`https://viacep.com.br/ws/${raw}/json/`)
            const viaData = await viaRes.json()
            if (viaData.erro) {
                setAlert({ type: "error", title: "CEP inválido", description: "CEP não encontrado." })
                setRua(null)
                setBairroNomeLocal(null)
                setLat(null)
                setLng(null)
                return
            }

            setCep(raw)
            setRua(viaData.logradouro || "")
            setBairroNomeLocal(viaData.bairro || "")

            // tentar selecionar automaticamente o bairro se já estiver carregado
            const viaBairro = (viaData.bairro || "").trim()
                if (viaBairro && bairros.length > 0) {
                const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
                const target = normalize(viaBairro)
                const match = bairros.find(b => {
                    const bn = normalize(b.nome || "")
                    return bn === target || bn.includes(target) || target.includes(bn)
                })
                if (match) {
                        setBairroId(match.id)
                        setCepMatchedBairroId(match.id)
                        setCepMatchedBairroName(match.nome ?? null)
                        setTimeout(() => {
                            bairroSelectRef.current?.focus()
                            bairroSelectRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }, 120)
                    } else {
                        setCepMatchedBairroId(null)
                        setCepMatchedBairroName(null)
                    }
            }

            // Geocodificar com Nominatim (OpenStreetMap)
            const city = viaData.localidade || ""
            const uf = viaData.uf || ""
            const addressQuery = `${viaData.logradouro || ""} ${viaData.bairro || ""} ${city} ${uf} Brasil`.trim()

            let geocode = null
            if (addressQuery.replace(/\s+/g, "").length > 0) {
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}&limit=1`, {
                    headers: { 'User-Agent': 'Cidade-Alerta-App' }
                })
                const geoJson = await geoRes.json()
                if (Array.isArray(geoJson) && geoJson.length > 0) geocode = geoJson[0]
            }

            // fallback: tentar buscar por CEP
            if (!geocode) {
                const geoRes2 = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${raw}&limit=1`, {
                    headers: { 'User-Agent': 'Cidade-Alerta-App' }
                })
                const geo2 = await geoRes2.json()
                if (Array.isArray(geo2) && geo2.length > 0) geocode = geo2[0]
            }

            if (geocode) {
                setLat(Number(geocode.lat))
                setLng(Number(geocode.lon))
            } else {
                setLat(null)
                setLng(null)
            }

        } catch (err) {
            setAlert({ type: "error", title: "Erro ao buscar CEP", description: "Não foi possível obter informações do CEP." })
            setRua(null)
            setBairroNomeLocal(null)
            setLat(null)
            setLng(null)
            setCepMatchedBairroId(null)
            setCepMatchedBairroName(null)
        } finally {
            setCepLoading(false)
        }
    }

    // caso os bairros carreguem depois do lookup, tente mapear novamente
    useEffect(() => {
        if (!bairroNomeLocal) return
        if (!bairros || bairros.length === 0) return

        const viaBairro = bairroNomeLocal.trim()
        if (!viaBairro) return

        const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        const target = normalize(viaBairro)
        const match = bairros.find(b => {
            const bn = normalize(b.nome || "")
            return bn === target || bn.includes(target) || target.includes(bn)
        })
        if (match) {
            setBairroId(match.id)
            setCepMatchedBairroId(match.id)
            setCepMatchedBairroName(match.nome ?? null)
            setTimeout(() => {
                bairroSelectRef.current?.focus()
                bairroSelectRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 120)
        }
    }, [bairroNomeLocal, bairros])

    const handleSubmit = async () => {
        if (!titulo.trim() || !descricao.trim() || !tipo || !urgencia || !bairroId) {
            setAlert({ type: "warning", title: "Preencha todos os campos obrigatórios", description: "Título, descrição, tipo, urgência e bairro são necessários." })
            return
        }

        // Obter usuário a partir do token antes de enviar
        let usuarioId: number | undefined
        try {
            const profile = await userService.getProfile()
            usuarioId = profile?.id
            if (!usuarioId) {
                setAlert({ type: "error", title: "Usuário não autenticado", description: "Não foi possível identificar o usuário. Faça login novamente." })
                return
            }
        } catch (err) {
            setAlert({ type: "error", title: "Erro ao validar usuário", description: "Falha ao recuperar dados do usuário a partir do token." })
            return
        }

        const payload: CreateOccurrenceDTO = {
            titulo: titulo.trim(),
            descricao: descricao.trim(),
            tipo,
            urgencia,
            status: isEditing ? (editOccurrence?.status ?? "ativa") : "ativa",
            ativo: true,
            usuarioId,
            bairroId,
            fotoBase64,
            cep: cep || null,
            rua: rua || null,
            bairroNome: bairroNomeLocal || (bairros.find(b => b.id === bairroId)?.nome ?? null),
            lat,
            lng,
        }

        setLoading(true)
        setAlert(null)

        try {
            if (isEditing && editingId) {
                await occurrenceService.updateOccurrence(editingId, payload)
                setAlert({ type: "success", title: "Ocorrência atualizada!", description: "As alterações foram salvas com sucesso." })
            } else {
                await occurrenceService.createOccurrence(payload)
                setAlert({ type: "success", title: "Ocorrência enviada!", description: "Sua denúncia foi registrada e está sendo processada." })
            }
            setTimeout(() => navigate("/ocorrencias"), 1600)
        } catch (error: any) {
            const message = error?.message || (isEditing ? "Ocorreu um erro ao atualizar a ocorrência." : "Ocorreu um erro ao enviar a ocorrência.")
            setAlert({ type: "error", title: isEditing ? "Erro ao editar" : "Erro ao reportar", description: message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-128px)] flex-col bg-[#07101f] py-24 px-4 sm:px-6 lg:px-8 text-white">
            <div className="flex-1 max-w-6xl mx-auto space-y-8">

                <div className="flex items-center justify-center">
                    <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
                        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-white">
                                    {isEditing ? "Editar ocorrência" : "Reportar ocorrência"}
                                </h2>
                            </div>
                            <Link
                                to="/ocorrencias"
                                className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-100 transition hover:bg-orange-500/20"
                            >
                                <ArrowLeft className="w-4 h-4" /> Voltar
                            </Link>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300">Título</label>
                                <input
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    placeholder="Roubo de celular no ponto de ônibus"
                                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4 text-white outline-none transition focus:border-[#ef671f] focus:ring-2 focus:ring-orange-400/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300">Descrição</label>
                                <textarea
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    placeholder="Aconteceu por volta das 20h, dois homens armados abordaram uma pessoa..."
                                    rows={5}
                                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4 text-white outline-none transition focus:border-[#ef671f] focus:ring-2 focus:ring-orange-400/20"
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold text-gray-300">Tipo</label>
                                    <select
                                        value={tipo ?? ""}
                                        onChange={(e) => setTipo(e.target.value || null)}
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 pr-10 text-white outline-none transition-colors duration-150 hover:bg-slate-900/40 focus:border-[#ef671f] focus:ring-2 focus:ring-orange-400/20 appearance-none cursor-pointer"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 14px center',
                                        }}
                                    >
                                        <option value="" disabled>Selecione o tipo</option>
                                        {TYPE_OPTIONS.map((item) => (
                                            <option key={item.value} value={item.value}>{item.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold text-gray-300">Urgência</label>
                                    <select
                                        value={urgencia ?? ""}
                                        onChange={(e) => setUrgencia(e.target.value || null)}
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 pr-10 text-white outline-none transition-colors duration-150 hover:bg-slate-900/40 focus:border-[#ef671f] focus:ring-2 focus:ring-orange-400/20 appearance-none cursor-pointer"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 14px center',
                                        }}
                                    >
                                        <option value="" disabled>Selecione a urgência</option>
                                        {URGENCY_OPTIONS.map((item) => (
                                            <option key={item.value} value={item.value}>{item.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-semibold text-gray-300">CEP</label>
                                            <input
                                                value={cep}
                                                onChange={(e) => {
                                                    setCep(e.target.value)
                                                    const raw = String(e.target.value || "").replace(/\D/g, "")
                                                    if (raw.length < 8) {
                                                        setCepMatchedBairroId(null)
                                                        setCepMatchedBairroName(null)
                                                    }
                                                }}
                                                onBlur={() => lookupCep(cep)}
                                                placeholder="Digite o CEP (apenas números)"
                                                className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition-colors duration-150 hover:bg-slate-900/40 focus:border-[#ef671f] focus:ring-2 focus:ring-orange-400/20 appearance-none"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-semibold text-gray-300">Endereço (retornado)</label>
                                            <div className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white text-sm">
                                                <div>Rua: {rua ?? '—'}</div>
                                                <div>Bairro: {bairroNomeLocal ?? '—'}</div>
                                                <div>Lat/Lng: {lat != null && lng != null ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : '—'}</div>
                                            </div>
                                        </div>
                                    </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold text-gray-300">Bairro</label>
                                    <div className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white text-sm">
                                        {cepMatchedBairroName ?? bairroNomeLocal ?? 'Informe o CEP para preencher o bairro'}
                                    </div>
                                    <input type="hidden" value={bairroId ?? ''} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300">Foto (opcional)</label>
                                <div className="mt-3 flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFotoChange}
                                        className="w-full text-sm text-gray-200 file:mr-4 file:rounded-full file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white file:shadow-md file:shadow-orange-500/20"
                                    />
                                </div>
                                {fotoBase64 && (
                                    <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80">
                                        <img src={fotoBase64} alt="Prévia da foto" className="h-44 w-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="text-white inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-[#ef671f] to-[#fbbf24] px-6 py-4 text-sm font-bold shadow-lg shadow-orange-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? "Enviando..." : isEditing ? "Salvar alterações" : "Reportar agora"}
                                    <Zap className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {alert && (
                    <Alert type={alert.type} title={alert.title} description={alert.description} onClose={() => setAlert(null)} />
                )}
            </div>
        </div>
    )
}
