import { Body, Controller, Get, Post, Render, Request, Response } from '@nestjs/common';
import { ToolsService } from '../../../service/tools/tools.service';

import { AdminService } from 'src/service/admin/admin.service';

import { Config } from '../../../config/config';

@Controller(`${Config.adminPath}/login`)
export class LoginController {

  constructor(private toolsService: ToolsService, private adminService: AdminService) { }

  @Get()
  @Render('admin/login')
  async index() {
    // console.log(await this.adminService.find({}));
    return {};
  }

  @Get('code')
  getCode(@Request() req, @Response() res) {
    var svgCaptch = this.toolsService.captcha();
    // 设置session
    req.session.code = svgCaptch.text;
    res.type('image/svg+xml');

    res.send(svgCaptch.data);
  }

  @Post('doLogin')
  async doLogin(@Body() body, @Request() req, @Response() res) {

    try {
      // 提取数据
      let code: string = body.code;
      let username: string = body.username;
      let password: string = body.password;

      // 简单判断用户名长度是否合法
      if (username == "" || password.length < 1) {
        //console.log('用户名或密码长度不合法')
        this.toolsService.error(res, "用户名或密码长度不合法", `/${Config.adminPath}/login`);
      } else {
        // 判断验证码是否正确
        if (code.toUpperCase() == req.session.code.toUpperCase()) {
          // 将取到的密码进行 md5 加密
          password = this.toolsService.getMd5(password);
          // 数据库查找匹配的用户
          var userResult = await this.adminService.find({ "username": username, "password": password })

          if (userResult.length > 0) {
            // console.log('登录成功')
            req.session.userinfo = userResult[0];
            this.toolsService.success(res, `/${Config.adminPath}/main`);
          } else {
            // console.log('用户名或密码不正确')
            this.toolsService.error(res, "用户名或密码不正确", `/${Config.adminPath}/login`);
          }
        } else {
          // console.log('验证码不正确')
          this.toolsService.error(res, "验证码不正确", `/${Config.adminPath}/login`);
        }
      }

    } catch (error) {
      res.redirect(`/${Config.adminPath}/login`)
    }
  }

  @Get('loginOut')
  loginOut(@Request() req, @Response() res) {
    req.session.userinfo = null;
    res.redirect(`/${Config.adminPath}/login`);
  }
}
