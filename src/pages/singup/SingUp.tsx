import { useState } from "react"
import Button from "../../components/Button/Button"
import { User } from "../../models/User"
import { UserService } from "../../services/UserService"
import "./SingUp.css"

const userService = new UserService()

const SingUp = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [cpf, setCpf] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const validateFields = (): boolean => {
        if (!name || !email || !cpf || !password || !confirmPassword) {
            alert("Preencha todos os campos")
            return false
        }
        if (password !== confirmPassword) {
            alert("As senhas não coincidem")
            return false
        }
        return true
    }

    const saveData = async () => {
        const user = new User(name, email, password)
        try {
            console.log("Enviando dados do usuário:", user)
            const response = await userService.createUser(user)
            console.log("Usuário criado:", response)
            alert("Usuário cadastrado com sucesso!")
        } catch (error) {
            alert("Erro ao cadastrar usuário. Tente novamente.")
            console.error(error)
        }
    }

    return (
        <div className="content"> 
            <div className="container-singup">
                <div className="title-singup">
                    <h2>Cadastro de Usuário</h2>
                </div>
                <div className="input-forms">
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
