import { Controller, Get, Render, Body, Response, Post, Query } from '@nestjs/common';
import { Config } from 'src/config/config';
import { GoodsTypeService } from 'src/service/goods-type/goods-type.service';
import { ToolsService } from 'src/service/tools/tools.service';

@Controller(`${Config.adminPath}/goodsType`)
export class GoodsTypeController {
  constructor(private toolsService: ToolsService,
    private goodsTypeService: GoodsTypeService) { }

  @Get()
  @Render('admin/goodsType/index')
  async index() {

    var result = await this.goodsTypeService.find();
    return {
      list: result
    };
  }

  @Get('add')
  @Render('admin/goodsType/add')
  async add() {

    return {};
  }

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    if (body.title != '') {
      var result = await this.goodsTypeService.add(body)
      if (result) {
        this.toolsService.success(res, `/${Config.adminPath}/goodsType`)
      } else {
        this.toolsService.error(res, '增加失败', `/${Config.adminPath}/goodsType`)
      }
    } else {
      this.toolsService.error(res, '名称不能为空', `/${Config.adminPath}/goodsType`)
    }
  }

  @Get('edit')
  @Render('admin/goodsType/edit')
  async edit(@Query() query) {

    var result = await this.goodsTypeService.find({ "_id": query._id })
    return {
      goodsTypeData: result[0]
    }
  }

  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {
    if (body.title != '') {
      var result = await this.goodsTypeService.update({ "_id": body._id }, body)
      if (result) {
        this.toolsService.success(res, `/${Config.adminPath}/goodsType`)
      } else {
        this.toolsService.error(res, '修改失败', `/${Config.adminPath}/goodsType`)
      }
    } else {
      this.toolsService.error(res, '角色名称不能为空', `/${Config.adminPath}/goodsType`)
    }

  }

  @Get('delete')
  async delete(@Query() query, @Response() res) {
    var result = this.goodsTypeService.delete({ "_id": query._id })
    if (result) {
      this.toolsService.success(res, `/${Config.adminPath}/goodsType`)
    } else {
      this.toolsService.error(res, '删除失败', `/${Config.adminPath}/goodsType`)
    }
  }
}


