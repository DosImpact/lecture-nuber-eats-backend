import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtModuleOptions } from './jwt.interface';
import { JwtService } from './jwt.service';

// global 데코레이터를 사용하면, user모듈에서 사용할때 import 없이 사용가능
//  service에서 바로 사용 가능,   private readonly jwtService: JwtService
@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [
        {
          provide: JwtService,
          useClass: JwtService,
        },
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
