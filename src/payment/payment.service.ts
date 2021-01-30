import { Injectable } from '@nestjs/common';
import {
  Cron,
  CronExpression,
  Interval,
  SchedulerRegistry,
} from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dtos/create-payment.dto';
import { GetPaymentOutput } from './dtos/get-payments.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly payments: Repository<Payment>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async createPayment(
    owner: User,
    { restaurantId, transactionId }: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    try {
      // 레스토랑 id 존재유무, 레스토랑 소유 유무, payment 존재 유무
      const restaurant = await this.restaurants.findOne({ id: restaurantId });
      if (!restaurant) {
        return {
          ok: false,
          error: 'cannot find restaurant',
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: 'you are not allowed to restaurant',
        };
      }
      const payment = await this.payments.findOne({ where: { transactionId } });

      if (payment) {
        return {
          ok: false,
          error: 'already exists',
        };
      }
      await this.payments.save(
        this.payments.create({
          //   userId: owner.id,
          user: owner,
          transactionId,
          restaurant,
        }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'cannot createPayment',
      };
    }
  }

  async getPayments(user: User): Promise<GetPaymentOutput> {
    try {
      const payments = await this.payments.find({ user: user });
      //   const payments = await this.payments.find({ where: { userId: user.id } });
      return {
        ok: true,
        payments,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'cannot getPayments',
      };
    }
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  @Cron('10 * * * * *') // 매 10초가 되면 실행
  sayHiEverySec() {
    console.log('Cron EVERY_10_SECONDS');
  }

  @Interval(10000) // 서버 시작후 10초 마다 실행
  sayHiFiveSec() {
    console.log('Interval sayHiFiveSec');
  }

  @Cron('*/10 * * * * *', { name: 'notification' }) // 매번 자동으로 10초마다 실행
  notification() {
    console.log(' Cron notification');
    const job = this.schedulerRegistry.getCronJob('notification'); // 하지만 그 실행때 cronjob 중지
    job.stop();
    console.log(job.lastDate());
  }
}
