import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NavInterface } from 'src/interface/nav.interface';

@Injectable()
export class NavService {
  constructor(@InjectModel('Nav') private readonly navModel) { }

  async find(json: NavInterface = {}, skip = 0, limit = 0, sort = {}, fields?: string) {
    try {
      console.log('数据读取数据!');
      return await this.navModel.find(json, fields).skip(skip).limit(limit).sort(sort);
    } catch (error) {
      console.log('数据搜索失败');
      return [];
    }
  }

  async count(json: NavInterface = {}) {
    try {
      return await this.navModel.find(json).count();
    } catch (error) {
      console.log('数据总条数失败');
      return [];
    }
  }

  async add(json: NavInterface) {
    try {
      var admin = new this.navModel(json)
      var result = await admin.save();
      return result;
    } catch (error) {
      return null;
    }
  }

  async update(json1: NavInterface, json2: NavInterface) {
    try {
      var result = await this.navModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(json: NavInterface) {
    try {
      var result = await this.navModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }

  getModel() {
    return this.navModel;
  }
}
