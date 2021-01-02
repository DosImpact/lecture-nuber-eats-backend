// 검색어를 통해 레스토랑들 결과 - pagination 반드시

import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutout,
} from 'src/common/dtos/pagination.dto';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class SearchRestaurantsInput extends PaginationInput {
  @Field(() => String)
  query: string;
}

@ObjectType()
export class SearchRestaurantsOutput extends PaginationOutout {
  @Field(() => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];
}
