import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interface';

@Injectable()
export class JwtService {
    constructor(@Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions) {
        console.log(options);
    }
    hello() {
        console.log("hello");
    }
}
