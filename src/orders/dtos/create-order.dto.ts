import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { OrderItemOption } from '../entities/order-item.entity';

@InputType()
class CreateOrderItemInput {
  @Field(type => Int)
  dishId: number;

  @Field(type => [OrderItemOption], { nullable: true })
  options?: OrderItemOption[];
}

// 어느 레스토랑의, 메뉴를 시켰는가 ( 복수개의 메뉴 )
// 그 메뉴의 id 와 옵션값은 ?
@InputType()
export class CreateOrderInput {
  @Field(type => Int)
  restaurantId: number;

  @Field(type => [CreateOrderItemInput])
  items: CreateOrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {}
