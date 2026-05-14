import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, ArrowRight, Activity, MapPin, CheckCircle, Users } from "lucide-react"
import Alert from "../../components/Alert/Alert"
import { User } from "../../models/User"
import { Bairro } from "../../models/Bairro"
import { UserService } from "../../services/UserService"
import { BairroService } from "../../services/BairroService"
import { useNavigate } from "react-router-dom"
import { LogoCidadeAlerta } from "../../assets/logo"

const userService = new UserService()
const bairroService = new BairroService()

type AlertState = {
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    description?: string
} | null

const FEATURES = [
    { icon: Activity, text: "Monitore ocorrências em tempo real" },
    { icon: MapPin, text: "Acompanhe por bairro e região" },
    { icon: CheckCircle, text: "Receba atualizações de status" },
    { icon: Users, text: "Comunidade ativa de cidadãos" },
]

function AuthInput({
    label, type, placeholder, value, onChange,
}: {
    label: string; type: string; placeholder: string; value: string; onChange: (v: string) => void
}) {
    const [show, setShow] = useState(false)
    const isPassword = type === "password"

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <div className="relative">
                <input
                    type={isPassword && show ? "text" : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-11 px-4 pr-11 border border-gray-300 rounded-xl text-sm bg-gray-50 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#1e3652] focus:ring-2 focus:ring-[#1e3652]/10 focus:bg-white"
                />
                {isPassword && (
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShow(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
        </div>
    )
}

function LeftPanel() {
    return (
        <div className="hidden lg:flex lg:w-1/2 bg-[#1e3652] flex-col justify-between p-12 relative overflow-hidden">
            <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-56 h-56 rounded-full bg-orange-500/8 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-[#ef671f] rounded-xl flex items-center justify-center flex-shrink-0">
                    <LogoCidadeAlerta size={22} color="#fff" />
                </div>
                <span className="text-lg font-bold text-white">
                    Cidade<span className="text-orange-400">Alerta</span>
                </span>
            </div>

            <div className="relative z-10 space-y-6">
                <div>
                    <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                        Sua cidade,<br />
                        <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                            mais segura
                        </span><br />
                        agora.
                    </h1>
                    <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                        Reporte incidentes, acompanhe ocorrências e ajude a transformar sua comunidade em tempo real.
                    </p>
                </div>
                <ul className="space-y-3">
                    {FEATURES.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0 text-blue-400">
                                <Icon size={14} />
                            </div>
                            <span className="text-white/65 text-sm">{text}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <p className="relative z-10 text-white/20 text-xs">
                © 2026 CidadeAlerta. Todos os direitos reservados.
            </p>
        </div>
    )
}

const SingUp = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [cpf, setCpf] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [bairros, setBairros] = useState<Bairro[]>([])
    const [bairroId, setBairroId] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState<AlertState>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBairros = async () => {
            try {
                const data = await bairroService.getBairros()
                setBairros(data)
            } catch {
                setAlert({ type: 'error', title: 'Erro ao carregar bairros', description: 'Tente recarregar a página.' })
            }
        }
        fetchBairros()
    }, [])

    const validateFields = (): boolean => {
        if (!name || !email || !cpf || !password || !confirmPassword) {
            setAlert({ type: 'warning', title: 'Preencha todos os campos', description: 'Todos os campos são obrigatórios.' })
            return false
        }
        if (!bairroId) {
            setAlert({ type: 'warning', title: 'Selecione um bairro', description: 'O bairro é obrigatório.' })
            return false
        }
        if (password !== confirmPassword) {
            setAlert({ type: 'error', title: 'As senhas não coincidem', description: 'Verifique e digite novamente.' })
            return false
        }
        return true
    }

    const saveData = async () => {
        if (!validateFields()) return
        setLoading(true)
        setAlert(null)
        try {
            // Remove máscara do CPF antes de enviar (backend espera 11 dígitos)
            const cpfLimpo = cpf.replace(/\D/g, "")
            const user = new User(name, email, password, cpfLimpo, undefined, bairroId)
            await userService.createUser(user)
            setAlert({ type: 'success', title: 'Usuário cadastrado com sucesso!' })
            setTimeout(() => navigate('/login'), 2000)
        } catch {
            setAlert({ type: 'error', title: 'Erro ao cadastrar usuário', description: 'Tente novamente mais tarde.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen">
            <LeftPanel />

            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-12 bg-white">
                <div className="lg:hidden flex items-center gap-3 mb-8">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-[#ef671f] rounded-xl flex items-center justify-center">
                        <LogoCidadeAlerta size={20} color="#fff" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                        Cidade<span className="text-orange-500">Alerta</span>
                    </span>
                </div>

                <div className="w-full max-w-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="register"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.28, ease: "easeOut" }}
                        >
                            <div className="mb-7">
                                <h2 className="text-2xl font-bold text-[#1e3652]">Criar conta</h2>
                                <p className="text-gray-500 text-sm mt-1">Junte-se a milhares de cidadãos ativos</p>
                            </div>

                            <div className="flex flex-col gap-4 mb-5">
                                <AuthInput label="Nome completo" type="text" placeholder="João Silva" value={name} onChange={setName} />
                                <AuthInput label="E-mail" type="email" placeholder="seu@email.com" value={email} onChange={setEmail} />
                                <AuthInput label="CPF" type="text" placeholder="000.000.000-00" value={cpf} onChange={setCpf} />
                                <AuthInput label="Senha" type="password" placeholder="••••••••" value={password} onChange={setPassword} />
                                <AuthInput label="Confirmar senha" type="password" placeholder="••••••••" value={confirmPassword} onChange={setConfirmPassword} />

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Bairro</label>
                                    <select
                                        value={bairroId}
                                        onChange={(e) => setBairroId(Number(e.target.value))}
                                        className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm bg-gray-50 text-gray-900 outline-none transition focus:border-[#1e3652] focus:ring-2 focus:ring-[#1e3652]/10 cursor-pointer appearance-none"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 14px center',
                                        }}
                                    >
                                        <option value={0}>Selecione seu bairro</option>
                                        {bairros.map((b) => (
                                            <option key={b.id} value={b.id}>{b.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={saveData}
                                disabled={loading}
                                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#ef671f] hover:bg-orange-500 active:scale-[0.98] text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/30 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                            >
                                {loading ? "Cadastrando..." : "Criar conta"}
                                {!loading && <ArrowRight size={16} />}
                            </button>

                            <p className="text-center text-sm text-gray-500 mt-5">
                                Já tem uma conta?{" "}
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="font-semibold text-[#ef671f] hover:opacity-75 transition-opacity"
                                >
                                    Entrar
                                </button>
                            </p>

                            <p className="text-center text-xs text-gray-400 mt-3 leading-relaxed">
                                Ao criar uma conta, você concorda com nossos{" "}
                                <span className="text-[#ef671f] cursor-pointer hover:underline">Termos de Uso</span>
                                {" "}e{" "}
                                <span className="text-[#ef671f] cursor-pointer hover:underline">Política de Privacidade</span>.
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {alert && (
                <Alert type={alert.type} title={alert.title} description={alert.description} onClose={() => setAlert(null)} />
            )}
        </div>
    )
}

export default SingUp
