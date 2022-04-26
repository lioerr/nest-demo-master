import { Body, Controller, Get, Post, Query, Render, Response, Request } from '@nestjs/common';
import { ToolsService } from 'src/service/tools/tools.service';
import { NavService } from 'src/service/nav/nav.service';
import { Config } from 'src/config/config';


@Controller(`${Config.adminPath}/nav`)
export class NavController {
  constructor(private navService: NavService,
    private toolsService: ToolsService) { }

  @Get()
  @Render('admin/nav/index')
  async index(@Query() query) {

    let json = {};
    // 分页
    let page = query.page || 1;
    let pageSize = 10;                 // 每页多少条
    let skip = (page - 1) * pageSize; // 跳过多少条

    let count = await this.navService.count(json);  // 所有数据的条数
    let totalPages = Math.ceil(count / pageSize);   // 整除向上取整

    let result = await this.navService.find(json, skip, pageSize, {"sort":-1});

    return {
      list: result,
      totalPages,
      page
    }
  }

  @Get('add')
  @Render('admin/nav/add')
  async add() {

    return {};
  }

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    if (body.title != '') {
      var result = await this.navService.add(body)
      if (result) {
        this.toolsService.success(res, `/${Config.adminPath}/nav`)
      } else {
        this.toolsService.error(res, '增加失败', `/${Config.adminPath}/nav`)
      }
    } else {
      this.toolsService.error(res, '名称不能为空', `/${Config.adminPath}/nav`)
    }
  }

  @Get('edit')
  @Render('admin/nav/edit')
  async edit(@Query() query, @Request() req) {

    let result = await this.navService.find({ "_id": query._id })
    return {
      list: result[0],
      prevPage: req.prevPage
    };
  }

  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {
    let prevPage = body.prevPage || `/${Config.adminPath}/nav`;

    if (body.title != '') {
      let result = await this.navService.update({ "_id": body._id }, body);
      if (result) {
        this.toolsService.success(res, prevPage);
      } else {
        this.toolsService.error(res, '增加失败', prevPage);
      }
    } else {
      this.toolsService.error(res, '导航名称不能为空', `/${Config.adminPath}/nav/edit?id=${body._id}`);
    }
  }

  @Get('delete')
  async delete(@Request() req, @Query() query, @Response() res) {
    var result = await this.navService.delete({ "_id": query.id });
    let prevPage = req.prevPage || `/${Config.adminPath}/nav`;
    this.toolsService.success(res, prevPage);
  }
}
