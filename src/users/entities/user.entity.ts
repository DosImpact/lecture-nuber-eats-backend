import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, Column, Entity } from "typeorm";
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from "@nestjs/common";



/**
 * id , createdAt, updatedAt ( 모든 entity의 디폴트)
 * email, password, role(client,owner,delivery)
 * 
 */
// type UserRole = "client" | "owner" | "delivery"; // Change to enum
enum UserRole {
    Owner,
    Client,
    Delivery
}

registerEnumType(UserRole,{name:"UserRole"})

@InputType({isAbstract:true})
@ObjectType()
@Entity()
export class User extends CoreEntity {

    @Column()
    @Field(type=>String)
    email:string

    @Column()
    @Field(type=>String)
    password:string
    
    @Column({type:'enum',enum:UserRole}) // setting : type to enum..
    @Field(type=>UserRole)              // register first and use UserRoleEnum
    role:UserRole

    @BeforeInsert()
    async hashPassword():Promise<void>{
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException();
        }
    }

}