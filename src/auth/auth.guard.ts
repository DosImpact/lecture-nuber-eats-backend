import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
import { AllowRoles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowRoles>('roles', context.getHandler());

    // Auth1 - public
    if (!roles) {
      return true; // role 데코레이터가 없는 리소버 무조건 허용 & 생판 모르는 request 허용
    }

    // Auth1 - needed

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;
    if (token) {
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user } = await this.usersService.findById(decoded['id']);
        // role 데코레이터가 있는 리소버중  header token이 없는것 = authentication (인증이 안됌)
        if (!user) {
          return false;
        }
        if (user) {
          gqlContext['user'] = user;
          // Auth2 - needed
          if (roles.includes('Any')) {
            return true;
          }
          return roles.includes(user.role);
        }
      }
    }
    // console.log(gqlContext);
    // const user: User = gqlContext['user'];
    // console.log(user);
    // if (!user) {
    //   return false; // role 데코레이터가 있는 리소버중  header token이 없는것 = authentication (인증이 안됌)
    // }
    // if (roles.includes('Any')) {
    //   return true;
    // }
    // return roles.includes(user.role);
    // [ "Any ?? "]
  }
}
