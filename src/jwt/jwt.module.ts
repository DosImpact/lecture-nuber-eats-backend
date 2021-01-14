import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtModuleOptions } from './jwt.interface';
import { JwtService } from './jwt.service';

// global 데코레이터를 사용하면, user모듈에서 사용할때 import 없이 사용가능
// service에서 바로 사용 가능,   private readonly jwtService: JwtService
@Module({})
@Global()
export class JwtModule {
  // forRoot는 모듈을 리턴합니다. Dynamic모듈의 옵션을 정의합니다.
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService], // Service 로직 exports
      providers: [
        {
          provide: JwtService,
          useClass: JwtService, // provider의 class Type 선언
        },
        {
          provide: CONFIG_OPTIONS,
          useValue: options, // provider의 value Type 선언
        },
      ],
    };
  }
}
