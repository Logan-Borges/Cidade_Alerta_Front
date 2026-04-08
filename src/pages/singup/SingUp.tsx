import { useState } from "react"
import Button from "../../components/Button/Button"
import Alert from "../../components/Alert/Alert"
import { User } from "../../models/User"
import { UserService } from "../../services/UserService"
import "./SingUp.css"

const userService = new UserService()

type AlertState = {
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    description?: string
} | null

const SingUp = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [cpf, setCpf] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [alert, setAlert] = useState<AlertState>(null)

    const validateFields = (): boolean => {
        if (!name || !email || !cpf || !password || !confirmPassword) {
            setAlert({ type: 'warning', title: 'Preencha todos os campos', description: 'Todos os campos são obrigatórios.' })
            return false
        }
        if (password !== confirmPassword) {
            setAlert({ type: 'error', title: 'As senhas não coincidem', description: 'Verifique e digite novamente.' })
            return false
        }
        return true
    }

    const saveData = async () => {
        const user = new User(name, email, password)
        try {
            const response = await userService.createUser(user)
            console.log("Usuário criado:", response)
            setAlert({ type: 'success', title: 'Usuário cadastrado com sucesso!' })
        } catch (error) {
            console.error(error)
            setAlert({ type: 'error', title: 'Erro ao cadastrar usuário', description: 'Tente novamente mais tarde.' })
        }
    }

    return (
        <div className="content">
            <div className="container-singup">
                <div className="title-singup">
                    <h2>Cadastro de Usuário</h2>
                </div>
                <div className="input-forms">
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
                    <input id="password" type="password" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input id="confirmPassword" type="password" placeholder="Confirme sua senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <Button
                        text="Cadastrar"
                        fullWidth
                        task={() => {
                            if (validateFields()) {
                                saveData()
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default SingUp