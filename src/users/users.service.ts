import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';

// import * as jwt from "jsonwebtoken"
// import { ConfigService } from "@nestjs/config";
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { MailService } from 'src/mail/mail.service';
import { UserProfileOutput } from 'src/users/dtos/user-profile.dto';
import { VerfiyEmailOutput } from 'src/users/dtos/verify-email.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    // private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {
    // jwtService.hello()
  }

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      //check new User exist
      const exists: User = await this.users.findOne({ email });
      console.log(exists);

      if (exists) {
        return { ok: false, error: 'email is already taken' };
      } else {
        const user = await this.users.save(
          this.users.create({ email, password, role }),
        ); // create User and hash the pwd
        const verification = await this.verifications.save(
          this.verifications.create({ user }),
        );
        // 🚀
        // this.mailService.sendVerificationEmail(user.email, verification.code); // 비동기 처리

        return { ok: true };
      }
    } catch (error) {
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    // 이메일에 해당하는 유저 찾기 , 없으면
    try {
      const user: User = await this.users.findOne(
        { email },
        {
          select: ['password', 'id'], // password는 기본적으로 안준다. 그래서  select를 쓰는 순간 password를 가져오지만 다른것들은 안가져옴
        },
      ); // this.users ( Repo ) vs user (instance )
      // console.log('login', user);

      if (!user) {
        return { ok: false, error: 'User not found' };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return { ok: false, error: 'Wrong password' };
      }
      // const token = jwt.sign({ id: user.id }, this.config.get("SECRET_KEY"));
      const token = this.jwtService.sign({ id: user.id });
      return { ok: true, token };
    } catch (error) {
      return { ok: false, error: "Can't log user in." };
    }
    // JWT 생성해 주기
  }
  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneOrFail({ where: { id } });
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'User Not Found',
      };
    }
  }

  // profile update
  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    // TypeORM의 update 는 raw SQL문을 날려서 상당히 빠르지만 존재성,JS @BeforeUpdate() 가 작동이 안된다.
    // return this.users.update(userId,{...editProfileInput})
    const user = await this.users.findOne(userId);
    console.log(user);
    try {
      if (email) {
        user.email = email;
        user.verified = false;
        // error : 기존의 verficiation이 제거되고 아래의 새로운 verification으로 대처되어야함.
        const ver = await this.verifications.findOne(
          { user: { id: user.id } },
          { relations: ['user'] },
        );
        if (ver) {
          await this.verifications.delete(ver.id);
        }
        await this.verifications.save(this.verifications.create({ user }));
        //🚀
        // this.mailService.sendVerificationEmail(user.email, verification.code); // 비동기 처리
      }
      if (password) user.password = password;

      await this.users.save(user); // update 가 아닌 users.save(user) 로 @BeforeUpdate 를 거친다.
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: 'Could not update profile.' };
    }
  }

  async verifyEmail(code: string): Promise<VerfiyEmailOutput> {
    // const verification = await this.verifications.findOne({code},{relations:["user"]})
    // const verification = await this.verifications.findOne({code},{loadRelationIds:true})
    try {
      const verification = await this.verifications.findOne(
        { code },
        { relations: ['user'] },
      );
      if (verification) {
        verification.user.verified = true;
        await this.users.save(verification.user);
        await this.verifications.delete(verification.id);
        return { ok: true };
      }
      // throw new Error();
      return { ok: false, error: 'Verification not found' };
    } catch (error) {
      console.log(error);
      // return false;
      return { ok: false, error };
    }
  }
}
