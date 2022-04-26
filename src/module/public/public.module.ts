import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


// Schema
import { AdminSchema } from '../../schema/admin.schema';
import { RoleSchema } from 'src/schema/role.schema';
import { AccessSchema } from 'src/schema/access.schema';
import { RoleAccessSchema } from 'src/schema/role_access.schema';
import { FocusSchema } from 'src/schema/focus.schema';
import { GoodsTypeSchema } from 'src/schema/goods_type.schema';
import { GoodsTypeAttributeSchema } from 'src/schema/goods_type_attribute.schema';
import { GoodsCateSchema } from 'src/schema/goods_cate.schema';
import { GoodsSchema } from 'src/schema/goods.schema';
import { GoodsColorSchema } from 'src/schema/goods_color.schema';
import { GoodsImageSchema } from 'src/schema/goods_image.schema';
import { GoodsAttrSchema } from 'src/schema/goods_attr.schema';
import { NavSchema } from 'src/schema/nav.schema';
import { SettingSchema } from 'src/schema/setting.schema';

// Service
import { ToolsService } from '../../service/tools/tools.service';
import { AdminService } from 'src/service/admin/admin.service';
import { RoleService } from 'src/service/role/role.service';
import { AccessService } from 'src/service/access/access.service';
import { RoleAccessService } from 'src/service/role-access/role-access.service';
import { FocusService } from 'src/service/focus/focus.service';
import { GoodsTypeService } from 'src/service/goods-type/goods-type.service';
import { GoodsTypeAttributeService } from 'src/service/goods-type-attribute/goods-type-attribute.service';
import { GoodsCateService } from 'src/service/goods-cate/goods-cate.service';
import { GoodsService } from 'src/service/goods/goods.service';
import { GoodsColorService } from 'src/service/goods-color/goods-color.service';
import { GoodsImageService } from 'src/service/goods-image/goods-image.service';
import { GoodsAttrService } from 'src/service/goods-attr/goods-attr.service';
import { NavService } from 'src/service/nav/nav.service';
import { SettingService } from 'src/service/setting/setting.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Admin', schema: AdminSchema, collection: "admin" },
      { name: 'Role', schema: RoleSchema, collection: "role" },
      { name: 'Access', schema: AccessSchema, collection: "access" },
      { name: 'RoleAccess', schema: RoleAccessSchema, collection: "role_access" },
      { name: 'Focus', schema: FocusSchema, collection: "focus" },
      { name: 'GoodsType', schema: GoodsTypeSchema, collection: "goods_type" },
      { name: 'GoodsTypeAttribute', schema: GoodsTypeAttributeSchema, collection: "goods_type_attribute" },
      { name: 'GoodsCate', schema: GoodsCateSchema, collection: "goods_cate" },
      { name: 'Goods', schema: GoodsSchema, collection: "goods" },
      { name: 'GoodsColor', schema: GoodsColorSchema, collection: "goods_color" },
      { name: 'GoodsImage', schema: GoodsImageSchema, collection: "goods_image" },
      { name: 'GoodsAttr', schema: GoodsAttrSchema, collection: "goods_attr" },
      { name: 'Nav', schema: NavSchema, collection: "nav" },
      { name: 'Setting', schema: SettingSchema, collection: "setting" }
    ])
  ],
  providers: [
    ToolsService,
    AdminService,
    RoleService,
    AccessService,
    RoleAccessService,
    FocusService,
    GoodsTypeService,
    GoodsTypeAttributeService,
    GoodsCateService,
    GoodsService,
    GoodsColorService,
    GoodsImageService,
    GoodsAttrService,
    NavService,
    SettingService
  ],
  exports: [
    ToolsService,
    AdminService,
    RoleService,
    AccessService,
    RoleAccessService,
    FocusService,
    GoodsTypeService,
    GoodsTypeAttributeService,
    GoodsCateService,
    GoodsService,
    GoodsColorService,
    GoodsImageService,
    GoodsAttrService,
    NavService,
    SettingService
  ]
})

export class PublicModule { }
