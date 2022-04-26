import { Controller, Get, Render } from '@nestjs/common';
import { CacheService } from 'src/service/cache/cache.service';
import { NavService } from 'src/service/nav/nav.service';
import { GoodsCateService } from 'src/service/goods-cate/goods-cate.service';
import { GoodsService } from 'src/service/goods/goods.service';
import * as mongoose from 'mongoose';


@Controller('product')
export class ProductController {
  constructor(
    private navService: NavService,
    private goodsCateService: GoodsCateService,
    private goodsService: GoodsService,
    private cacheService: CacheService,
  ) { }

  @Get()
  @Render('default/product/info')
  async index() {
    // 顶部导航
    let topnavResult = await this.cacheService.get('indexTopNav');
    if (!topnavResult) {
      topnavResult = await this.navService.find({ position: 1, status: 1 }, 0, 0, { "sort": -1 });
      this.cacheService.set('indexTopNav', topnavResult, { ttl: 60 * 30 })
    }

    // 商品分类
    let goodsCateResult = await this.cacheService.get('indexGoodsCate');
    if (!goodsCateResult) {
      goodsCateResult = await this.goodsCateService.getModel().aggregate([
        {
          $lookup: {
            from: 'goods_cate',
            localField: '_id',
            foreignField: 'pid',
            as: 'items'
          }
        },
        {
          $match: {
            "pid": '0',
            "status": 1
          }
        }
      ])
      this.cacheService.set('indexGoodsCate', goodsCateResult, { ttl: 60 * 30 })
    }


    //获取中间导航数据     
    let middleNavResult = await this.cacheService.get('indexMiddleNav');
    if (!middleNavResult) {
      middleNavResult = await this.navService.find({ position: 2, status: 1 });

      //middleNavResult 不可改变对象 (坑)  改为可改变对象
      middleNavResult = JSON.parse(JSON.stringify(middleNavResult));

      for (let i = 0; i < (middleNavResult as any[]).length; i++) {

        if (middleNavResult[i].relation) { // 如果有关联商品
          try {
            //1、relation转换成数组
            let temArr = middleNavResult[i].relation.replace(/，/g, ',').split(',');
            let relationIdsArr = [];
            //2、数组中的_id 转换成 Obejct _id
            temArr.forEach((value) => {
              relationIdsArr.push(new mongoose.Types.ObjectId(value));
            })
            //3、数据库里面查找 _id 对应的数据
            let relationGoodsArr = await this.goodsService.findIn({
              _id: { $in: relationIdsArr }
            }, 10, 'title goods_img shop_price');
            //4、扩展以前对象的属性
            middleNavResult[i].subGoods = relationGoodsArr;
          } catch (error) {
            middleNavResult[i].subGoods = []
          }

        }
      }

      this.cacheService.set('indexMiddleNav', middleNavResult, 60 * 30);
    }

    return {
      topNav: topnavResult,
      goodsCate: goodsCateResult,
      middleNav: middleNavResult
    };
  }
}
