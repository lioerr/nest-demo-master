import { CacheModule, Module } from '@nestjs/common';
import { Config } from 'src/config/config';

// Controller
import { IndexController } from './index/index.controller';
import { UserController } from './user/user.controller';
import { AddressController } from './address/address.controller';
import { BuyController } from './buy/buy.controller';
import { PassController } from './pass/pass.controller';
import { CartController } from './cart/cart.controller';
import { ProductController } from './product/product.controller';
import { PublicModule } from '../public/public.module';

import * as redisStore from 'cache-manager-redis-store';

// import { RedisModule } from 'nestjs-redis';
import { CacheService } from 'src/service/cache/cache.service';


@Module({
  imports: [
    PublicModule,
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      prot: 6379
    })
  ],
  providers: [CacheService],
  controllers: [
    IndexController,
    UserController,
    AddressController,
    BuyController,
    PassController,
    CartController,
    ProductController
  ]
})
export class DefaultModule { }
