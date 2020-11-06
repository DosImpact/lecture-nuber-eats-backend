import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

/**
 * Note:
 
  1. nest g mo|r|s users
 * Module를 추가하면,
 * provider: resolver(controller), service 추가하기
 * imports :  TYPE forFeature  추가하기

 1.1 UserService
 - InjectRepository 추가
 
 1.2 UsersResolver
 - UserService 추가

 * - 1. entities를 모델링하고 
 * - 2. dtos 를 작성한다.
 * - 3. 비즈니스 로직 CRUD 를 구성한다.
 
 */
@Module({
    imports:[TypeOrmModule.forFeature([User])],
    providers: [UsersResolver,UsersService]
})
export class UsersModule {}

