import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import { CreateRestaurantInputDto } from "./dtos/create-restaurantInput.dto";
import { Restaurant } from "./entities/restaurant.entity";
import { RestaurantsService } from "./restaurants.service";


@Resolver(of => Restaurant) // 레스트로랑의 엔터티
export class RestaurantResolver {

    constructor(private readonly restaurantService:RestaurantsService){}

    // 간단한 리소버
    @Query(returns => Boolean)
    isPizzaGood(): Boolean {
        return true;
    }
    //object타입의 리소버 , 리턴값은 null일 수 있다.
    @Query(returns => [Restaurant], { nullable: true })
    restaurants(): Promise<Restaurant[]> { //Promise 리턴타입
        return this.restaurantService.getAll();
    }

    @Mutation(returns => Boolean)
    createRestaurantWithArgs(
        @Args('name') name: string,
        @Args('isVegan') isVegan: boolean,
        @Args('address') address: string,
        @Args('ownerName') ownerName: string
    ): boolean {
        return true
    }


    @Mutation(returns => Boolean)
    async createRestaurantWithInputType(
        @Args('CreateRestaurantInputDto') CreateRestaurantInputDto: CreateRestaurantInputDto
    ): Promise<boolean> {
        try {
            await this.restaurantService.createRestaurant(CreateRestaurantInputDto);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    @Mutation(returns => Boolean)
    async createRestaurant(
        @Args() createRestaurantDto: CreateRestaurantDto
    ): Promise<boolean> {
        try {
            await this.restaurantService.createRestaurant(createRestaurantDto);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}