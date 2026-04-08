import { useState } from "react"
import Button from "../../components/Button/Button"
import { UserService, LoginDTO } from "../../services/UserService"
import { useNavigate } from "react-router-dom"
import "./SignIn.css"

const userService = new UserService()

const SignIn = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [erro, setErro] = useState("")
    const [loading, setLoading] = useState(false) // estado loading
    const navigate = useNavigate()

    const handleLogin = async () => {
         console.log("handleLogin chamado!")
         console.log("email:", email, "password:", password)

        if (!email || !password) {
            alert("Preencha todos os campos")
            return
        }

        setLoading(true) // Ativa o loading
        setErro("") // Limpa qualquer erro que estava na tela

        const dados: LoginDTO = {
            email,
            senha: password
        }

        try {
            const usuario = await userService.login(dados)
            console.log("Logado!", usuario)
            alert("Login realizado com sucesso!")
            navigate('/')
        } catch (error: any) {
            setErro("Email ou senha inválidos")
        } finally {
            setLoading(false) // Desativa o loading
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
                    {erro && <p className="erro">{erro}</p>}
                    <Button
                        text="Entrar"
                        fullWidth
                        task={handleLogin}
                        isLoading={loading} // passa o estado para dentro do Button
                    />
                </div>
            </div>
        </div>
    )
}

export default SignIn