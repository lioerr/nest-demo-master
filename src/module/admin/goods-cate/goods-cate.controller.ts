import { Controller, Get, Query, Response, Render, UseInterceptors, Post, Body, UploadedFile } from '@nestjs/common';
import { ToolsService } from 'src/service/tools/tools.service';
import { GoodsCateService } from 'src/service/goods-cate/goods-cate.service';
import { Config } from 'src/config/config';
import { FileInterceptor } from '@nestjs/platform-express';
import * as mongoose from 'mongoose';


@Controller(`${Config.adminPath}/goodsCate`)
export class GoodsCateController {
  constructor(private toolsService: ToolsService,
    private goodsCateService: GoodsCateService) { }


  @Get()
  @Render('admin/goodsCate/index')
  async index() {
    // 1 在 goods_cate 表中找出 module_id=0 的数据
    // 2 让goods_cate表和goods_cate表关联  条件： 找出 access表中 module_id等于_id的数据
    // 顺序： 首先获取 $match  p_id:0 的一级分类的数据 ， 然后自关联，查出p_id 等于一级分类 _id 的数据
    var result = await this.goodsCateService.getModel().aggregate([
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
    // console.log(result)
    return {
      list: result
    };
  }

  @Get('add')
  @Render('admin/goodsCate/add')
  async add() {
    var result = await this.goodsCateService.find({ "pid": "0" })
    return {
      cateList: result
    };
  }

  @Post('doAdd')
  @UseInterceptors(FileInterceptor('cate_img'))
  async doAdd(@Body() body, @UploadedFile() file, @Response() res) {

    var pid = body.pid;
    // 上传图片 返回地址
    let { saveDir, jimpDir } = await this.toolsService.uploadFile(file);

    try {
      if (pid != 0) {
        body.pid = new mongoose.Types.ObjectId(pid);
      }
      await this.goodsCateService.add(Object.assign(body, { cate_img: saveDir })); // 拼接对象

      if (jimpDir) { // 生成略缩图
        this.toolsService.jimpImg(jimpDir)
      }

      this.toolsService.success(res, `/${Config.adminPath}/goodsCate`);
    } catch (error) {
      console.log(error)
      this.toolsService.error(res, '添加失败', `/${Config.adminPath}/goodsCate/add`)
    }
  }

  @Get('edit')
  @Render('admin/goodsCate/edit')
  async edit(@Query() query) {
    var cateResult = await this.goodsCateService.find({ "pid": "0" })
    var result = await this.goodsCateService.find({ "_id": query._id });
    // console.log(cateResult)
    // console.log(result)
    return {
      cateList: cateResult,
      cateData: result[0]
    };
  }

  @Post('doEdit')
  @UseInterceptors(FileInterceptor('cate_img'))
  async doEdit(@Body() body, @UploadedFile() file, @Response() res) {
    var pid = body.pid;
    var _id = body._id;
    if (pid != 0) {
      body.pid = new mongoose.Types.ObjectId(pid);
    }

    try {
      if (file) {
        let { saveDir, jimpDir } = await this.toolsService.uploadFile(file);
        await this.goodsCateService.update({ "_id": _id }, Object.assign(body, { cate_img: saveDir })); // 拼接对象

        // 生成缩略图
        if (jimpDir) {
          this.toolsService.jimpImg(jimpDir);
        }
      } else {
        await this.goodsCateService.update({ "_id": _id }, body);
      }
      this.toolsService.success(res, `/${Config.adminPath}/goodsCate`);
    } catch (error) {
      console.log(error)
      this.toolsService.error(res, '修改失败', `/${Config.adminPath}/goodsCate/edit?_id=${_id}`)
    }

  }


  @Get('delete')
  async delete(@Query() query, @Response() res) {
    var result = this.goodsCateService.delete({ "_id": query._id })
    if (result) {
      this.toolsService.success(res, `/${Config.adminPath}/goodsCate`)
    } else {
      this.toolsService.error(res, '删除失败', `/${Config.adminPath}/goodsCate`)
    }
  }
}
