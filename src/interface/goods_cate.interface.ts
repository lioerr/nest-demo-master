export interface GoodsCateInterface {
  _id?: String;
  title?: String;
  cate_img?: String ;
  link?: String;
  template?: String;         // 指定当前分类的模板
  pid?: any;              // 混合类型  上级分类的 id 
  sub_title?: String;        // SEO相关的标题  搜索引擎优化
  keywords?: String;
  description?: String;
  sort?: Number;
  status?: Number;
  add_time?: Number;
}