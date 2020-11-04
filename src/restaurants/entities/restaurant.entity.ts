import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@ObjectType()   // gprahql 에서 oject 스키마를 정의하고 싶다.
@Entity()       // Entity 를 정의하므로써 typeORM의 모델을 정의한다. 이둘을 결합이 가능
export class Restaurant {
    //해당 필드에 대해 데코레이팅
    @PrimaryGeneratedColumn()
    @Field(type => Number)
    id: number;

    @Field(type => String)  //Graphql Object의 필드
    @Column()       //TypeORM 의 컬럼
    name: string;

    //해당 필드에 대해 데코레이팅 , null이어도 됨
    // @Field(type => Boolean, { nullable: true })
    // isGood?: boolean
    @Field(type => Boolean)
    @Column()
    isVegan: boolean;

    @Field(type => String)
    @Column()
    address: string;

    @Field(type => String)
    @Column()
    ownerName: string;

    @Field(type => String)
    @Column()
    categoryName:string;

}