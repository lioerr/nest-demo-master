import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
const d = new Date();

export const GoodsTypeAttributeSchema = new mongoose.Schema({
  cate_id: { type: Schema.Types.ObjectId },
  title: { type: String },
  attr_type: { type: String },            // 类型：   1 input   2 textarea   3 select
  attr_value: { type: String },           // 默认值： input textarea 默认值是空     select框有默认值
  status: { type: Number },
  add_time: { type: Number, default: d.getTime() }
})