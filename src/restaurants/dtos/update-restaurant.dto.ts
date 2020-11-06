import { ArgsType, Field, InputType,   PartialType } from "@nestjs/graphql";
import { CreateRestaurantInputDto } from "./create-restaurantInput.dto";


// @InputType() // 인풋타입 : 하나의 인풋클래스로 정의 가능, Args가 Object인것임
// extends OmitType : 3번째 인자로 InputType을 넣어서 데코레이터의 Type을 일치시켜야함
@InputType()
export class UpdateRestaurantInputType extends PartialType(CreateRestaurantInputDto) {
 
}
// 1.  CreateDTO를 PartialType으로 받아서, 전부 optional한 field로 UpdateRestaurantInputType 만들기
// 2. id 가 있어야 update가 되므로, 아래 Field에 id를 추가해 새로운 클래스를 생성
@InputType()
export class UpdateRestaurantDto{
    @Field(type => Number)
    id: number;

    @Field(type => UpdateRestaurantInputType)
    data: UpdateRestaurantInputType;

}
