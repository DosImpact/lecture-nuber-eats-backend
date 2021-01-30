import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dtos/create-payment.dto';
import { GetPaymentOutput } from './dtos/get-payments.dto';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver(of => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Role(['Owner'])
  @Mutation(returns => CreatePaymentOutput)
  createPayment(
    @Args('input') createPaymentInput: CreatePaymentInput,
    @AuthUser() user: User,
  ) {
    return this.paymentService.createPayment(user, createPaymentInput);
  }

  @Role(['Owner'])
  @Query(returns => GetPaymentOutput)
  getPayment(@AuthUser() user: User) {
    return this.paymentService.getPayments(user);
  }
}
