import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { Restaurant } from './restaurants/entities/restaurant.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.test",
      ignoreEnvFile: process.env.NODE_ENV === 'prod', // 다른방법으로 env를 얻는다. heroku 설정등
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(), // 처음에는 string으로 들어옴
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),

      })
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,//join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      "type": "postgres",
      "host": process.env.DB_HOST,
      "port": +process.env.DB_PORT, // env 설정은 string으로 온다. + 를 붙이면 number가 된다.
      "username": process.env.DB_USERNAME,
      "password": process.env.DB_PASSWORD,
      "database": process.env.DB_NAME,
      "synchronize": process.env.NODE_ENV !== 'prod', // db연결과 동시에 model migration 실행, 아래 entities가 들어간다.(!prod일때)
      "logging": true,
      entities:[Restaurant]
    }),
    RestaurantsModule,],
  controllers: [],
  providers: [],
})
export class AppModule { }
