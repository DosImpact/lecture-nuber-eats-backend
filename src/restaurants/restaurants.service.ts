import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateRestauranOutput,
  CreateRestaurantInput,
} from './dtos/create-restaurant.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantsService {
  // db repository를 inject할 것이다.
  constructor(
    @InjectRepository(Restaurant) // 데코레이터, TypeORM의 connection.getRepository를 Inject한것임!, .find .save 등을 사용가능
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantDto: CreateRestaurantInput,
  ): Promise<CreateRestauranOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantDto);
      // 릴레이션 owner는 User 객체를 통째로 넣어준다.
      newRestaurant.owner = owner;

      // 카테고리
      // 1. 없는경우 create + relation connect
      // 2. 있는 경우 relation connect

      // slug 란 id 대신에 enum을 보여주는것
      // eg) /1/lecture/2119 > /nuber-eats/lectures/2119

      // trim + lowercase ( front css 로 작업 )
      const categoryName = createRestaurantDto.categoryName
        .trim()
        .toLowerCase();
      //  categoryName.replace(" ","-") 대신에 Reg를 사용 ( 한번만 작동 )
      const categorySlug = categoryName.replace(/ /g, '-');
      let category = await this.categories.findOne({
        where: { slug: categorySlug },
      });

      if (!category) {
        category = await this.categories.save(
          this.categories.create({ name: categoryName, slug: categorySlug }),
        );
      }
      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not create restaurant' };
    }
  }
}
