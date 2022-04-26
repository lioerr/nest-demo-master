import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RoleAccessService {

  constructor(@InjectModel('RoleAccess') private roleAccessModel) { }

  async find(json, fields?: string) {
    try {
      return await this.roleAccessModel.find(json, fields);
    } catch (error) {
      return [];
    }
  }

  async add(json) {
    try {
      var role = new this.roleAccessModel(json);
      var result = await role.save();
      return result;
    } catch (error) {
      console.log(error)
      return null;
    }
  }

  async update(json1, json2) {
    try {
      var result = await this.roleAccessModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(json) {
    try {
      var result = await this.roleAccessModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }

  async deleteMany(json) {
    try {
      var result = await this.roleAccessModel.deleteMany(json);
      return result;
    } catch (error) {
      return null;
    }
  }
}
