import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getLigma(): string {
    return 'Ligma Balls!';
  }
}
