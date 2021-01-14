import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './orders.service';

import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/common/common.constants';

@Resolver(of => Order)
export class OrderResolver {
  constructor(
    private readonly ordersService: OrderService,
    @Inject(PUB_SUB)
    private readonly pubsub: PubSub,
  ) {}

  @Mutation(returns => CreateOrderOutput)
  @Role(['Client'])
  async createOrder(
    @AuthUser() customer: User,
    @Args('input')
    createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.ordersService.crateOrder(customer, createOrderInput);
  }

  @Mutation(returns => Boolean)
  potatoReady() {
    this.pubsub.publish('hotPotatos', {
      // 1. key 이름이 동일
      readyPotato: 'YOur potato is ready. love you.', // payload는 key 이름이 subscription 함수 이름 동일
    });
    return true;
  }

  @Subscription(returns => String)
  @Role(['Any'])
  readyPotato() {
    return this.pubsub.asyncIterator('hotPotatos');
  }
}
