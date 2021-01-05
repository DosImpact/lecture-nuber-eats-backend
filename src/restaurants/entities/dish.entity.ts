// dish 앤터티
// name,price, photo, description,
// restaurant,restaurantId

import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@InputType('DishChoiceInputType', { isAbstract: true })
@ObjectType()
export class DishChoice {
  @Field(type => String)
  name: string; // XL,L,곱빼기
  @Field(type => Int, { nullable: true })
  extra?: number; // +3달라
}

@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
export class DishOption extends CoreEntity {
  // 이름 옵션명들 엑스트라가격
  @Field(type => String)
  name: string; // 하와이안 피자.

  @Field(type => [DishChoice], { nullable: true })
  choices?: DishChoice[]; // 크기 초이스

  @Field(type => Int, { nullable: true })
  extra?: number; // 5달라
}

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field(type => Int)
  @Column()
  @IsNumber()
  price: number;

  @Field(type => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  photo: string;

  @Field(type => String)
  @Column()
  @IsString()
  @Length(5, 140)
  description: string;

  @ManyToOne(
    type => Restaurant,
    restaurant => restaurant.menu,
  )
  @Field(() => Restaurant)
  restaurant: Restaurant;

  @RelationId((dish: Dish) => dish.restaurant)
  restaurantId: number;

  // DB json형태로 저장, GQL에서는 이를 Class로 처리!
  @Field(type => [DishOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: DishOption[];
}
