import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from "path";
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 配置静态资源目录
  app.useStaticAssets(path.join(__dirname, '..', 'public'), {
    prefix: '/static/'
  });

  // 配置模板目录及引擎
  app.setBaseViewsDir('views');
  app.setViewEngine('ejs');

  // 配置cookie中间件
  app.use(cookieParser());

  // 配置session中间件  rolling: true 有效时间可被刷新
  /**
   * secret: 密钥
   * resave : true 强制保存 即使没有变化
   * saveUninitialized: true 强制将未初始化的session存储。当新建了一个session且未设定属性或值时，它就处于未初始化状态，在设定一个cookid钱，这对于登录验证，减轻服务器存储压力，权限控制是有帮助的
   * cookie: 在cookie保存 session_key 的有效时间
   * rolling: true 有效时间可被刷新
   */
  app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 30, httpOnly: true },
    rolling: true
  }))

  await app.listen(4000);
}
bootstrap();
