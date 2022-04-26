import { Injectable, NestMiddleware } from '@nestjs/common';
import { Config } from '../config/config';
import { Helper } from 'src/extend/helper';


@Injectable()
export class InitMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {

    // 模板全局变量
    res.locals.config = Config;
    
    // 全局方法
    res.locals.helper = Helper;

    if (req.headers.referer) {
      req.prevPage = req.headers.referer;
    }
    
    next();
  }
}
