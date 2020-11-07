import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity } from "typeorm";


/**
 * id , createdAt, updatedAt ( 모든 entity의 디폴트)
 * email, password, role(client,owner,delivery)
 * 
 */
type UserRole = "client" | "owner" | "delivery";

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
    
    @Column()
    @Field(type=>String)
    role:UserRole

}