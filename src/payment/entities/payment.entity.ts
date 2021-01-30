import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@InputType('PaymentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Payment extends CoreEntity {
  // 트랜젝션 아이디,
  @Field(type => String)
  @Column({ unique: true })
  transactionId: string;
  // 어떤 사용자의 결제인가

  @Field(type => User)
  @ManyToOne(
    type => User,
    user => user.payment,
  )
  user: User;

  @RelationId((payment: Payment) => payment.user)
  userId: number;

  // 어떤 레스토랑의 결제인가
  @Field(type => Restaurant)
  @ManyToOne(type => Restaurant)
  restaurant: Restaurant;

  @Field(type => Int)
  @RelationId((payment: Payment) => payment.restaurant)
  restaurantId: number;
}
