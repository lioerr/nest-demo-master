import { Controller, Get, Post, Body, Render, UseInterceptors, UploadedFile, Response, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Config } from '../../../config/config';

import { ToolsService } from '../../../service/tools/tools.service'
import { FocusService } from 'src/service/focus/focus.service';

@Controller(`${Config.adminPath}/focus`)
export class FocusController {

  constructor(private toolsService: ToolsService, private focusService: FocusService) { }

  @Get()
  @Render('admin/focus/index')
  async index() {
    let result = await this.focusService.find();
    return {
      focusList: result
    };
  }

  @Get('add')
  @Render('admin/focus/add')
  add() {
    return {};
  }

  @Post('doAdd')
  @UseInterceptors(FileInterceptor('focus_img'))
  async doAdd(@Body() body, @UploadedFile() file, @Response() res) {

    // 上传图片 返回地址
    let { saveDir } = await this.toolsService.uploadFile(file);
    // console.log(saveDir); 
    await this.focusService.add(Object.assign(body, { focus_img: saveDir })); // 拼接对象

    this.toolsService.success(res, `/${Config.adminPath}/focus`)

  }

  @Get('edit')
  @Render('admin/focus/edit')
  async edit(@Query() query) {
    try {
      let result = await this.focusService.find({ "_id": query.id });
      return {
        focus: result[0]
      };
    } catch (error) {
      console.log(error)
    }

  }
  @Post('doEdit')
  @UseInterceptors(FileInterceptor('focus_img'))
  async doEdit(@Body() body, @UploadedFile() file, @Response() res) {
    let _id = body._id;

    if (file) {
      // 上传图片 返回地址
      let { saveDir } = await this.toolsService.uploadFile(file);
      await this.focusService.update({ "_id": _id }, Object.assign(body, { focus_img: saveDir })); // 拼接对象
    } else {
      await this.focusService.update({ "_id": _id }, body);
    }

    this.toolsService.success(res, `/${Config.adminPath}/focus`)
  }

  @Get('delete')
  async delete(@Query() query, @Response() res) {
    var result = await this.focusService.delete({ "_id": query._id })
    if (result) {
      this.toolsService.success(res, `/${Config.adminPath}/focus`)
    } else {
      this.toolsService.error(res, '删除失败', `/${Config.adminPath}/focus`)
    }
  }

}
