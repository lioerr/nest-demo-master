import { Controller, Get, Render, Query, Body, Response, Post } from '@nestjs/common';

import { Config } from 'src/config/config';
import { ToolsService } from 'src/service/tools/tools.service';
import { GoodsTypeAttributeService } from 'src/service/goods-type-attribute/goods-type-attribute.service';
import { GoodsTypeService } from 'src/service/goods-type/goods-type.service';


@Controller(`${Config.adminPath}/goodsTypeAttribute`)
export class GoodsTypeAttributeController {
  constructor(private toolsService: ToolsService,
    private goodsTypeAttributeService: GoodsTypeAttributeService,
    private goodsTypeService: GoodsTypeService) { }

  @Get()
  @Render('admin/goodsTypeAttribute/index')
  async index(@Query() query) {
    var _id = query._id

    var goodsTypeResult = await this.goodsTypeService.find({ "_id": _id });
    var goodsTypeAttributeResult = await this.goodsTypeAttributeService.find({ "cate_id": _id });

    return {
      goodsType: goodsTypeResult[0],
      list: goodsTypeAttributeResult
    };
  }

  @Get('add')
  @Render('admin/goodsTypeAttribute/add')
  async add(@Query() query) {
    // 商品类型id
    var _id = query._id
    // 获取所有商品类型
    var goodsTypeResult = await this.goodsTypeService.find();
    return {
      goodsTypes: goodsTypeResult,
      cate_id: _id
    };
  }

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    var result = await this.goodsTypeAttributeService.add(body);

    if (result) {
      this.toolsService.success(res, `/${Config.adminPath}/goodsTypeAttribute?_id=${body.cate_id}`)
    } else {
      this.toolsService.error(res, '增加失败', `/${Config.adminPath}/goodsTypeAttribute?_id=${body.cate_id}`)
    }
  }

  @Get('edit')
  @Render('admin/goodsTypeAttribute/edit')
  async edit(@Query() query) {
    // 属性id
    var _id = query._id;
    // 获取要修改的数据
    var result = await this.goodsTypeAttributeService.find({ "_id": _id });
    // 获取所有的商品类型
    var goodsTypeResult = await this.goodsTypeService.find();
    console.log(result)
    return {
      goodsTypes: goodsTypeResult,
      goodsTypeAttributeData: result[0]
    }
  }

  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {
    var _id = body._id;
    body.attr_type != 3 ? body.attr_value='' : '';   // 如果不是多行文本框 则tecaArea 的值为空
    var result = await this.goodsTypeAttributeService.update({ "_id": _id }, body);

    if (result) {
      this.toolsService.success(res, `/${Config.adminPath}/goodsTypeAttribute?_id=${body.cate_id}`)
    } else {
      this.toolsService.error(res, '增加失败', `/${Config.adminPath}/goodsTypeAttribute?_id=${body.cate_id}`)
    }
  }

  @Get('delete')
  async delete(@Query() query, @Response() res) {
    var result = this.goodsTypeAttributeService.delete({ "_id": query._id })
    if (result) {
      this.toolsService.success(res, `/${Config.adminPath}/goodsTypeAttribute?_id=${query.cate_id}`)
    } else {
      this.toolsService.error(res, '删除失败', `/${Config.adminPath}/goodsTypeAttribute?_id=${query.cate_id}`)
    }
  }
}
