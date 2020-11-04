import { RestaurantsService } from './restaurants.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantResolver } from './restaurants.resolver';

// 리소버 데코레이터를 장착한다.
@Module({
    imports:[
         TypeOrmModule.forFeature([Restaurant]) // service에서 RestaurantRepository 만들기 위한 임포트
    ],
    providers: [
        RestaurantsService, 
        RestaurantResolver
    ]
})
export class RestaurantsModule { }
