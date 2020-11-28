import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { VerfiyEmailOutput, VerifyEmailInput } from './dtos/verify-email.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Query(returns => Boolean)
    hi() {
        return true;
    }

    @Mutation(returns => CreateAccountOutput)
    async createAccount(@Args("input") createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
        try {
            const { ok, error } = await this.usersService.createAccount(createAccountInput);
            return { ok, error };
        } catch (error) {
            return { ok: false, error }
        }
    }

    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        try {
            const { ok, error, token } = await this.usersService.login(loginInput);
            return { ok, error, token }
        } catch (error) {
            return { ok: false, error }
        }
    }
    
    // JWT 토큰을 활용해서, 현재 나를 얻어와 리턴하기 - Authentication
    @UseGuards(AuthGuard) // 해당 요청은 가드되어지고 있다. - req.user가 없으면 forbidden
    @Query(returns =>User)
    me(@AuthUser() authUser:User , @Context() context){
        // console.log("context",context.user);
        // return context['user']
        return authUser;
    }

    // 다른 유저의 Id를 통해 조회하기.
    @UseGuards(AuthGuard)
    @Query(returns => UserProfileOutput)
    async userProfile(@Args() userProfileInput:UserProfileInput ):Promise<UserProfileOutput>{
        try {
            const user = await this.usersService.findById(userProfileInput.userId);
            if(!user){
                throw new Error();
            }
            return {
                ok:true,
                user
            }
        } catch (error) {
            return {
                ok:false,
                error:`User Not Found : ${userProfileInput.userId}`
            }
        }
    }

    @UseGuards(AuthGuard)
    @Query(returns => EditProfileOutput)
    async editProfile(@AuthUser() authUser:User,@Args('input') editProfileInput:EditProfileInput ):Promise<EditProfileOutput>{
        try {
            await this.usersService.editProfile(authUser.id,editProfileInput);
        } catch (error) {
            return{
                ok:false,
                error
            }
        }
        return{
            ok:true
        }
    }

    @Mutation(returns=>VerfiyEmailOutput)
    async verfifyEmail(@Args("input") {code}:VerifyEmailInput ){
        try {
            await this.usersService.verifyEmail(code);
            return {
                ok: true,
            };
        } catch (error) {
            return {
                ok: false,
                error
            };
        }

    }
}
