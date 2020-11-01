import { Field, InputType } from "@nestjs/graphql";


// @InputType() // 인풋타입 : 하나의 인풋만 정의 가능 > ArgsType : 여러개 가능
@InputType()
export class CreateRestaurantInputDto {
    @Field(type => String)
    name: string;
    @Field(type => Boolean)
    isVegan: boolean;
    @Field(type => String)
    address: string;
    @Field(type => String)
    ownerName: string;
}