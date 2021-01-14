import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/users/entities/user.entity';
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
    // console.log(context);
    const roles = this.reflector.get<AllowRoles>('roles', context.getHandler());
    // console.log(roles);
    if (!roles) {
      return true; // role 데코레이터가 없는 리소버 무조건 허용 & 생판 모르는 request 허용
    }

    // http context 와 gql context를 다르다. 해당 context를 변경해주는과정
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;
    if (token) {
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user } = await this.usersService.findById(decoded['id']);
        if (!user) {
          return false; // role 데코레이터가 있는 리소버중  header token이 없는것 = authentication (인증이 안됌)
        }
        if (user) {
          gqlContext['user'] = user;
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
