export class Config {
  // 定义静态属性  全局动态路由
  static adminPath = 'miadmin';
  static sessionMaxAge = 30 * 1000 * 60;
  static uploadDir = 'upload';
  static jimpSize = [{ width: 100, height: 100 }, { width: 200, height: 200 }];
  static redisOptions = {
    port: 6379,
    host: 'localhost',
    password: '',
    db: 0
  }

}