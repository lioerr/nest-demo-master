import { Controller, Get, Post, Query, Body, Render, Response } from '@nestjs/common';

import { Config } from 'src/config/config';
import { RoleService } from 'src/service/role/role.service';
import { AccessService } from 'src/service/access/access.service';
import { ToolsService } from 'src/service/tools/tools.service';
import { RoleAccessService } from 'src/service/role-access/role-access.service';

@Controller(`${Config.adminPath}/role`)
export class RoleController {

  constructor(private roleService: RoleService,
    private toolsService: ToolsService,
    private accessService: AccessService,
    private roleAccessService: RoleAccessService) { }

  @Get()
  @Render('admin/role/index')
  async index() {
    var result = await this.roleService.find({})
    return {
      roleList: result
    };
  }

  @Get('add')
  @Render('admin/role/add')
  async add() {
    return {}
  }

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    if (body.title != '') {
      var result = await this.roleService.add(body)
      if (result) {
        this.toolsService.success(res, `/${Config.adminPath}/role`)
      } else {
        this.toolsService.error(res, '增加失败', `/${Config.adminPath}/role`)
      }
    } else {
      this.toolsService.error(res, '角色名称不能为空', `/${Config.adminPath}/role`)
    }

  }

  @Get('edit')
  @Render('admin/role/edit')
  async edit(@Query() query) {

    var result = await this.roleService.find({ "_id": query._id })
    return {
      goodsTypeData: result[0]
    }
  }

  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {
    if (body.title != '') {
      var result = await this.roleService.update({ "_id": body._id }, body)
      if (result) {
        this.toolsService.success(res, `/${Config.adminPath}/role`)
      } else {
        this.toolsService.error(res, '修改失败', `/${Config.adminPath}/role`)
      }
    } else {
      this.toolsService.error(res, '角色名称不能为空', `/${Config.adminPath}/role`)
    }

  }

  @Get('delete')
  async delete(@Query() query, @Response() res) {
    var result = this.roleService.delete({ "_id": query._id })
    if (result) {
      this.toolsService.success(res, `/${Config.adminPath}/role`)
    } else {
      this.toolsService.error(res, '删除失败', `/${Config.adminPath}/role`)
    }
  }

  @Get('auth')
  @Render('admin/role/auth')
  async auth(@Query() query) {
    var role_id = query._id;
    // 1 在access表中找出根模块（ 即module_id=0 ）的数据
    // 2 让access表和access表自关联  条件： 找出 access表中 module_id等于_id的数据
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
    // 查询当前角色对应的权限
    var accessaResult = await this.roleAccessService.find({"role_id": role_id});

    var roleAccessArray = [];
    accessaResult.forEach(value => {
      roleAccessArray.push(value.access_id.toString());
    })
    // 循环遍历所有的权限数据， 判断当前权限是否在角色权限的数组中，加入checked
    for (var i=0;i<result.length;i++) {
      if (roleAccessArray.indexOf(result[i]._id.toString()) != -1) {
        result[i].checked = true;
      }
      for (var j=0;j<result[i].items.length;j++) {
        if (roleAccessArray.indexOf(result[i].items[j]._id.toString()) != -1) {
          result[i].items[j].checked = true;
        }
      }
    }
    return {
      role_id: role_id,
      list: result
    };

  }

  @Post('doAuth')
  async doAuth(@Body() body, @Response() res) {
    // console.log(body);
    var role_id = body.role_id;
    var access_node = body.access_node;

    //1 删除当前角色下面的所有权限
    await this.roleAccessService.deleteMany({"role_id": role_id});
    //2 把当前角色对应的所有权限增加到role_access表里面
    for (var i=0;i<access_node.length;i++) {
      await this.roleAccessService.add({
        role_id: role_id,
        access_id: access_node[i]
      })
    }
    this.toolsService.success(res, `/${Config.adminPath}/role/auth?_id=${role_id}`)
  }
}
