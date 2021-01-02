import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  PaginationInput,
  PaginationOutout,
} from 'src/common/dtos/pagination.dto';
import { Category } from '../entities/category.entity';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class CategoryInput extends PaginationInput {
  @Field(() => String)
  slug: string;
}

@ObjectType()
export class CategoryOutput extends PaginationOutout {
  //
  @Field(type => Restaurant, { nullable: true })
  restaurants?: Restaurant[];

  // Category 안에 Restaurant을 빼고 위에 적어두었다.
  @Field(type => Category, { nullable: true })
  category?: Category;
}
