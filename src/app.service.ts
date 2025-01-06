import { OnModuleInit, Injectable } from '@nestjs/common';
import { RedisService } from './redis/redis.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    // setInterval(() => {
    //   this.polling();
    // }, 10000);
  }

  async polling() {
    const allCreateIds = await this.redisService.getCommand('create');
    for (const id of allCreateIds) {
      const state = await this.redisService.getData(`create:${id}`);
      console.log(`${id} ==> ${state}`);
      if (state == 'completed') {
        await this.redisService.removeFromCommand('create', id);
      }
    }

    // const allUpdateIds = await this.redisService.getCommand('update');
    // for (const id of allUpdateIds) {
    //   const state = await this.redisService.getData(`update:${id}`);
    //   console.log(`${id} ==> ${state}`);
    //   if (state == 'completed') {
    //     await this.redisService.removeFromCommand('update', id);
    //   }
    // }
  }
}
