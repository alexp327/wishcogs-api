import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Release } from 'db/entities/release.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('ligma')
  getLigma(): string {
    return this.appService.getLigma();
  }

  // add a post endpoint for adding a new Release to the db
  @Get('release')
  async addRelease(): Promise<Release> {
    return await this.appService.addRelease(201, 60.0);
  }
}
