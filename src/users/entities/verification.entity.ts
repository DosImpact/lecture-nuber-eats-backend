import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { User } from "./user.entity";


@InputType({isAbstract:true})
@ObjectType()
@Entity()
export class Verification extends CoreEntity{

    @Column()
    @Field(type=>String)
    code:string;

    @OneToOne(type=>User,{onDelete:'CASCADE'})       // 1:1 relation + CASCADE 명확한 삭제
    @JoinColumn()               // JoinColumn 필수
    user:User;                  // User 타입

    @BeforeInsert()
    createCode():void{
        this.code = uuidv4();
    }
}