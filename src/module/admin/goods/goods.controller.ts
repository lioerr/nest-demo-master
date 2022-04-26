import { Body, Controller, Get, Post, Render, UploadedFile, UseInterceptors, Response, Query, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Config } from 'src/config/config';
import { GoodsService } from 'src/service/goods/goods.service';
import { ToolsService } from 'src/service/tools/tools.service';
import { GoodsCateService } from 'src/service/goods-cate/goods-cate.service';
import { GoodsColorService } from 'src/service/goods-color/goods-color.service';
import { GoodsTypeService } from 'src/service/goods-type/goods-type.service';
import { GoodsTypeAttributeService } from 'src/service/goods-type-attribute/goods-type-attribute.service';
import { GoodsImageService } from 'src/service/goods-image/goods-image.service';
import { GoodsAttrService } from 'src/service/goods-attr/goods-attr.service';
import * as mongoose from 'mongoose';

@Controller(`${Config.adminPath}/goods`)
export class GoodsController {
  constructor(
    private toolsService: ToolsService,
    private goodsService: GoodsService,
    private goodsCateService: GoodsCateService,
    private goodsColorService: GoodsColorService,
    private goodsTypeService: GoodsTypeService,
    private goodsTypeAttributeService: GoodsTypeAttributeService,
    private goodsImageService: GoodsImageService,
    private goodsAttrService: GoodsAttrService
  ) { }

  @Get()
  @Render('admin/goods/index')
  async index(@Query() query) {
    // 搜索
    let json = {}; // 搜索条件
    let keyword = query.keyword;
    if (keyword) { // 如果有关键字
      json = Object.assign(json, { "title": { $regex: RegExp(keyword) } })
    }

    // 分页
    let page = query.page || 1;
    let pageSize = 10;                 // 每页多少条
    let skip = (page - 1) * pageSize; // 跳过多少条

    let count = await this.goodsService.count(json);  // 所有数据的条数
    let totalPages = Math.ceil(count / pageSize);  // 整除向上取整

    // 1.获取商品列表
    var goodsResult = await this.goodsService.find(json, skip, pageSize);
    // console.log(goodsResult)
    return {
      goodsList: goodsResult,
      page,
      totalPages,
      keyword
    }
  }

  @Get('add')
  @Render('admin/goods/add')
  async add() {
    // 获取商品分类
    var goodsCateResult = await this.goodsCateService.getModel().aggregate([
      {
        $lookup: {
          from: 'goods_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items'
        }
      }, {
        $match: {
          "pid": "0"
        }
      }
    ]);

    // 2. 获取所有颜色
    let goodsColorResult = await this.goodsColorService.find({})

    // 3 获取商品类型 
    let goodsTypeResult = await this.goodsTypeService.find({})
    // console.log(goodsTypeResult)
    return {
      goodsCate: goodsCateResult,
      goodsColor: goodsColorResult,
      goodsType: goodsTypeResult
    }
  }

  // 注意 富文本wysiwyg 与 webUploader 上传图片名称都是 file 所以可共用此方法
  @Post('doImageUpload')
  @UseInterceptors(FileInterceptor('file'))
  async doUpload(@UploadedFile() file) {
    let { saveDir, jimpDir } = await this.toolsService.uploadFile(file);

    // 生成缩略图
    if (jimpDir) {
      this.toolsService.jimpImg(jimpDir)
    }
    return { link: '/' + saveDir };
  }

  @Get('getGoodsTypeAttribute')
  async getGoodsTypeAttribute(@Query() query) {
    // console.log(query.cate_id);
    let result = await this.goodsTypeAttributeService.find({ "cate_id": query.cate_id })

    return {
      result
    }
  }

