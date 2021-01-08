import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
  ) {}

  async crateOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    const restaurant = await this.restaurants.findOne(restaurantId);
    if (!restaurant) {
      return {
        ok: false,
        error: 'Restaurant not found',
      };
    }
    // 메뉴들을 돌면서, - 애러 throw 대신에 return을 위해서 for loop of 사용
    // 메뉴에 대한 id로 dish를 검색
    for (const item of items) {
      const dish = await this.dishes.findOne(item.dishId);
      if (!dish) {
        return {
          ok: false,
          error: 'Dish not Found',
        };
      }
      console.log(`Dish price: ${dish.price}`);
      for (const itemOption of item.options) {
        const dishOption = dish.options.find(
          dishOption => dishOption.name === itemOption.name,
        );
        if (dishOption) {
          if (dishOption.extra) {
            console.log(`$USD + ${dishOption.extra}`);
          } else {
            const dishOptionChoice = dishOption.choices.find(
              optionChoice => optionChoice.name === itemOption.choice,
            );
            if (dishOptionChoice) {
              if (dishOptionChoice.extra) {
                console.log(`$USD + ${dishOptionChoice.extra}`);
              }
            }
          }
        }
      }
    }

    // const order = await this.orders.save(
    //   this.orders.create({
    //     customer,
    //     restaurant,
    //   }),
    // );
    // console.log(order);
  }
}
