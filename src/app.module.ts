import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModule } from './restaurants/restaurants.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.test"
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,//join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      "type": "postgres",
      "host": "localhost",
      "port": 5433,
      "username": "postgres",
      "password": "dosimpact",
      "database": "nuber-eats",
      "synchronize": true, // db연결과 동시에 model migration 실행
      "logging": true,
    }),
    RestaurantsModule,],
  controllers: [],
  providers: [],
})
export class AppModule { }
