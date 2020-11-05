import { InputType, Field, OmitType } from "@nestjs/graphql";
import { IsBoolean, IsString, Length } from "class-validator";
import { Restaurant } from "../entities/restaurant.entity";


// @InputType() // 인풋타입 : 하나의 인풋클래스로 정의 가능, Args가 Object인것임
// extends OmitType : 3번째 인자로 InputType을 넣어서 데코레이터의 Type을 일치시켜야함
@InputType()
export class CreateRestaurantInputDto extends OmitType(Restaurant,["id"]) {
    // @Field(type => String)
    // @IsString()
    // @Length(5, 1)
    // name: string;

    // @Field(type => Boolean)
    // @IsBoolean()
    // isVegan: boolean;


    // @Field(type => String)
    // @IsString()
    // address: string;

    // @Field(type => String)
    // @IsString()
    // @Length(5, 10)
    // ownerName: string;
}
