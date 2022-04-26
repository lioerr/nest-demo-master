import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AccessInterface } from 'src/interface/access.interface';

@Injectable()
export class AccessService {
  constructor(@InjectModel('Access') private readonly accessModel) { }

  async find(json: AccessInterface = {}, fields?: string) {
    try {
      return await this.accessModel.find(json, fields);
    } catch (error) {
      console.log('数据搜索失败');
      return [];
    }
  }

  async add(json: AccessInterface) {
    try {
      var access = new this.accessModel(json)
      var result = await access.save();
      return result;
    } catch (error) {
      return null;
    }
  }

  async update(json1: AccessInterface, json2: AccessInterface) {
    try {
      var result = await this.accessModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(json: AccessInterface) {
    try {
      var result = await this.accessModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }

  getModel() {
    return this.accessModel;
  }
}
