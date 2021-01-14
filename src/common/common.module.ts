import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './common.constants';

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB, //key
      useValue: new PubSub(), // value payload
    },
  ],
  exports: [PUB_SUB],
})
export class CommonModule {}
