import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantInputDto } from './dtos/create-restaurantInput.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantsService {
    // db repository를 inject할 것이다.
    constructor(
        @InjectRepository(Restaurant) // 데코레이터, TypeORM의 connection.getRepository를 Inject한것임!, .find .save 등을 사용가능
        private readonly restaurant:Repository<Restaurant>){}
    getAll(): Promise<Restaurant[]>{
        return this.restaurant.find();   // find() 결과는 Promise로 나온다.
    }
    //type orm > create > save
    // 1. create : JS,TS 단에서 class를 만든것 (이미 DTO로 만들었다.)
    // 2. save : 실질적으로 DB에 저장 
    createRestaurant(createRestaurantDto:CreateRestaurantInputDto):Promise<Restaurant> {
        const newRestaurant = this.restaurant.create(createRestaurantDto);
        return this.restaurant.save(newRestaurant);
    }
}
