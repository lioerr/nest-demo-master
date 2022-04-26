import { Controller, Get, Render, Post, Body, Response, Query } from '@nestjs/common';

import * as mongoose from 'mongoose';

import { Config } from 'src/config/config';
import { ToolsService } from 'src/service/tools/tools.service';
import { RoleService } from 'src/service/role/role.service';
import { AccessService } from 'src/service/access/access.service';


@Controller(`${Config.adminPath}/access`)
export class AccessController {
  constructor(private accessService: AccessService,
    private toolsService: ToolsService,
    private roleService: RoleService) { }

  @Get()
  @Render('admin/access/index')
  async index() {
    // 1 在access表中找出 module_id=0 的数据
    // 2 让access表和access表关联  条件： 找出 access表中 module_id等于_id的数据
    var result = await this.accessService.getModel().aggregate([
      {
        $lookup: {
          from: 'access',
          localField: '_id',
          foreignField: 'module_id',
          as: 'items'
        }
      }, {
        $match: {
          "module_id": "0"
        }
      }
    ]);
    // console.log(result)
    return {
      list: result
    };
  }

  @Get('add')
  @Render('admin/access/add')
  async add() {
    // 获取模块列表
    var result = await this.accessService.find({ "module_id": "0" })
    return {
      moduleList: result
    }
  }

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {

    var module_id = body.module_id;
    if (module_id != 0) {
      body.module_id = new mongoose.Types.ObjectId(module_id);
    }
    var result = await this.accessService.add(body)
    if (result) {
      this.toolsService.success(res, `/${Config.adminPath}/access`)
    } else {
      this.toolsService.error(res, '增加失败', `/${Config.adminPath}/access`)
    }

  }

  @Get('edit')
  @Render('admin/access/edit')
  async edit(@Query() query) {

    // 获取模块列表
    var result = await this.accessService.find({ "module_id": "0" });
    var accessResult = await this.accessService.find({ "_id": query._id });
    return {
      list: accessResult[0],
      moduleList: result
    }
  }

  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {
    try {
      var module_id = body.module_id;
      var _id = body._id;
      if (module_id != 0) {
        body.module_id = new mongoose.Types.ObjectId(module_id);
      }
      await this.accessService.update({ "_id": _id }, body);
      this.toolsService.success(res, `/${Config.adminPath}/access`);

    } catch (error) {
      this.toolsService.error(res, '删除失败', `/${Config.adminPath}/access/edit?_id=${_id}`)
    }

  }

  @Get('delete')
  async delete(@Query() query, @Response() res) {
    var result = await this.accessService.delete({ "_id": query._id })
    if (result) {
      this.toolsService.success(res, `/${Config.adminPath}/access`)
    } else {
      this.toolsService.error(res, '删除失败', `/${Config.adminPath}/access`)
    }
  }

}
