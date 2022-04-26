import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FocusInterface } from 'src/interface/focus.interface';

@Injectable()
export class FocusService {

  constructor(@InjectModel('Focus') private readonly focusModel) { }

  async find(json: FocusInterface = {}, sort = {}, fields?: string) {
    try {
      return await this.focusModel.find(json, fields).sort(sort);
    } catch (error) {
      console.log('数据搜索失败');
      return [];
    }
  }

  async add(json: FocusInterface) {
    try {
      var access = new this.focusModel(json)
      var result = await access.save();
      return result;
    } catch (error) {
      return null;
    }
  }

  async update(json1: FocusInterface, json2: FocusInterface) {
    try {
      var result = await this.focusModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(json: FocusInterface) {
    try {
      var result = await this.focusModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }

  getModel() {
    return this.focusModel;
  }
}
