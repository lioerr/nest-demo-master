import { Injectable } from '@nestjs/common';

import * as svgCaptch from 'svg-captcha';
import * as md5 from 'md5';

import { format } from 'silly-datetime';
import * as mkdirp from 'mkdirp';
import { join, extname } from 'path';
import { Config } from '../../config/config';
import { createWriteStream } from 'fs';
import { resolve } from 'path/posix';

// 生成略缩图的类
const Jimp = require('jimp');

@Injectable()
export class ToolsService {

  captcha() {
    const captcha = svgCaptch.create({
      size: 1,
      fontSize: 50,
      width: 100,
      height: 40,
      background: '#cc9966'
    });
    return captcha;
  }

  getMd5(str: string) {
    return md5(str);
  }

  async success(res, redirectUrl) {
    // console.log(redirectUrl)
    await res.render('admin/public/success', {
      redirectUrl: redirectUrl
    })
  }

  async error(res, message, redirectUrl) {
    await res.render('admin/public/error', {
      message: message,
      redirectUrl: redirectUrl
    })
  }

  getTime() {
    let d = new Date();
    return d.getTime();
  }

  async uploadFile(file):Promise<any> {
    /**
     * 1. 获取当前日期  20191013
     * 2. 根据日期创建目录
     * 3. 实现上传
     * 4. 返回图片保存的地址
     */
    return new Promise((resolve, reject) => {
      if (file) {
        // 1. 获取当前日期  
        let day = format(new Date(), 'YYYYMMDD');   // 目录名称
        let d = this.getTime(); // 获取当前的时间戳

        // 2. 根据日期创建目录
        let dir = join(__dirname, `../../../public/${Config.uploadDir}`, day);
        mkdirp.sync(dir);
        let uploadDir = join(dir, d + extname(file.originalname));

        // 3. 实现上传
        const writeImage = createWriteStream(uploadDir);
        writeImage.write(file.buffer);
        writeImage.end();
        writeImage.on('finish', () => {
          // 4. 返回图片保存的地址
          let saveDir = join('static', Config.uploadDir, day, d + extname(file.originalname));
          let jimpDir = join('public', Config.uploadDir, day, d + extname(file.originalname));

          resolve({ saveDir, jimpDir })
        })

      } else {
        resolve({ saveDir: '', jimpDir: '' });
      }
    })
  }

  // 74- 9:5
  jimpImg(target) {
    Jimp.read(target, (err, lenna) => {
      // if (err) throw err;
      if (err) {
        console.log(err)
      } else {
        lenna
          .resize(200, 200) // resize
          .quality(90) // set JPEG quality
          // .greyscale() // set greyscale
          .write(target + "_200x200" + extname(target)); // save
      }

    });

    Jimp.read(target, (err, lenna) => {
      // if (err) throw err;
      if (err) {
        console.log(err)
      } else {
        lenna
          .resize(100, 100) // resize
          .quality(90) // set JPEG 图片质量
          // .greyscale() // set greyscale 灰度等级 复古效果
          .write(target + "_100x100" + extname(target)); // save
      }

    });
  }

  /*
  * 休眠函数sleep
  * 调用 await sleep(1500)
  */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
