import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Category } from './category.entity';
import { Dish } from './dish.entity';

@InputType('RestaurantInputType', { isAbstract: true }) // Object타입을 메인으로 사용하는데, mappedType을 사용하기 위해 InputType이 필요해서,abstract함
@ObjectType() // gprahql 에서 oject 스키마를 정의하고 싶다.
@Entity() // Entity 를 정의하므로써 typeORM의 모델을 정의한다. 이둘을 결합이 가능
export class Restaurant extends CoreEntity {
  //해당 필드에 대해 데코레이팅
  @PrimaryGeneratedColumn()
  @Field(type => Number)
  id: number;

  @Column() //TypeORM 의 컬럼
  @Field(type => String) //Graphql Object의 필드
  @IsString() // DTO Check
  name: string;

  //해당 필드에 대해 데코레이팅 , null이어도 됨
  // @Field(type => Boolean, { nullable: true })
  // isGood?: boolean

  @Column()
  @Field(type => String)
  @IsString()
  coverImg: string;

  @Column()
  @Field(type => String, { defaultValue: '주소를 입력해주세요' })
  @IsString()
  address: string;

  // @Column()
  // @Field(type => String)
  // @IsString()
  // ownerName: string;

  // 카테고리는 여러 레스토랑은 갖는다.  ( many ) [ me ]
  // To
  // 레스토랑은 반드시 하나의 카테고리만 가진다. (one)
  @Field(type => Category, { nullable: true })
  @ManyToOne(
    type => Category,
    category => category.restaurants,
    { nullable: true, onDelete: 'SET NULL' },
  )
  category: Category;

  @Field(type => User, { nullable: true })
  @ManyToOne(
    type => User,
    user => user.restaurant,
    { nullable: true },
  )
  owner: User;

  // 일대다 관계에서 키를 가져오는 옵션이다.
  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;

  @Field(type => [Dish])
  @OneToMany(
    type => Dish,
    dish => dish.restaurant,
  )
  menu: Dish[];

  // Relation Order

  @Field(type => [Order])
  @OneToMany(
    type => Order,
    order => order.restaurant,
  )
  orders: Order[];
}