  @Post('doAdd')
  @UseInterceptors(FileInterceptor('goods_img'))
  async doAdd(@Body() body, @UploadedFile() file, @Response() res) {
    // console.log(body)
    // 如果上传了商品图片 goods_img 

    var { saveDir, jimpDir } = await this.toolsService.uploadFile(file);

    // 生成缩略图
    if (jimpDir) {
      this.toolsService.jimpImg(jimpDir)
    }


    // 1. 添加商品，未在 schema 中定义的数据将被过滤
    if (body.goods_color && typeof (body.goods_color) !== 'string') {
      body.goods_color = body.goods_color.join(','); // 将数组用逗号分割为字符串
    }
    var result = await this.goodsService.add(Object.assign(body, { goods_img: saveDir }))

    // 2. 增加图库
    let goods_image_list = body.goods_image_list;
    // 判断 商品保存成功的id 且 有图片列表存在 且 不是string是array
    if (result._id && goods_image_list && typeof (goods_image_list) !== 'string') {
      for (let i = 0; i < goods_image_list.length; i++) {
        await this.goodsImageService.add({
          goods_id: result._id,
          img_url: goods_image_list[i]
        })
      }
    }

    // 3. 添加商品属性
    let attr_id_list = body.attr_id_list;
    let attr_value_list = body.attr_value_list;
    if (result._id && attr_id_list && typeof (attr_id_list) !== 'string') {
      for (let i = 0; i < attr_id_list.length; i++) {
        // 获取当前 商品类型id 对应的商品类型属性
        let goodsTypeAttributeResult = await this.goodsTypeAttributeService.find({ _id: attr_id_list[i] });

        await this.goodsAttrService.add({
          goods_id: result._id,
          attribute_title: goodsTypeAttributeResult[0].title,
          attribute_value: attr_value_list[i],
          // 备用字段
          goods_cate_id: result.cate_id,
          attribute_id: attr_id_list[i],
          attribute_type: goodsTypeAttributeResult[0].attr_type
        })
      }
    }

    this.toolsService.success(res, `/${Config.adminPath}/goods`);

    /* 表单数据
    {
      title: '11',
      sub_title: '22',
      goods_version: '33',
      cate_id: '616648b872681b72c4820c09',
      cname: '',
      shop_price: '11',
      market_price: '11',
      status: '1',
      is_best: '1',
      is_hot: '1',
      is_new: '1',
      content: '<p>这是一个用来测试的数据<img src="/static\\upload\\20211016\\1634391304008.jpg" style="width: 300px;" class="fr-fic fr-dib">111</p>',
      goods_color: [
        '616839e7010317aea1efee14',
        '616839ea010317aea1efee15',
        '616839ec010317aea1efee16'
      ],
      relation_goods: '32',
      goods_gift: '2',
      goods_fitting: '1',
      goods_attr: '22',
      goods_type_id: '616009897e09bbfa03824a96',
      attr_id_list: [
        '6161aff9b104371f17b1cf8e',
        '61622c57f8250c2f0d6d1e32',
        '61622c6cf8250c2f0d6d1e3c',
        '61622c77f8250c2f0d6d1e41',
        '6164d9276534f08a054e5b2a'
      ],
      attr_value_list: [ '11', '22', '11', '111', '3000\r\n' ],
      goods_image_list: [
        '/static\\upload\\20211016\\1634391346890.jpg',
        '/static\\upload\\20211016\\1634391346921.jpg',
        '/static\\upload\\20211016\\1634391346958.jpg'
      ]
    }*/

  }

  @Get('edit')
  @Render('admin/goods/edit')
  async edit(@Query() query, @Request() req) {

    /*****  渲染部分 *****/
    // 1 获取商品分类 (渲染)
    var goodsCateResult = await this.goodsCateService.getModel().aggregate([
      {
        $lookup: {
          from: 'goods_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items'
        }
      }, {
        $match: {
          "pid": "0"
        }
      }
    ]);

    // 2 获取所有颜色 (渲染)
    let goodsColorResult = await this.goodsColorService.find({})

    // 3 获取商品类型 (渲染)
    let goodsTypeResult = await this.goodsTypeService.find({})
    // 从数据库获得的数据是不可改变对象  不可改变对象： 我们通过序列化和反序列化来改变
    goodsColorResult = JSON.parse(JSON.stringify(goodsColorResult));


    /*****  填充部分 *****/
    // 1. 获取商品数据 (填充)
    let goodsResult = await this.goodsService.find({ "_id": query._id })

    // 2. 获取商品颜色  (填充)
    if (goodsResult[0].goods_color) { // 用逗号吧 颜色字符串 分割成 颜色数组
      var tempColorArr = goodsResult[0].goods_color.split(',');
      for (let i = 0; i < goodsColorResult.length; i++) {
        if (tempColorArr.indexOf(goodsColorResult[i]._id.toString()) != -1) {
          goodsColorResult[i].checked = true;    // 将填充数据的颜色设置为选中
        }
      }
    }
    // 3. 获取商品图库 (填充)
    let goodsImageResult = await this.goodsImageService.find({ "goods_id": goodsResult[0]._id });
    // 4. 获取商品规格信息
    let goodsAttrResult = await this.goodsAttrService.find({ "goods_id": goodsResult[0]._id });


    /*****  拼接表单  *****/
    let goodsAttrStr = '';
    goodsAttrResult.forEach(async val => {
      if (val.attribute_type == 1) {
        goodsAttrStr += `<li><span>${val.attribute_title}:</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" /> <input type="text" name="attr_value_list"  value="${val.attribute_value}" /></li>`
      } else if (val.attribute_type == 2) {
        goodsAttrStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <textarea cols="50" rows="3" name="attr_value_list">${val.attribute_value}</textarea></li>`;
      } else {
        // 获取 attr_value 获取可选值列表
        const oneGoodsTypeAttributeResult = await this.goodsTypeAttributeService.find({ _id: val.attribute_id });

        const arr = oneGoodsTypeAttributeResult[0].attr_value.split('\n'); // 用回车分割字符串为数组
        goodsAttrStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />`;
        goodsAttrStr += '<select name="attr_value_list">';
        for (let j = 0; j < arr.length; j++) {
          if (arr[j] == val.attribute_value) {
            goodsAttrStr += `<option value="${arr[j]}" selected >${arr[j]}</option>`;
          } else {
            goodsAttrStr += `<option value="${arr[j]}" >${arr[j]}</option>`;
          }
        }

        goodsAttrStr += '</select>';
        goodsAttrStr += '</li>';
      }
    })

    // console.log(req.prevPage)
    return {
      goodsCate: goodsCateResult,
      goodsColor: goodsColorResult,
      goodsType: goodsTypeResult,
      goods: goodsResult[0],
      goodsAttr: goodsAttrStr,
      goodsImage: goodsImageResult,
      prevPage: req.prevPage   // 上一页位置
    }
  }

