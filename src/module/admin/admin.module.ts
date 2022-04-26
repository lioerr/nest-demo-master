import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Controller
import { MainController } from './main/main.controller';
import { LoginController } from './login/login.controller';
import { ManagerController } from './manager/manager.controller';
import { RoleController } from './role/role.controller';
import { FocusController } from './focus/focus.controller';
import { AccessController } from './access/access.controller';
import { GoodsTypeController } from './goods-type/goods-type.controller';
import { GoodsTypeAttributeController } from './goods-type-attribute/goods-type-attribute.controller';
import { GoodsCateController } from './goods-cate/goods-cate.controller';
import { GoodsController } from './goods/goods.controller';
import { NavController } from './nav/nav.controller';
import { SettingController } from './setting/setting.controller';


import { PublicModule } from '../public/public.module';


@Module({
  imports: [
    PublicModule
  ],
  controllers: [
    MainController,
    LoginController,
    ManagerController,
    RoleController,
    AccessController,
    FocusController,
    GoodsTypeController,
    GoodsTypeAttributeController,
    GoodsCateController,
    GoodsCateController,
    GoodsController,
    GoodsController,
    NavController,
    SettingController
  ]
})
export class AdminModule { }
