import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './orders.service';

import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import { PUB_SUB, NEW_PENDING_ORDER } from 'src/common/common.constants';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/edit-order.dto';

@Resolver(of => Order)
export class OrderResolver {
  constructor(
    private readonly ordersService: OrderService,
    @Inject(PUB_SUB)
    private readonly pubSub: PubSub,
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

  @Query(returns => GetOrdersOutput)
  @Role(['Any'])
  async getOrders(
    @AuthUser() user: User,
    @Args('input') getOrdersInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.ordersService.getOrders(user, getOrdersInput);
  }

  @Query(returns => GetOrderOutput)
  @Role(['Any'])
  async getOrder(
    @AuthUser() user: User,
    @Args('input') getOrderInput: GetOrderInput,
  ): Promise<GetOrderOutput> {
    return this.ordersService.getOrder(user, getOrderInput);
  }

  @Mutation(returns => EditOrderOutput)
  @Role(['Any'])
  async editOrder(
    @AuthUser() user: User,
    @Args('input') editOrderInput: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return this.ordersService.editOrder(user, editOrderInput);
  }

  @Subscription(returns => Order, {
    filter: ({ pendingOrders: { ownerId } }, _, { user }) => {
      return ownerId === user.id;
    },
    resolve: ({ pendingOrders: { order } }) => order,
  })
  @Role(['Owner'])
  pendingOrders() {
    return this.pubSub.asyncIterator(NEW_PENDING_ORDER);
  }

  // // 뮤테이션으로 pubsub에 publish
  // @Mutation(returns => Boolean)
  // pizzaOrder(@Args('pizzaId') pizzaId: number, @Args('ment') ment: string) {
  //   this.pubSub.publish('pizza', {
  //     // 누군가 pizza라는 key로 listen중이라면 그들에게 payload를 날린다.
  //     pizzaOrderChange: pizzaId,
  //     ment,
  //   });
  //   return true;
  // }
  // // subscription - pubsub - subscribe == asyncInterator
  // @Subscription(returns => String, {
  //   filter: (payload, variables, context) => {
  //     // 상대의 payload, 나의 variables, context
  //     console.log(payload, variables, context);
  //     const { pizzaOrderChange } = payload;
  //     const { listenPizzaId } = variables;
  //     return pizzaOrderChange === listenPizzaId; // filter 이용해서 나의 pizzaId만 선별해서 듣는다.
  //   },
  //   resolve: (payload, args) => {
  //     // filter 통과시 returns 값을 resolve
  //     const { pizzaOrderChange, ment } = payload;
  //     const { listenPizzaId } = args;
  //     return `pizzaOrder income [${pizzaOrderChange}] ment [${ment}] `; //payload의 id,ment를 적어서 보내주었다.
  //   },
  // })
  // pizzaOrderChange(@Args('listenPizzaId') listenPizzaId: number) {
  //   return this.pubSub.asyncIterator('pizza'); // sub 실행중 . key는 pizze로
  // }
}
