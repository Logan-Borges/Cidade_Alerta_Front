import { useState, useEffect } from "react"
import Button from "../../components/Button/Button"
import Alert from "../../components/Alert/Alert"
import { User } from "../../models/User"
import { Bairro } from "../../models/Bairro"
import { UserService } from "../../services/UserService"
import { BairroService } from "../../services/BairroService"
import "./SingUp.css"

const userService = new UserService()
const bairroService = new BairroService()

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
    const [bairros, setBairros] = useState<Bairro[]>([])
    const [bairroId, setBairroId] = useState<number>(0)

    useEffect(() => {
        const fetchBairros = async () => {
            try {
                const data = await bairroService.getBairros()
                setBairros(data)
            } catch (error) {
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
        if (password !== confirmPassword) {
            setAlert({ type: 'error', title: 'As senhas não coincidem', description: 'Verifique e digite novamente.' })
            return false
        }
        return true
    }

    const saveData = async () => {
        const user = new User(name, email, password,cpf,undefined,bairroId)
        console.log("Dados do usuário a serem enviados:", user)
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