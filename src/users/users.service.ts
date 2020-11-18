import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly users: Repository<User>
    ) { }

    async createAccount({ email, password, role }: CreateAccountInput): Promise<{ ok: boolean, error?: string }> {
        try {
            //check new User exist
            const exists: User = await this.users.findOne({ email });
            if (exists) {
                return { ok: false, error: "email is already taken" };
            } else {
                await this.users.save(this.users.create({ email, password, role }));  // create User and hash the pwd
                return { ok: true };
            }
        } catch (error) {
            return { ok: false, error: "Could't create User" };
        }
    }

    async login({ email, password }: LoginInput): Promise<LoginOutput> {
        // 이메일에 해당하는 유저 찾기 , 없으면
        try {
            const user: User = await this.users.findOne({ email });
            if (!user) {
                return { ok: false, error: "User not found" }
            }
            const passwordCorrect = await user.checkPassword(password);
            if (!passwordCorrect) {
                return { ok: false, error: "Wrong password" }
            }
            return { ok: true, token: "lalalaal" }
        } catch (error) {
            return { ok: false, error }
        }



        // JWT 생성해 주기
    }
}