import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD, // nestjs에서 제공하는 constants 이다. APP_GUARD가 provide되는곳에 다 사용 가능
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
