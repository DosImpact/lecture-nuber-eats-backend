import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@InputType('CategoryInputType', { isAbstract: true }) // Object타입을 메인으로 사용하는데, mappedType을 사용하기 위해 InputType이 필요해서,abstract함
@ObjectType() // gprahql 에서 oject 스키마를 정의하고 싶다.
@Entity() // Entity 를 정의하므로써 typeORM의 모델을 정의한다. 이둘을 결합이 가능
export class Category extends CoreEntity {
  @Field(type => String) //Graphql Object의 필드
  @Column() //TypeORM 의 컬럼
  @IsString() // DTO Check
  @Length(5)
  name: string;

  @Field(type => String)
  @Column()
  @IsString()
  coverImg: string;

  @OneToMany(
    type => Restaurant,
    restaurant => restaurant.category,
  )
  @Field(type => [Restaurant])
  restaurant: Restaurant[];
}
