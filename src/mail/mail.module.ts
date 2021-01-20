import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interface';
import { MailService } from './mail.service';

@Module({})
@Global() // 글로벌 모듈로 선언한다. ( MailService를 타모듈에서 mail모듈 import없이 사용 가능  > UserService 사용)
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      providers: [
        {
          provide: CONFIG_OPTIONS, // value 의존성 제공
          useValue: options,
        },
        MailService, // class 모듈은 아래 내용을 축약해서 사용 가능
        // {
        //   provide: MailService,
        //   useClass: MailService,
        // },
      ],
      exports: [MailService],
    };
  }
}
