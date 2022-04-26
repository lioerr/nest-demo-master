import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GoodsCateInterface } from 'src/interface/goods_cate.interface';

@Injectable()
export class GoodsCateService {
  constructor(@InjectModel('GoodsCate') private readonly goodsCateModel) { }

  async find(json: GoodsCateInterface= {}, fields?: string) {
    try {
      return await this.goodsCateModel.find(json, fields);
    } catch (error) {
      console.log('数据搜索失败');
      return [];
    }
  }

  async add(json: GoodsCateInterface) {
    try {
      var admin = new this.goodsCateModel(json)
      var result = await admin.save();
      return result;
    } catch (error) {
      return null;
    }
  }

  async update(json1: GoodsCateInterface, json2: GoodsCateInterface) {
    try {
      var result = await this.goodsCateModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(json: GoodsCateInterface) {
    try {
      var result = await this.goodsCateModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }

  getModel() {
    return this.goodsCateModel;
  }
}
