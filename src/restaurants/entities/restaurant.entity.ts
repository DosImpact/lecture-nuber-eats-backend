import { Field, ObjectType } from "@nestjs/graphql";

// gprahql 에서 oject 스키마를 정의하고 싶다.

@ObjectType()
export class Restaurant {
    //해당 필드에 대해 데코레이팅
    @Field(type => String)
    name: string;

    //해당 필드에 대해 데코레이팅 , null이어도 됨
    @Field(type => Boolean, { nullable: true })
    isGood?: boolean

}