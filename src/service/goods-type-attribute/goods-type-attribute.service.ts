import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GoodsTypeAttributeInterface } from 'src/interface/goods_type_attribute.interface';

@Injectable()
export class GoodsTypeAttributeService {
  constructor(@InjectModel('GoodsTypeAttribute') private readonly goodsTypeAttributeModel) { }
  async find(json: GoodsTypeAttributeInterface= {}, fields?: string) {
    try {
      return await this.goodsTypeAttributeModel.find(json, fields);
    } catch (error) {
      console.log('数据搜索失败');
      return [];
    }
  }

  async add(json: GoodsTypeAttributeInterface) {
    try {
      var admin = new this.goodsTypeAttributeModel(json)
      var result = await admin.save();
      return result;
    } catch (error) {
      return null;
    }
  }

  async update(json1: GoodsTypeAttributeInterface, json2: GoodsTypeAttributeInterface) {
    try {
      var result = await this.goodsTypeAttributeModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(json: GoodsTypeAttributeInterface) {
    try {
      var result = await this.goodsTypeAttributeModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }

  getModel() {
    return this.goodsTypeAttributeModel;
  }
}
