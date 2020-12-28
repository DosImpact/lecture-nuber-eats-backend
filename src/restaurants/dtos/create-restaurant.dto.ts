import { ArgsType, Field, OmitType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import { Restaurant } from '../entities/restaurant.entity';

// @ArgsType() // class안의 내용물을 ... spread 한것처럼  args를 받는다.,
@ArgsType()
export class CreateRestaurantDto extends OmitType(Restaurant, ['id']) {}
