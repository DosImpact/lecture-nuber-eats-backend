import { RestaurantsService } from './restaurants.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';
import { Dish } from './entities/dish.entity';

import {
  CategoryResolver,
  DishResolver,
  RestaurantResolver,
} from './restaurants.resolver';
// import { Category } from './entities/category.entity';

// 리소버 데코레이터를 장착한다.
@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, CategoryRepository, Dish]), // service에서 RestaurantRepository 만들기 위한 임포트,
  ],
  providers: [
    RestaurantsService,
    RestaurantResolver,
    CategoryResolver,
    DishResolver,
  ],
})
export class RestaurantsModule {}
