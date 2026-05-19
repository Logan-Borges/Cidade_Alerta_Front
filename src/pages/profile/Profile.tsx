import { useState, useEffect, useRef } from "react"
import Button from "../../components/Button/Button"
import Alert from "../../components/Alert/Alert"
import { User } from "../../models/User"
import { Bairro } from "../../models/Bairro"
import { UserService } from "../../services/UserService"
import { BairroService } from "../../services/BairroService"

const userService = new UserService()
const bairroService = new BairroService()

type AlertState = {
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    description?: string
} | null

const Profile = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [cpf, setCpf] = useState("")
    const [bairros, setBairros] = useState<Bairro[]>([])
    const [bairroId, setBairroId] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState<AlertState>(null)

    useEffect(() => {
        const fetchBairros = async () => {
            try {
                const data = await bairroService.getBairros()
                setBairros(data)
            } catch {
                setAlert({ type: 'error', title: 'Erro ao carregar bairros', description: 'Tente recarregar a página.' })
            }
        }

        const fetchProfile = async () => {
            try {
                const usuario = await userService.getProfile()
                setName(usuario.nome)
                setEmail(usuario.email)
                setCpf(usuario.cpf)
                setBairroId(usuario.bairroId ?? 0)
            } catch {
                setAlert({ type: 'error', title: 'Erro ao carregar perfil', description: 'Tente recarregar a página.' })
            }
        }

        fetchBairros()
        fetchProfile()
    }, [])

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onloadend = () => setAvatarPreview(reader.result as string)
        reader.readAsDataURL(file)
    }

    const validateFields = (): boolean => {
        if (!name || !email || !cpf) {
            setAlert({ type: 'warning', title: 'Preencha todos os campos', description: 'Nome, email e CPF são obrigatórios.' })
            return false
        }
        return true
    }

    const handleSave = async () => {
        if (!validateFields()) return

        setLoading(true)
        setAlert(null)

        try {
            const user = new User(name, email, undefined, cpf, undefined, bairroId)
            await userService.updateProfile(user)
            setAlert({ type: 'success', title: 'Perfil atualizado com sucesso!' })
        } catch {
            setAlert({ type: 'error', title: 'Erro ao atualizar perfil', description: 'Tente novamente mais tarde.' })
        } finally {
            setLoading(false)
        }
    }

    const initials = name
        .split(" ")
        .slice(0, 2)
        .map(n => n[0])
        .join("")
        .toUpperCase()

    return (
        <div className="content">
            <div className="container-singup">
                <div className="title-singup">
                    <h2>Meu Perfil</h2>
                </div>
                <div className="input-forms">

                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-2 mb-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300 hover:border-gray-400 transition-colors group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                            title="Alterar foto"
                        >
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="w-full h-full flex items-center justify-center text-xl font-semibold text-gray-500">
                                    {initials || "?"}
                                </span>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-medium">Alterar</span>
                            </div>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                        <p className="text-sm text-gray-500">Clique para alterar a foto</p>
                    </div>

                    {alert && (
                        <Alert
                            type={alert.type}
                            title={alert.title}
                            description={alert.description}
                            onClose={() => setAlert(null)}
                        />
                    )}

                    <input id="name" type="text" placeholder="Digite seu nome" value={name} onChange={(e) => setName(e.target.value)} />
                    <input id="email" type="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input id="cpf" type="text" placeholder="Digite seu CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                    <select
                        id="bairro"
                        value={bairroId}
                        onChange={(e) => setBairroId(Number(e.target.value))}
                    >
                        <option value="">Selecione seu bairro</option>
                        {bairros.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.nome}
                            </option>
                        ))}
                    </select>

                    <Button
                        text="Salvar alterações"
                        fullWidth
                        task={handleSave}
                        isLoading={loading}
                    />
                </div>
            </div>
        </div>
    )
}

export default Profile