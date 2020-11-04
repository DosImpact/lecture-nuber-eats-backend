import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

}