  // 63 - 15: 00
  @Post('doEdit')
  @UseInterceptors(FileInterceptor('goods_img'))
  async doEdit(@Body() body, @UploadedFile() file, @Response() res) {

    /**
     * 1. 修改商品数据
     * 2. 修改图库数据 (增加)
     * 3. 修改商品类型属性数据
     */
    // 0 获取edit页面传过来的 上一页地址
    let prevPage = body.prevPage || `/${Config.adminPath}/goods`;

    let goods_id = body._id;
    // 1. 修改商品数据
    // 整理颜色数据
    if (body.goods_color && typeof (body.goods_color) !== 'string') {
      body.goods_color = body.goods_color.join(','); // 将数组用逗号分割为字符串
    }

    // 如果上传了商品图片 goods_img 
    if (file) {
      var { saveDir, jimpDir } = await this.toolsService.uploadFile(file);

      // 生成缩略图
      if (jimpDir) {
        this.toolsService.jimpImg(jimpDir)
      }
      await this.goodsService.update({ "_id": goods_id }, Object.assign(body, { "goods_img": saveDir }));
    } else { // 没传图片
      await this.goodsService.update({ "_id": goods_id }, body);
    }

    // 2. 修改图库信息
    let goods_image_list = body.goods_image_list;
    // 判断 商品保存成功的id 且 有图片列表存在 且 不是string是array
    if (goods_id && goods_image_list && typeof (goods_image_list) !== 'string') {
      for (let i = 0; i < goods_image_list.length; i++) {
        await this.goodsImageService.add({
          goods_id: goods_id,
          img_url: goods_image_list[i]
        })
      }
    }

    // 3、修改商品类型属性数据         1、删除当前商品id对应的类型属性  2、执行增加
    // 3.1 删除当前商品id对应的类型属性
    await this.goodsAttrService.deleteMany({ "goods_id": goods_id })

    // 3.2 添加商品属性
    let attr_id_list = body.attr_id_list;
    let attr_value_list = body.attr_value_list;
    // 如果上传了属性信息，则进行更新
    if (goods_id && attr_id_list && typeof (attr_id_list) !== 'string') {
      for (let i = 0; i < attr_id_list.length; i++) {
        // 获取当前 商品类型id 对应的商品类型属性
        let goodsTypeAttributeResult = await this.goodsTypeAttributeService.find({ _id: attr_id_list[i] });

        await this.goodsAttrService.add({
          goods_id: goods_id,
          attribute_title: goodsTypeAttributeResult[0].title,
          attribute_value: attr_value_list[i],
          // 备用字段
          goods_cate_id: body.goods_cate_id,
          attribute_id: attr_id_list[i],
          attribute_type: goodsTypeAttributeResult[0].attr_type
        })
      }
    }

    this.toolsService.success(res, prevPage);
  }

  @Get('changeGoodsImageColor')
  async changeGoodsImageColor(@Query() query) {
    let color_id = query.color_id;
    let goods_image_id = query.goods_image_id;

    if (color_id) {
      color_id = new mongoose.Types.ObjectId(color_id);
    }
    let result = await this.goodsImageService.update({ "_id": goods_image_id }, { "color_id": color_id });

    if (result) {
      return { success: true, message: '更新数据成功' };
    } else {
      return { success: false, message: '更新数据失败' };
    }
  }

  @Get('removeGoodsImage')
  async removeGoodsImage(@Query() query) {
    let goods_image_id = query.goods_image_id;
    let result = await this.goodsImageService.delete({ "_id": goods_image_id });
    if (result) {
      return { success: true, message: '删除数据成功' };
    } else {
      return { success: false, message: '删除数据失败' };
    }
  }

  @Get('delete')
  async delete(@Query() query, @Request() req, @Response() res) {
    let result = await this.goodsService.delete({ "_id": query._id })

    let prevPage = req.prevPage || `/${Config.adminPath}/goods`;
    // console.log(result)
    if (result.deletedCount == 1) {
      // 删除商品属性
      await this.goodsAttrService.deleteMany({ "goods_id": query._id });
      // 删除图片信息
      await this.goodsImageService.deleteMany({ "goods_id": query._id });

      this.toolsService.success(res, prevPage)
    } else {
      this.toolsService.error(res, '删除失败', prevPage)
    }
  }

}
