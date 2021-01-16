import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './orders.service';

import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import {
  PUB_SUB,
  NEW_PENDING_ORDER,
  NEW_COOKED_ORDER,
  NEW_ORDER_UPDATE,
} from 'src/common/common.constants';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/edit-order.dto';
import { OrderUpdatesInput } from './dtos/order-update-dto';

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

  // 주문이 create 되면 owner는 이 사실을 알아야한다.
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
  // 음식이 update (요리완료) delivery는 이 사실을 알아야 한다.( 모든 배달원이 알아야함 )
  @Subscription(returns => Order)
  @Role(['Delivery'])
  cookedOrders() {
    return this.pubSub.asyncIterator(NEW_COOKED_ORDER);
  }

  // 고객은 모든 요리 정보가 업데이트 되는 과정을 볼 수 있어야한다. ( 모든 사람이 하나의 주문에대해 update정보를 리슨가능 )
  @Subscription(returns => Order)
  @Role(['Any'])
  orderUpdates(@Args('input') orderUpdatesInput: OrderUpdatesInput) {
    return this.pubSub.asyncIterator(NEW_ORDER_UPDATE);
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
