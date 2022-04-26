import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AdminInterface } from 'src/interface/admin.interface';
import { RoleAccessService } from '../role-access/role-access.service';
import { AccessService } from '../access/access.service';
import { Config } from 'src/config/config';

@Injectable()
export class AdminService {
  constructor(@InjectModel('Admin') private readonly adminModel,
    private roleAccessService: RoleAccessService,
    private accessService: AccessService) { }

  async find(json: AdminInterface= {}, fields?: string) {
    try {
      return await this.adminModel.find(json, fields);
    } catch (error) {
      console.log('数据搜索失败');
      return [];
    }
  }

  async add(json: AdminInterface) {
    try {
      var admin = new this.adminModel(json)
      var result = await admin.save();
      return result;
    } catch (error) {
      return null;
    }
  }

  async update(json1: AdminInterface, json2: AdminInterface) {
    try {
      var result = await this.adminModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(json: AdminInterface) {
    try {
      var result = await this.adminModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }

  getModel() {
    return this.adminModel;
  }

  async checkAuth(req) {
    /*检测权限*/

    // 1 获取当前访问的url 应对的权限id
    var pathname: string = req.baseUrl;
    pathname = pathname.replace(`/${Config.adminPath}/`, '');  // 将访问地址中 adminPath动态路由 替换为空

    // 2 获取当前用户的角色  (超级管理员跳过权限判断 is_super=1)
    var userinfo = req.session.userinfo;
    var role_id = userinfo.role_id;
    if (userinfo.is_super == 1 || pathname == 'login/loginOut') { // 超级管理员 或者退出操作 
      return true;
    }

    // 3 根据角色获取当前角色的权限列表
    var roleAccessResult = await this.roleAccessService.find({ "role_id": role_id })

    var roleAccessArray = []; // 将所拥有权限的id遍历装入数组中
    roleAccessResult.forEach(value => {
      roleAccessArray.push(value.access_id.toString());
    });

    // 4 判断当前访问url 应对的权限id 是否在权限列表中的id中
    var accessResult = await this.accessService.find({ "url": pathname });

    if (accessResult.length > 0) {
      if (roleAccessArray.indexOf(accessResult[0]._id.toString()) != -1) {  // indexOf 未检索到值时，返回-1    != -1 表示找到
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }
}
