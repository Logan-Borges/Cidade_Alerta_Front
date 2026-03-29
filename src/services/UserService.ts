import { BaseService } from "./BaseService"
import { User } from "../models/User"

export class UserService extends BaseService {
    async createUser(user: User): Promise<User> {
        return this.post<User, User>("/usuarios", user)
    }
}
