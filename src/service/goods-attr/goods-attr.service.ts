import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GoodsAttrInterface } from '../../interface/goods_attr.interface'

@Injectable()
export class GoodsAttrService {

  constructor(@InjectModel('GoodsAttr') private readonly goodsAttrModel) { }

  async find(json: GoodsAttrInterface = {}, fields?: string) {
    try {
      return await this.goodsAttrModel.find(json, fields);
    } catch (error) {
      return [];
    }
  }

  async add(json: GoodsAttrInterface) {
    try {
      var access = new this.goodsAttrModel(json);
      var result = await access.save();
      return result;
    } catch (error) {
      return null;
    }
  }

  async update(json1: GoodsAttrInterface, json2: GoodsAttrInterface) {
    try {
      var result = await this.goodsAttrModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(json: GoodsAttrInterface) {
    try {
      var result = await this.goodsAttrModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }

  async deleteMany(json: GoodsAttrInterface) {
    try {
      var result = await this.goodsAttrModel.deleteMany(json);
      return result;
    } catch (error) {
      return null;
    }
  }

  getModel() {
    return this.goodsAttrModel;
  }

}
