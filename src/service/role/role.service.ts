import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RoleInterface } from 'src/interface/role.interface';

@Injectable()
export class RoleService {
  constructor(@InjectModel('Role') private readonly roleModel) { }

  async find(json: RoleInterface, fields?: string) {
    try {
      return await this.roleModel.find(json, fields);
    } catch (error) {
      return [];
    }
  }

  async add(json: RoleInterface) {
    try {
      var role = new this.roleModel(json);
      var result = await role.save();
      return result;
    } catch (error) {
      return null;
    }
  }

  async update(json1: RoleInterface, json2: RoleInterface) {
    try {
      var result = await this.roleModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(json: RoleInterface) {
    try {
      var result = await this.roleModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }
}
