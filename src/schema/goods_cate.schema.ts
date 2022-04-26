import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
const d = new Date();

export const GoodsCateSchema = new mongoose.Schema({
  title: { type: String },
  cate_img: { type: String },
  link: { type: String },
  template: { type: String },     // 指定当前分类的模板
  pid: { type: Schema.Types.Mixed },   // 混合类型  上级分类的 id 
  sub_title: { type: String },      // SEO相关的标题  搜索引擎优化
  keywords: { type: String },
  description: { type: String },
  sort: { type: Number, default:100 },
  status: { type: Number, default:1 },
  add_time: { type: Number, default: d.getTime() }
})