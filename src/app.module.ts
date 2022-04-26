import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { AdminModule } from './module/admin/admin.module';
import { DefaultModule } from './module/default/default.module';
import { ApiModule } from './module/api/api.module';
import { MongooseModule } from '@nestjs/mongoose';
// 引入中间件
import { AdminauthMiddleware } from './middleware/adminauth.middleware';
import { InitMiddleware } from './middleware/init.middleware';
import { DefaultMiddleware } from './middleware/default.middleware';

import { Config } from './config/config';
import { PublicModule } from './module/public/public.module';
// import { CacheService } from './service/cache/cache.service';

@Module({
  imports: [AdminModule, DefaultModule, ApiModule,
    MongooseModule.forRoot('mongodb://admin:123456@localhost:27017/nestxiaomi?authSource=admin', { useNewUrlParser: true }),
    PublicModule
  ], // 由于中间件使用了 admin 服务，所以需引入public模块
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminauthMiddleware)
      .forRoutes(`${Config.adminPath}/*`)
      .apply(InitMiddleware)
      .forRoutes('*')
      .apply(DefaultMiddleware)
      .forRoutes(
        {
          path: '/', method: RequestMethod.GET
        },
        {
          path: '/plist', method: RequestMethod.GET
        },
        {
          path: '/product', method: RequestMethod.GET
        }
      );
  }
}
