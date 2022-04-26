import { Injectable, NestMiddleware } from '@nestjs/common';
import { Config } from 'src/config/config';
import { AdminService } from 'src/service/admin/admin.service';

@Injectable()
export class AdminauthMiddleware implements NestMiddleware {
  constructor(private adminService: AdminService) { }
  async use(req: any, res: any, next: () => void) {
  
    var pathname = req.baseUrl; // 获取访问地址

    // 1.获取session里保存的用户信息
    var userinfo = req.session.userinfo;
    if (userinfo && userinfo.username) {
      // 设置全局变量 用户信息
      res.locals.userinfo = userinfo
      // 
      var hasAuth = await this.adminService.checkAuth(req);
      if (hasAuth) {
        next();
      } else {
        res.send('您没有权限访问当前地址')
      }

   
    } else {
      // 排除不需要做权限判断的页面
      if (pathname == `/${Config.adminPath}/login` || pathname == `/${Config.adminPath}/login/code` || pathname == `/${Config.adminPath}/login/doLogin`) {
        next();
      } else {
        res.redirect(`/${Config.adminPath}/login`);
      }
    }

  }
}
