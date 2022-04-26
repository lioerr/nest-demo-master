import { Body, Controller, Get, Post, Query, Render, Response } from '@nestjs/common';


import { AdminService } from 'src/service/admin/admin.service';
import { RoleService } from 'src/service/role/role.service';
import { ToolsService } from 'src/service/tools/tools.service';
import { Config } from '../../../config/config';

@Controller(`${Config.adminPath}/manager`)
export class ManagerController {

  constructor(private adminService: AdminService,
    private roleService: RoleService,
    private toolsService: ToolsService) { }

  @Get()
  @Render('admin/manager/index')
  async index() {
    // 一并读取关联表的数据
    var result = await this.adminService.getModel().aggregate([
      {
        $lookup: { from: "role", localField: "role_id", foreignField: "_id", as: "role" }
      }
    ]);

    // console.log(JSON.stringify(result))  // 打印json
    return {
      adminList: result,

    };
  }

  @Get('add')
  @Render('admin/manager/add')
  async add() {
    var roleResult = await this.roleService.find({})
    return {
      roleResult: roleResult
    };
  }

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    // 检测用户名与密码长度
    if (body.username.length < 5 || body.password.length < 6) {
      this.toolsService.error(res, '用户名或密码长度不能小于6', `/${Config.adminPath}/manager/add`)
    } else {
      // 从数据库查询当前用户名是否存在
      var adminResult = await this.adminService.find({ "username": body.username })
      if (adminResult.length > 0) {
        this.toolsService.error(res, '用户名已存在', `/${Config.adminPath}/manager/add`)
      } else {
        body.password = this.toolsService.getMd5(body.password); // 加密密码
        await this.adminService.add(body);
        this.toolsService.success(res, `/${Config.adminPath}/manager`);

      }
    }
  }

  @Get('edit')
  @Render('admin/manager/edit')
  async edit(@Query() query) {
    var adminResult = await this.adminService.find({ "_id": query._id })
    var roleResult = await this.roleService.find({});
    return {
      adminResult: adminResult[0],
      roleResult: roleResult
    };
  }

  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {
    // console.log(body)
    var _id = body._id;
    var password = body.password;
    var mobile = body.mobile;
    var email = body.email;
    var role_id = body.role_id;
    if (password != '') { // 如果传了新密码
      if (password.length < 6) {
        await this.toolsService.error(res, '密码长度不能小于6', `${Config.adminPath}/manager/edit?_id=${_id}`);
        return;
      } else {
        password = this.toolsService.getMd5(password);
        await this.adminService.update({ "_id": _id }, { mobile, email, role_id, password })
      }
    } else {
      this.adminService.update({ "_id": _id }, { mobile, email, role_id })
    }

    this.toolsService.success(res, `/${Config.adminPath}/manager`);

  }

  @Get('delete')
  async delete(@Query() query, @Response() res) {
    var result = this.adminService.delete({ "_id": query._id })
    if (result) {
      this.toolsService.success(res, `/${Config.adminPath}/manager`)
    } else {
      this.toolsService.error(res, '删除失败', `/${Config.adminPath}/manager`)
    }
  }
}
