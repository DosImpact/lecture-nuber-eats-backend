import { ArgsType, Field } from "@nestjs/graphql";
import { IsBoolean, IsString, Length } from "class-validator";


// @InputType() // 인풋타입 : 하나의 인풋만 정의 가능 > ArgsType : 여러개 가능
@ArgsType()
export class CreateRestaurantDto {
    @Field(type => String)
    @IsString()
    @Length(5, 1)
    name: string;

    @Field(type => Boolean)
    @IsBoolean()
    isVegan: boolean;


    @Field(type => String)
    @IsString()
    address: string;

    @Field(type => String)
    @IsString()
    @Length(5, 10)
    ownerName: string;
}