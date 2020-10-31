import { Module } from '@nestjs/common';
import { RestaurantResolver } from './restaurants.resolver';

// 리소버 데코레이터를 장착한다.
@Module({
    providers: [RestaurantResolver]
})
export class RestaurantsModule { }
