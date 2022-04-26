import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GoodsInterface } from 'src/interface/goods.interface';
import { GoodsCateService } from '../goods-cate/goods-cate.service';
import * as mongoose from 'mongoose';

@Injectable()
export class GoodsService {
  constructor(@InjectModel('Goods') private readonly goodsModel,
    private goodsCateService: GoodsCateService) { }

  async find(json: GoodsInterface = {}, skip = 0, limit = 0, fields?: string) {
    try {
      return await this.goodsModel.find(json, fields).skip(skip).limit(limit);
    } catch (error) {
      console.log('数据搜索失败');
      return [];
    }
  }

  async findIn(json, limit = 10, fields?: string) {
    try {
      return await this.goodsModel.find(json, fields).skip(0).limit(limit);
    } catch (error) {
      return [];
    }
  }

  async count(json: GoodsInterface = {}) {
    try {
      return await this.goodsModel.find(json).count();
    } catch (error) {
      console.log('数据总条数失败');
      return [];
    }
  }

  async add(json: GoodsInterface) {
    try {
      var admin = new this.goodsModel(json)
      var result = await admin.save();
      return result;
    } catch (error) {
      return null;
    }
  }

  async update(json1: GoodsInterface, json2: GoodsInterface) {
    try {
      var result = await this.goodsModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(json: GoodsInterface) {
    try {
      var result = await this.goodsModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }

  getModel() {
    return this.goodsModel;
  }

  /**
   * 根据商品分类获取推荐商品
   * @param cate_id  分类id
   * @param type     hot  best  new
   * @param limit    数量
   */
  async getCategoryGoods(cate_id: string, type: string, limit: number) {

    // 1 获取当前分类下面的子分类
    var pid = new mongoose.Types.ObjectId(cate_id)
    var cateIdsResult = await this.goodsCateService.find({ "pid": pid });

    if (cateIdsResult.length == 0) { // 本身就是子分类
      cateIdsResult = [{ _id: pid }]
    }

    // 2 把子分类的_id放在数组里
    let temArr = [];
    cateIdsResult.forEach((value) => {
      temArr.push(value._id);
    });

    // 3 查找条件
    let findJson = { cate_id: { $in: cateIdsResult } };
    //判断类型 合并对象    
    switch (type) {
      case 'hot':
        findJson = Object.assign(findJson, { "is_hot": 1 });
        break;
      case 'best':
        findJson = Object.assign(findJson, { "is_best": 1 });
        break;
      case 'new':
        findJson = Object.assign(findJson, { "is_new": 1 });
        break;
      default:
        findJson = Object.assign(findJson, { "is_hot": 1 });
        break;
    }
    //4、获取子分类下面的热门商品
    let goodsArr = await this.findIn(findJson, limit, 'title goods_img shop_price');

    return goodsArr;

  }
}
