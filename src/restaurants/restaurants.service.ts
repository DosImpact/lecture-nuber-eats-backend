import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Like, Raw, Repository } from 'typeorm';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import {
  CreateRestauranOutput,
  CreateRestaurantInput,
} from './dtos/create-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';
import {
  SearchRestaurantsInput,
  SearchRestaurantsOutput,
} from './dtos/search-restaurants.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';

/*

  [Restaurant]

C : createRestaurant

R.one
R.query
R.many

U : editRestaurant

D : deleteRestaurant

 [Category]

C : 

R.one
R.query
R.many  : allCategories

U : 

D : 
 
*/

@Injectable()
export class RestaurantsService {
  // db repository를 inject할 것이다.
  constructor(
    @InjectRepository(Restaurant) // 데코레이터, TypeORM의 connection.getRepository를 Inject한것임!, .find .save 등을 사용가능
    private readonly restaurants: Repository<Restaurant>,
    // @InjectRepository(Category)
    // private readonly categories: Repository<Category>,
    private readonly categories: CategoryRepository,
  ) {}

  // async getOrCreateCategory(name: string): Promise<Category> {
  //   const categoryName = name.trim().toLowerCase();
  //   const categorySlug = categoryName.replace(/ /g, '-');
  //   let category = await this.categories.findOne({ slug: categorySlug });
  //   if (!category) {
  //     category = await this.categories.save(
  //       this.categories.create({ slug: categorySlug, name: categoryName }),
  //     );
  //   }
  //   return category;
  // }

  // ------------ Restaurant

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestauranOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      // 릴레이션 owner는 User 객체를 통째로 넣어준다.
      newRestaurant.owner = owner;

      // 카테고리
      // 1. 없는경우 create + relation connect
      // 2. 있는 경우 relation connect

      // slug 란 id 대신에 enum을 보여주는것
      // eg) /1/lecture/2119 > /nuber-eats/lectures/2119

      // trim + lowercase ( front css 로 작업 )
      // const categoryName = createRestaurantDto.categoryName
      // .trim()
      // .toLowerCase();
      //  categoryName.replace(" ","-") 대신에 Reg를 사용 ( 한번만 작동 )
      const category = await this.categories.getOrCreate(
        createRestaurantInput.categoryName,
      );
      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not create restaurant',
      };
    }
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne(
        editRestaurantInput.restaurantId,
      );

      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }

      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: "You can't edit a restaurant that you don't own",
        };
      }
      let category: Category = null;
      if (editRestaurantInput.categoryName) {
        category = await this.categories.getOrCreate(
          editRestaurantInput.categoryName,
        );
      }
      await this.restaurants.save([
        {
          id: editRestaurantInput.restaurantId,
          ...editRestaurantInput,
          ...(category && { category }),
        },
      ]);

      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not edit Restaurant',
      };
    }
  }
  async deleteRestaurant(
    owner: User,
    { restaurantId }: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);

      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }

      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: "You can't delete a restaurant that you don't own",
        };
      }

      await this.restaurants.delete(restaurantId);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not delete restaurant.',
      };
    }
  }

  countRestaurants(category: Category) {
    return this.restaurants.count({ category });
  }

  async findCategoryBySlug({
    slug,
    page,
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      // 카테고리에 관계된 레스토랑은 따로 load한다.
      const category = await this.categories.findOne(
        { slug },
        // { relations: ['restaurants'] },
      );
      const restaurants = await this.restaurants.find({
        where: { category },
        take: 25,
        skip: (page - 1) * 25,
      });
      //  category.restaurants 은  없다. restaurants 은 밖의 필드로 뺌.
      // category.restaurants = restaurants;

      const total = await this.countRestaurants(category);

      if (!category) {
        return {
          ok: false,
          error: 'Category not found',
        };
      }
      return {
        ok: true,
        category,
        restaurants,
        totalPage: Math.ceil(total / 25),
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load category',
      };
    }
  }

  async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
    try {
      const [restaurants, totalResults] = await this.restaurants.findAndCount({
        skip: (page - 1) * 25,
        take: 25,
      });

      return {
        ok: true,
        results: restaurants,
        totalResults: totalResults,
        totalPage: Math.ceil(totalResults / 25),
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not load restaurants',
      };
    }
  }

  async findRestaurantById({
    restaurantId,
  }: RestaurantInput): Promise<RestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId, {
        relations: ['menu'],
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      return {
        ok: true,
        restaurant,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not find restaurant',
      };
    }
  }
  async searchRestaurantByName({
    page,
    query,
  }: SearchRestaurantsInput): Promise<SearchRestaurantsOutput> {
    // 1. case sensitive    eg:    where: { name: Like(`%${query}%`) },
    // 2. case insensitive  eg) where: { name: Raw(name => `${name} ILIKE '%${query}%'`) },
    try {
      const [restaurants, totalResults] = await this.restaurants.findAndCount({
        // where: { name: Like(`%${query}%`) },
        where: { name: Raw(name => `${name} ILIKE '%${query}%'`) },
        skip: (page - 1) * 25,
        take: 25,
      });
      return {
        ok: true,
        restaurants,
        totalResults,
        totalPage: Math.ceil(totalResults / 25),
      };
    } catch (error) {}

    return { ok: true };
  }

  // ------------ Categories

  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      return {
        ok: true,
        categories,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load categories',
      };
    }
  }

  // ------------ Dish

  async createDish(
    owner: User,
    createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    return { ok: false };
  }
}
