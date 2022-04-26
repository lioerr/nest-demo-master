import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SettingInterface } from '../../interface/setting.interface';

@Injectable()
export class SettingService {
  constructor(@InjectModel('Setting') private readonly settingModel) { }

  async find(json: SettingInterface = {}, fields?: string) {
    try {
      return await this.settingModel.find(json, fields);
    } catch (error) {
      return [];
    }
  }

  async add(json: SettingInterface) {
    try {
      var admin = new this.settingModel(json);
      var result = await admin.save();
      return result;
    } catch (error) {
      return null;
    }
  }
  async update(json1: SettingInterface, json2: SettingInterface) {
    try {
      var result = await this.settingModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }
}
