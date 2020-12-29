import { SetMetadata } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import {
  CreateRestauranOutput,
  CreateRestaurantInput,
} from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantsService } from './restaurants.service';

@Resolver(of => Restaurant) // 레스트로랑의 엔터티
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Mutation(() => CreateRestauranOutput)
  // @SetMetadata('roles', [UserRole.Owner])
  @Role([UserRole.Owner])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestauranOutput> {
    return this.restaurantService.createRestaurant(
      authUser,
      createRestaurantInput,
    );
  }
}
