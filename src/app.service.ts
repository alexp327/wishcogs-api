import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Release } from 'db/entities/release.entity';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Release)
    private releaseRepository: Repository<Release>,
    private readonly httpService: HttpService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  getLigma(): string {
    return 'Ligma Balls!';
  }

  async addRelease(releaseId: number, desiredPrice: number): Promise<Release> {
    const response = await this.httpService.get(
      `https://api.discogs.com/releases/${releaseId}`,
    );

    const latestPrice = (await firstValueFrom(response)).data.lowest_price;

    const newRelease = this.releaseRepository.create({
      release_id: releaseId,
      desired_price: desiredPrice,
      latest_price: latestPrice,
    });
    await this.releaseRepository.save(newRelease);
    return newRelease;
  }
}
