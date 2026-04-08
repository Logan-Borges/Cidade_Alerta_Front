import { useState } from "react"
import Button from "../../components/Button/Button"
import Alert from "../../components/Alert/Alert"
import { UserService, LoginDTO } from "../../services/UserService"
import { useNavigate } from "react-router-dom"
import "./SignIn.css"

const userService = new UserService()

type AlertState = {
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    description?: string
} | null

const SignIn = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState<AlertState>(null)
    const navigate = useNavigate()

    const handleLogin = async () => {
        if (!email || !password) {
            setAlert({ type: 'warning', title: 'Preencha todos os campos', description: 'Email e senha são obrigatórios.' })
            return
        }

        setLoading(true)
        setAlert(null)

        const dados: LoginDTO = {
            email,
            senha: password
        }

        try {
            const usuario = await userService.login(dados)
            console.log("Logado!", usuario)
            setAlert({ type: 'success', title: 'Login realizado com sucesso!' })
            navigate('/')
        } catch (error: any) {
            setAlert({ type: 'error', title: 'Email ou senha inválidos', description: 'Verifique suas credenciais e tente novamente.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="content">
            <div className="container-signin">
                <div className="title-signin">
                    <h2>Login</h2>
                </div>
                <div className="input-forms">
                    <input
                        id="email"
                        type="email"
                        placeholder="Digite seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        id="password"
                        type="password"
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        text="Entrar"
                        fullWidth
                        task={handleLogin}
                        isLoading={loading}
                    />
                </div>
            </div>
            {alert && (
                <Alert
                    type={alert.type}
                    title={alert.title}
                    description={alert.description}
                    onClose={() => setAlert(null)}
                />
            )}
        </div>
    )
}

export default SignIn