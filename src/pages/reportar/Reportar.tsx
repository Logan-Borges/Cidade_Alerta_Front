import { ChangeEvent, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Camera, Sparkles, Shield, MapPin, AlertTriangle, Zap } from "lucide-react"
import Alert from "../../components/Alert/Alert"
import { CreateOccurrenceDTO, OccurrenceService } from "../../services/OccurrenceService"
import { BairroService } from "../../services/BairroService"
import { Bairro } from "../../models/Bairro"
import { UserService } from "../../services/UserService"

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
    const [titulo, setTitulo] = useState("")
    const [descricao, setDescricao] = useState("")
    const [tipo, setTipo] = useState<string | null>(null)
    const [urgencia, setUrgencia] = useState<string | null>(null)
    const [bairroId, setBairroId] = useState<number | null>(null)
    const [bairros, setBairros] = useState<Bairro[]>([])
    const [bairroLoading, setBairroLoading] = useState(false)
    const [fotoBase64, setFotoBase64] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState<{ type: "success" | "error" | "warning" | "info"; title: string; description?: string } | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const loadBairros = async () => {
            setBairroLoading(true)
            try {
                const data = await bairroService.getBairros()
                setBairros(data)
                if (data.length > 0) {
                    setBairroId(data[0].id ?? null)
                }
            } catch {
                setAlert({ type: "error", title: "Falha ao carregar bairros", description: "Não foi possível obter a lista de bairros." })
            } finally {
                setBairroLoading(false)
            }
        }

        loadBairros()
    }, [])

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
            status: null,
            usuarioId,
            bairroId,
            fotoBase64,
        }

        setLoading(true)
        setAlert(null)

        try {
            await occurrenceService.createOccurrence(payload)
            setAlert({ type: "success", title: "Ocorrência enviada!", description: "Sua denúncia foi registrada e está sendo processada." })
            setTimeout(() => navigate("/ocorrencias"), 1600)
        } catch (error: any) {
            const message = error?.message || "Ocorreu um erro ao enviar a ocorrência."
            setAlert({ type: "error", title: "Erro ao reportar", description: message })
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
                                <h2 className="text-3xl font-bold text-white">Reportar ocorrência</h2>
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
                                    <label className="text-sm font-semibold text-gray-300">Bairro</label>
                                    <select
                                        value={bairroId ?? ""}
                                        onChange={(e) => setBairroId(Number(e.target.value))}
                                        disabled={bairroLoading || bairros.length === 0}
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 pr-10 text-white outline-none transition-colors duration-150 hover:bg-slate-900/40 focus:border-[#ef671f] focus:ring-2 focus:ring-orange-400/20 disabled:cursor-not-allowed disabled:opacity-70 appearance-none cursor-pointer"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 14px center',
                                        }}
                                    >
                                        <option value="" disabled>
                                            {bairroLoading ? "Carregando bairros..." : "Selecione o bairro"}
                                        </option>
                                        {bairros.map((bairro) => (
                                            <option key={bairro.id} value={bairro.id}>
                                                {bairro.nome}
                                            </option>
                                        ))}
                                    </select>
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
                                    {loading ? "Enviando..." : "Reportar agora"}
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
