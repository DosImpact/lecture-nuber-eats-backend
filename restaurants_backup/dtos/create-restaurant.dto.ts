import { ArgsType, Field } from "@nestjs/graphql";
import { IsBoolean, IsString, Length } from "class-validator";


// @ArgsType() // class안의 내용물을 ... spread 한것처럼  args를 받는다., 
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

    // @Field(type => String)
    // @IsString()
    // @Length(5, 10)
    // ownerName: string;
}