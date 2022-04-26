import { Controller, Get } from '@nestjs/common';

import { CacheService } from 'src/service/cache/cache.service';


@Controller('user')
export class UserController {
  constructor(
    private cacheService: CacheService,
  ) { }
  @Get()
  async index() {

    let data = await this.cacheService.get('indexTopNav');
    console.log(data)

    return 'user'
  }
}
