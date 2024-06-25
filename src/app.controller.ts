import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Release } from 'db/entities/release.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('release')
  async addRelease(
    @Body('releaseId') releaseId: number,
    @Body('desiredPrice') desiredPrice: number,
  ): Promise<Release> {
    if (!releaseId) {
      throw new Error('releaseId is required');
    }

    if (!desiredPrice) {
      throw new Error('desiredPrice is required');
    }

    return await this.appService.addRelease(releaseId, desiredPrice, true);
  }

  @Get('wantlist/sync')
  async syncWantlist() {
    return await this.appService.syncWantlist();
  }
}
