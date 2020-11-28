import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { User } from "./entities/user.entity";

// import * as jwt from "jsonwebtoken"
// import { ConfigService } from "@nestjs/config";
import { JwtService } from "src/jwt/jwt.service";
import { EditProfileInput } from "./dtos/edit-profile.dto";
import { Verification } from "./entities/verification.entity";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly users: Repository<User>,
        @InjectRepository(Verification)
        private readonly verifications: Repository<Verification>,
        // private readonly config: ConfigService,
        private readonly jwtService: JwtService
    ) {
        // jwtService.hello()
    }

    async createAccount({ email, password, role }: CreateAccountInput): Promise<{ ok: boolean, error?: string }> {
        try {
            //check new User exist
            const exists: User = await this.users.findOne({ email });
            if (exists) {
                return { ok: false, error: "email is already taken" };
            } else {
                const user = await this.users.save(this.users.create({ email, password, role }));  // create User and hash the pwd
                await this.verifications.save(this.verifications.create({user}))
                return { ok: true };
            }
        } catch (error) {
            return { ok: false, error: "Could't create User" };
        }
    }

    async login({ email, password }: LoginInput): Promise<LoginOutput> {
        // 이메일에 해당하는 유저 찾기 , 없으면
        try {
            const user: User = await this.users.findOne({ email },{
                select:["password"]
            }); // this.users ( Repo ) vs user (instance ) 
            if (!user) {
                return { ok: false, error: "User not found" }
            }
            const passwordCorrect = await user.checkPassword(password);
            if (!passwordCorrect) {
                return { ok: false, error: "Wrong password" }
            }
            // const token = jwt.sign({ id: user.id }, this.config.get("SECRET_KEY"));
            const token = this.jwtService.sign({ id: user.id });
            return { ok: true, token }
        } catch (error) {
            return { ok: false, error }
        }
        // JWT 생성해 주기
    }
    async findById(id:number):Promise<User>{
        return this.users.findOne({id});
    }

    // profile update
    async editProfile(userId:number, { email, password }:EditProfileInput){
        // TypeORM의 update 는 raw SQL문을 날려서 상당히 빠르지만 존재성,JS @BeforeUpdate() 가 작동이 안된다.
        // return this.users.update(userId,{...editProfileInput})
        const user = await this.users.findOne({id:userId});
        console.log(user);
        
        if(email) {
            user.email = email;
            user.verified = false;
            await this.verifications.save(this.verifications.create({user}));
        }
        if(password) user.password = password;
        return this.users.save(user);
    }

    async verifyEmail(code:string):Promise<boolean> {
        // const verification = await this.verifications.findOne({code},{relations:["user"]})
        // const verification = await this.verifications.findOne({code},{loadRelationIds:true})
        try {
            const verification = await this.verifications.findOne({code},{relations:["user"]} );
            if(verification) {
                verification.user.verified = true;
                this.users.save(verification.user);
                return true;
            }
            throw new Error();
        } catch (error) {
            console.log(error);
            return false;
        }
    }

}