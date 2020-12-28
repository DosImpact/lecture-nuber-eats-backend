import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsEnum } from 'class-validator';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

/**
 * id , createdAt, updatedAt ( 모든 entity의 디폴트)
 * email, password, role(client,owner,delivery)
 *
 */
// type UserRole = "client" | "owner" | "delivery"; // Change to enum
enum UserRole {
  Owner,
  Client,
  Delivery,
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field(type => String)
  password: string;

  @Column({ type: 'enum', enum: UserRole }) // setting : type to enum..
  @Field(type => UserRole) // register first and use UserRoleEnum
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field(type => Boolean)
  verified: boolean;

  // 레스토랑은 반드시 하나의 카테고리만 가진다. (one) [ me ]
  // To
  // 카테고리는 여러 레스토랑은 갖는다.  ( many )
  @OneToMany(
    type => Restaurant,
    restaurant => restaurant.owner,
    { nullable: true },
  )
  @Field(type => [Restaurant], { nullable: true })
  restaurant: Restaurant[];

  @BeforeInsert() // DB에 Save 할때 거치는 미들웨어같은 함수
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    // password 필드는 있을 수도 없을수도 있는 selectable 필드다.
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }
  // User Entity에 CheckPassword 기능을 추가해 줬다.
  // User 타입에서 사용가능, User Repo 타입이 아니다.!
  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
