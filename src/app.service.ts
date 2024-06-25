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

  async addRelease(
    releaseId: number,
    desiredPrice: number,
    getDiscogsPrice: boolean,
  ): Promise<Release> {
    // if the releaseId already exists in the db, throw an error
    const existingRelease = await this.releaseRepository.findOne({
      where: {
        release_id: releaseId,
      },
    });

    if (existingRelease) {
      throw new Error('Release already exists');
    }

    let latestPrice = -1;
    if (getDiscogsPrice) {
      const response = await this.httpService.get(
        `https://api.discogs.com/releases/${releaseId}`,
      );

      latestPrice = (await firstValueFrom(response)).data.lowest_price;
    }

    const newRelease = this.releaseRepository.create({
      release_id: releaseId,
      desired_price: desiredPrice,
      latest_price: latestPrice,
    });
    await this.releaseRepository.save(newRelease);
    return newRelease;
  }

  async syncWantlist() {
    // TODO: use env variables for username and token
    const username = process.env.DISCOGS_USERNAME;

    console.log('username: ', username);

    const response = await this.httpService.get(
      `https://api.discogs.com/users/username/wants`,
      {
        headers: {
          Authorization: `Discogs -----`,
        },
      },
    );

    const wantlist = (await firstValueFrom(response)).data.wants;

    for (const want of wantlist) {
      console.log('trying want id: ', want.id);
      try {
        await this.addRelease(want.id, -1, true);
      } catch (error) {
        console.error('error adding release: ', want.id);
      }
      // wait for 2 seconds before making the next request
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // wantlist.forEach(async (want) => {
    //   console.log('trying want id: ', want.id);
    //   try {
    //     await this.addRelease(want.id, -1, true);
    //   } catch (error) {
    //     console.error('error adding release: ', want.id);
    //   }
    //   // wait for 2 seconds before making the next request
    //   await new Promise((resolve) => setTimeout(resolve, 2000));
    // });
  }
}
