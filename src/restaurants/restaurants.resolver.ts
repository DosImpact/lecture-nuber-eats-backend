import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import { CreateRestaurantInputDto } from "./dtos/create-restaurantInput.dto";
import { Restaurant } from "./entities/restaurant.entity";


@Resolver(of => Restaurant) // 레스트로랑의 엔터티
export class RestaurantResolver {
    // 간단한 리소버
    @Query(returns => Boolean)
    isPizzaGood(): Boolean {
        return true;
    }
    //object타입의 리소버 , 리턴값은 null일 수 있다.
    @Query(returns => [Restaurant], { nullable: true })
    myRestaurant(@Args('veganOnly') veganOnly: boolean): Restaurant[] { // args 정의는 nestjs에게 요청
        return [];
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
    createRestaurantWithInputType(
        @Args('CreateRestaurantInputDto') CreateRestaurantInputDto: CreateRestaurantInputDto
    ): boolean {
        return true
    }

    @Mutation(returns => Boolean)
    createRestaurant(
        @Args() createRestaurantDto: CreateRestaurantDto
    ): boolean {
        return true
    }
}