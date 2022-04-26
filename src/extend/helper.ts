import { format } from 'silly-datetime';
import { extname } from 'path';

export class Helper {
  static happ = "全局变量"

  /**
   * 全局截取字符串方法
   * @param str 字符串
   * @param start 截取起始位置
   * @param end 截取结束位置
   * @returns 
   */
  static substring = function (str: string, start: number, end: number) {
    if (end) {
      return str.substring(start, end);
    } else {
      return str.substring(start);
    }
  }

  /**
   * 格式化日期
   * @param params 传入时间戳
   * @returns 
   */
  static formatTime(params) {
    return format(params, 'YYYY-MM-DD HH:mm')
  }
  
  /**
   * 全局略缩图名称生成方法
   * @param dir 
   * @param width 
   * @param height 
   * @returns 
   */
  static formatImg(dir, width, height) {
    height = height || width;

    return dir + '_' + width + 'x' + height + extname(dir)
  }
}