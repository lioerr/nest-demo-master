import { Controller, Get, Render, Request, Query } from '@nestjs/common';
import { Config } from '../../../config/config';
import { AccessService } from 'src/service/access/access.service';
import { RoleAccessService } from 'src/service/role-access/role-access.service';
import { FocusService } from 'src/service/focus/focus.service';
import { GoodsTypeService } from 'src/service/goods-type/goods-type.service';
import { GoodsTypeAttributeService } from 'src/service/goods-type-attribute/goods-type-attribute.service';
import { GoodsCateService } from 'src/service/goods-cate/goods-cate.service';
import { GoodsService } from 'src/service/goods/goods.service';
import { NavService } from 'src/service/nav/nav.service';


@Controller(`${Config.adminPath}/main`)
export class MainController {

  constructor(private accessService: AccessService,
    private roleAccessService: RoleAccessService,
    private focusService: FocusService,
    private goodsTypeService: GoodsTypeService,
    private goodsTypeAttributeService: GoodsTypeAttributeService,
    private goodsCateService: GoodsCateService,
    private goodsService: GoodsService,
    private navService: NavService) { }

  @Get()
  @Render('admin/main/index')
  async index(@Request() req) {
    var userinfo = req.session.userinfo;
    var role_id = userinfo.role_id;
    // 1 在access表中找出根模块（ 即module_id=0 ）的数据
    // 2 让access表和access表自关联  条件： 找出 access表中 module_id等于_id的数据
    var result = await this.accessService.getModel().aggregate([
      {
        $lookup: {
          from: 'access',
          localField: '_id',
          foreignField: 'module_id',
          as: 'items'
        }
      }, {
        $match: {
          "module_id": "0"
        }
      }
    ]);
    // 查询当前角色对应的权限
    var accessaResult = await this.roleAccessService.find({ "role_id": role_id });

    var roleAccessArray = [];
    accessaResult.forEach(value => {
      roleAccessArray.push(value.access_id.toString());
    })
    // 循环遍历所有的权限数据， 判断当前权限是否在角色权限的数组中，加入checked
    for (var i = 0; i < result.length; i++) {
      if (roleAccessArray.indexOf(result[i]._id.toString()) != -1) {
        result[i].checked = true;
      }
      for (var j = 0; j < result[i].items.length; j++) {
        if (roleAccessArray.indexOf(result[i].items[j]._id.toString()) != -1) {
          result[i].items[j].checked = true;
        }
      }
    }
    return {
      asideList: result
    };
  }

  @Get('welcome')
  @Render('admin/main/welcome')
  welcome() {
    return {};
  }

  /**
   * 公共修改状态方法
   * 注意： 传入要修改的 Service 值 也要在main控制器中引入
   * @param el       传入的元素element
   * @param _id      修改数据的 _id
   * @param model    数据所在的模型
   * @param fields   要修改的字段
   * @param path     自定义后台地址
   * @returns 
   */
  @Get('changeStatus')
  async changeStatus(@Query() query) {

    var id = query._id;
    var model = query.model + 'Service';  //var model = 'focusService';  // this.xxx == this['xxx']
    // console.log(model)
    var fields = query.fields;  // 需要修改的字段
    var json;
    var modelResult = await this[model].find({ "_id": id })
    if (modelResult.length > 0) {
      var tempFields = modelResult[0][fields];
      tempFields == 1 ? json = { [fields]: 0 } : json = { [fields]: 1 };   // es6 属性名表达式
      await this[model].update({ "_id": id }, json);
      return {
        success: true,
        message: '修改成功'
      }
    } else {
      return {
        success: false,
        message: '传入参数错误'
      }
    }
  }

  /**
   * 公共更新数量方法
   * @param el       传入的元素element
   * @param _id      修改数据的 _id
   * @param model    数据所在的模型
   * @param fields   要修改的字段
   * @param path     自定义后台地址
   * @returns 
   */
  @Get('editNum')
  async editNum(@Query() query) {
    var model = query.model + 'Service';   // 更新的model
    var fields = query.attr; // 更新的属性
    var _id = query._id;
    var num = query.num;  // 新数值 

    var modelResult = await this[model].find({ "_id": _id })

    if (modelResult.length > 0) {
      var json = { [fields]: num };
      await this[model].update({ "_id": _id }, json);
      return {
        success: true,
        message: '修改成功'
      }
    } else {
      return {
        success: false,
        message: '传入参数错误'
      };
    }
  }

}
