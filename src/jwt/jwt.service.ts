import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interface';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/common/common.constants';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {
    console.log('JwtService options : ', options);
  }
  hello() {
    console.log('hello');
  }
  sign(payload: object): string {
    return jwt.sign(payload, this.options.privateKey);
  }
  verify(token: string): string | object {
    return jwt.verify(token, this.options.privateKey);
  }
}
