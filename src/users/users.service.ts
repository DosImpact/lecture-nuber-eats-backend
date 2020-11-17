import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAccountInput } from "./dtos/create-account.dto";
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
}