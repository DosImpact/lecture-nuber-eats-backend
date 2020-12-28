import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@InputType({isAbstract:true}) // Object타입을 메인으로 사용하는데, mappedType을 사용하기 위해 InputType이 필요해서,abstract함
@ObjectType()   // gprahql 에서 oject 스키마를 정의하고 싶다.
@Entity()       // Entity 를 정의하므로써 typeORM의 모델을 정의한다. 이둘을 결합이 가능
export class Restaurant {
    //해당 필드에 대해 데코레이팅
    @PrimaryGeneratedColumn()
    @Field(type => Number)
    id: number;

    @Column()               //TypeORM 의 컬럼
    @Field(type => String)  //Graphql Object의 필드
    @IsString()             // DTO Check
    @Length(5)
    name: string;

    //해당 필드에 대해 데코레이팅 , null이어도 됨
    // @Field(type => Boolean, { nullable: true })
    // isGood?: boolean

    @Column({default:true})                     // DB에 들어갈때 디폴트값
    @Field(type => Boolean,{nullable:true}) //{defaultValue:true} , {nullable:true} 
    @IsOptional()
    @IsBoolean()
    isVegan?: boolean;

    @Column()
    @Field(type => String,{defaultValue:"주소를 입력해주세요"})
    @IsString()
    address: string;

    // @Column()
    // @Field(type => String)
    // @IsString()
    // ownerName: string;

    // @Column()
    // @Field(type => String)
    // @IsString()
    // categoryName:string;

}