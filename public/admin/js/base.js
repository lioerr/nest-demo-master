
$(function () {

  app.init();
})

var app = {
  init: function () {
    this.slideToggle();
    this.resizeIframe();
    this.confirmDelete();
  },
  resizeIframe: function () {
    //1 获取浏览器高度
    //2 设置iframe的高度

    $("#rightMain").height($(window).height() - 80);   // 浏览器窗口高度减去导航高度
  },
  slideToggle: function () {
    $('.aside>li:nth-child(1) ul, .aside>li:nth-child(2) ul').hide();  // nth-child
    $('.aside h4').click(function () {
      $(this).siblings('ul').slideToggle();
    })
  },
  // 提示是否删除
  confirmDelete() {
    $('.delete').click(function () {
      var flag = confirm('确定要删除吗？');
      return flag;
    })
  },
  // 修改状态
  changeStatus(el, model, fields, id, configPath) {
    
    $.get(`/${configPath}/main/changeStatus`, { _id: id, model: model, fields: fields }, function (res) {
      console.log(res);
      if (res.success) {
        if (el.src.indexOf('yes') != -1) {
          el.src = '/static/admin/images/no.gif';
        } else {
          el.src = '/static/admin/images/yes.gif';
        }
      }
    })
  },
  // 修改字段
  editNum(el, model, attr, _id, configPath) {
    var val = $(el).html();                // 1 获取 传入el(以传入span为例)的值val 
    var input = $("<input value='' />");   // 2 创建input标签
    $(el).html(input);                     // 3 将 span标签里的值val替换为<input/>
    $(input).trigger('focus').val(val);    // 4 让<input/> 获取焦点 并把值val传入
    $(input).click(function () {           // 5 组织冒泡，点击input时  不执行任何操作
      return false;
    });

    $(input).blur(function () {             // 6 当鼠标离开时
      var num = $(this).val();
      $(el).html(num);                      // 7 从新为 span赋值
      // 8 发送请求到服务端
      $.get(`/${configPath}/main/editNum`, { _id: _id, model: model, attr: attr, num: num }, function (res) {
        // console.log(res);
        if (res.success) {
          alert('修改成功');
        }
      })
    })


  }
}

// 窗口变化时从新计算
window.onresize = function () {
  app.resizeIframe();
}