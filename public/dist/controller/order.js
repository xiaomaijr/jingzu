/** layuiAdmin.std-v1.0.0 LPPL License By http://www.layui.com/admin/ */
 ;/**
 @Name：layuiAdmin 内容系统
 @Author：star1029
 @Site：http://www.layui.com/admin/
 @License：LPPL
 */
layui.define(['table', 'form','selfajax'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,selfajax = layui.selfajax
  ,router = layui.router()
  ,setter = layui.setter
  ,form = layui.form;

  //订单管理
  table.render({
    elem: '#LAY-app-content-tags'
    ,url: layui.setter.api_host+'getOrderList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,height: view.getTableHeight($('.layui-show').children('.layui-tab-iem-option-form').outerHeight(true) + 100)
    ,toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
    ,defaultToolbar: ['filter']
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [20, 30, 50]                 // 每页条数的选择项
    , limit: 20                          // 默认每页条数
    ,cols: [[
      {field: 'create_time', title: '创建时间', width: 200, fixed: 'left'}
      ,{field: 'user_phone', title: '授权手机号', width: 150, fixed: 'left'}
      ,{field: 'order_sn', title: '订单号(点击添加备注)', width: 200,style: 'cursor: pointer;',templet: function (d) {
          return '<div class="layui-text" style="cursor: pointer;"><a lay-submit lay-filter="add-describe" data-id="' + d.id + '" data-describe="' + d.describe + '">'+d.order_sn+'</a></div>';
        }}
      ,{field: 'good_name', title: '产品名称', width: 200,style: 'cursor: pointer;',templet: function (d) {
            return '<div class="layui-text" style="cursor: pointer;"><a lay-submit lay-filter="show-label-image3" data-imgs=' + d.photo + ' data-id="' + d.id + '">'+d.good_name+'</a></div>';
        }}
      ,{field: 'status', title: '订单状态', width: 200,templet:function (d) {
          if(d.status==1){
            return '待质检';
          }else if(d.status==2&&d.is_sure==1){
            return '已确认';
          }else if(d.status==2&&d.is_sure!=1){
            return '待确认';
          }else if(d.status==3){
            return '已完成';
          }else{
            return  '';
          }
        }}
      ,{field: 'price', title: '原始估价', width: 200}
      ,{field: 'price_eval', title: '最终估价', width: 200}
      ,{field: 'is_sure', title: '卖家是否确认', width: 200,templet:function (d) {
          if(d.is_sure==1){
            return '已确认';
          }else{
            return  '未确认';
          }
        }}
      ,{field: 'sure_time', title: '确认时间', width: 200}
      ,{field: 'type', title: '订单分类', width: 200,templet:function (d) {
          if(d.type==1){
            return '邮寄';
          }else if(d.type==2){
            return '上门';
          }else if(d.type==3){
            return '线下';
          }else{
            return  '';
          }
        }}
      ,{field: 'receiver', title: '收货姓名', width: 100}
      ,{field: 'receiver_phone', title: '收货手机', width: 100}
      ,{field: 'good_num', title: '商品数量', width: 100}
      ,{field: 'describe', title: '描述', width: 200}
      ,{title: '操作', width: 270, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
    ]],
    parseData: function (res) {
      return {
        "code": res.code, //解析接口状态
        "msg": res.msg, //解析提示文本
        "count": res.data.count, //解析数据长度
        "data": res.data.data //解析数据列表
      }
    }, done: function (res, curr, count) {
      $('td[data-field="image"] .layui-table-cell, .layui-table-tool-panel li').each(function () {
        $(this).css('overflow', 'none !important');
      })
    }
  });
  //监听搜索
  form.on('submit(LAY-app-contlist-search)', function(data){
    var field = data.field;
    console.log(field);
    //执行重载
    table.render({
      elem: '#LAY-app-content-tags'
      ,url: layui.setter.api_host+'getOrderList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
      ,height: view.getTableHeight($('.layui-show').children('.layui-tab-iem-option-form').outerHeight(true) + 100)
      // ,toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
      // ,defaultToolbar: ['filter']
      ,where:field
      ,page: true
      , loading: true                      // 开启loading
      , cellMinWidth: 80                   // 每列最小宽度
      , limits: [20, 30, 50]                 // 每页条数的选择项
      , limit: 20                          // 默认每页条数
      ,cols: [[
        {field: 'create_time', title: '创建时间', width: 200, fixed: 'left'}
        ,{field: 'user_phone', title: '授权手机号', width: 150, fixed: 'left'}
        ,{field: 'order_sn', title: '订单号(点击添加备注)', width: 200,style: 'cursor: pointer;',templet: function (d) {
            return '<div class="layui-text" style="cursor: pointer;"><a lay-submit lay-filter="add-describe" data-id="' + d.id + '" data-describe="' + d.describe + '">'+d.order_sn+'</a></div>';
          }}
        ,{field: 'good_name', title: '产品名称', width: 200,style: 'cursor: pointer;',templet: function (d) {
            return '<div class="layui-text" style="cursor: pointer;"><a lay-submit lay-filter="show-label-image3" data-imgs=' + d.photo + ' data-id="' + d.id + '">'+d.good_name+'</a></div>';
          }}
        ,{field: 'status', title: '订单状态', width: 100,templet:function (d) {
            if(d.status==1){
              return '待质检';
            }else if(d.status==2&&d.is_sure==1){
              return '已确认';
            }else if(d.status==2&&d.is_sure!=1){
              return '待确认';
            }else if(d.status==3){
              return '已完成';
            }else{
              return  '';
            }
          }}
        ,{field: 'price', title: '原始估价', width: 100}
        ,{field: 'price_eval', title: '最终估价', width: 100}
        ,{field: 'is_sure', title: '卖家是否确认', width: 200,templet:function (d) {
            if(d.is_sure==1){
              return '已确认';
            }else{
              return  '未确认';
            }
          }}
        ,{field: 'sure_time', title: '确认时间', width: 200}
        ,{field: 'type', title: '订单分类', width: 200,templet:function (d) {
            if(d.type==1){
              return '邮寄';
            }else if(d.type==2){
              return '上门';
            }else if(d.type==3){
              return '线下';
            }else{
              return  '';
            }
          }}
        ,{field: 'receiver', title: '收货姓名', width: 100}
        ,{field: 'receiver_phone', title: '收货手机', width: 100}
        ,{field: 'good_num', title: '商品数量', width: 100}
        ,{field: 'describe', title: '描述', width: 200}
        ,{title: '操作', width: 270, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
      ]],
      parseData: function (res) {
        return {
          "code": res.code, //解析接口状态
          "msg": res.msg, //解析提示文本
          "count": res.data.count, //解析数据长度
          "data": res.data.data, //解析数据列表
          "url": res.url //解析数据列表
        }
      }, done: function (res, curr, count) {
        $('td[data-field="image"] .layui-table-cell, .layui-table-tool-panel li').each(function () {
          $(this).css('overflow', 'none !important');
        })
      }
    });
  });
  //头工具栏事件
  table.on('toolbar(LAY-app-content-tags)', function(obj){
    let ranktime = $('#test10').val();
    switch(obj.event){
      case 'exportAllData':
        var department = $('#department').val();
        var position =$('#position').val();
        var username = $('#username').val();
        var phone = $('#phone').val();
        view.request({
          url:'getOrderAll',
          type:'get',
          data:{},
          auth:true,
          tips: false,
          success:function(res){
            if(!res.code){
              table.exportFile(res.data.menu, res.data.data);
            }else{
              layer.msg(res.msg,{time:2000});
            }
          }
        });
        break;
    };
  });
  //监听工具条
  table.on('tool(LAY-app-content-tags)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除？', function(index){
        console.log(obj.data.id);
        view.request({
          url:'orderDel',
          type:'post',
          data:{
            'id':obj.data.id,
          },
          auth:true,
          tips: true,
          success:function(res){
            if(!res.code){
              obj.del();
              layer.close(index);
            }else{
              layer.msg(res.msg,{time:2000});
            }
          }
        })
      });
    } else if(obj.event === 'edit'){
      admin.popup({
        title: '编辑订单状态'
        ,area: ['500px', '400px']
        ,id: 'LAY-popup-content-tags'
        ,success: function(layero, index){
          view(this.id).render('order/tagsform', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            if(data.status==1){console.log(data);
              let status_data = [{name:'待确认',value:2},{name:'已完成',value:3}];
              $("#statusstatus").html('<option value="0">请选择</option>');
              $.each(status_data, function (key, val) {
                var option1 = $("<option>").val(val.value).text(val.name);
                //通过LayUI.jQuery添加列表项
                $("#statusstatus").append(option1);console.log(option1);
              });
            }else if(data.status==2){
              let status_data = [{name:'已完成',value:3}];
              $("#statusstatus").html('<option value="0">请选择</option>');
              $.each(status_data, function (key, val) {
                var option1 = $("<option>").val(val.value).text(val.name);
                //通过LayUI.jQuery添加列表项
                $("#statusstatus").append(option1);
              });
            }else{

            }
            layui.form.render('select');
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              var field = data.field; //获取提交的字段
              view.request({
                url:'orderEdit',
                type:'post',
                data:field,
                auth:true,
                tips: true,
                success:function(res){
                  if(!res.code){
                    if(res.success){
                      layui.table.reload('LAY-app-content-tags'); //重载表格
                      layer.close(index); //执行关闭
                    }
                  }
                }
              })

            });
          });
        }
      });
    }else if(obj.event === 'integral'){
      location.hash = '/member/integral/id=' + obj.data.id;
    } else if(obj.event === 'con'){
      location.hash = '/member/managecon/id=' + obj.data.id;
    } else if(obj.event === 'top'){
      location.hash = '/member/managetop/id=' + obj.data.id;
    } else if(obj.event === 'detail'){
      html ='下单时间'+obj.data.create_time;
      if(obj.data.is_send==1){
        html += '</br>姓名:'+obj.data.receiver;
        html += '</br>电话:'+obj.data.receiver_phone;
        html += '</br>地址:'+obj.data.address;
      }
      if(obj.data.col_type==1){
        html += '</br>支付宝账号：'+obj.data.zfb_name;
      }else{
        html += '</br>银行开户行：'+obj.data.bank_name;
        html += '</br>银行卡账号：'+obj.data.bank_num;
      }
      if(obj.data.type==1){
        html += '</br>快递：'+obj.data.express;
        html += '</br>快递单号：'+obj.data.express_num;
      }else {
        html += '</br>上门时间：'+obj.data.sm_time;
      }

      layer.open({
        title: '寄送信息'
        ,content: html
      });
    }
  });
  form.on('submit(show-label-image3)', function (data) {
    let imgs = this.dataset.imgs;
    // console.log(imgs)
    // imgs = JSON.parse(imgs);
    // console.log(imgs.data)
    $('.select-head-img li').remove();
    // $.each(imgs.data, function () {
      $('.select-head-img').append('<li style="cursor:pointer;" data-id="' + this.pid + '" ><img src="' + imgs + '" alt=""></li>')
    // });
    var content = $('#select-head-img').html();
    layer.open({
      type: 1,
      skin: 'layui-layer-rim', //加上边框
      area: ['80%', '500px'], //宽高
      content: content,
      title: false,
      closeBtn: 0,
      shadeClose: true,
    });
  });
  form.on('submit(add-describe)', function (data) {
    let id = this.dataset.id;
    let describe = this.dataset.describe;
    admin.popup({
      title: '编辑备注'
      ,area: ['500px', '400px']
      ,id: 'LAY-popup-content-tags'
      ,success: function(layero, index){
        data.id = id;
        data.describe = describe;
        view(this.id).render('order/tagsformbz', data).done(function(){
          form.render(null, 'layuiadmin-form-tags');
          //监听提交
          form.on('submit(layuiadmin-app-tags-submit)', function(data){
            var field = data.field; //获取提交的字段
            view.request({
              url:'editBz',
              type:'post',
              data:field,
              auth:true,
              tips: true,
              success:function(res){
                if(!res.code){
                  if(res.success){
                    layui.table.reload('LAY-app-content-tags'); //重载表格
                    layer.close(index); //执行关闭
                  }
                }
              }
            })

          });
        });
      }
    });
  });
  //分销订单管理
  table.render({
    elem: '#LAY-app-content-tags-dis'
    ,url: layui.setter.api_host+'getOrderDisList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,height: view.getTableHeight($('.layui-show').children('.layui-tab-iem-option-form').outerHeight(true) + 90)
    ,toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
    ,defaultToolbar: ['filter']
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [20, 30, 50]                 // 每页条数的选择项
    , limit: 20                          // 默认每页条数
    ,cols: [[
      {field: 'create_time', title: '创建时间', minWidth: 200}
      ,{field: 'order_sn', title: '订单号', width: 200}
      ,{field: 'good_name', title: '产品名称', width: 200}
      ,{field: 'status', title: '订单状态', width: 200,templet:function (d) {
          if(d.status==1){
            return '待质检';
          }else if(d.status==2&&d.is_sure==1){
            return '已确认';
          }else if(d.status==2&&d.is_sure!=1){
            return '待确认';
          }else if(d.status==3){
            return '已完成';
          }else{
            return  '';
          }
        }}
      ,{field: 'price', title: '原始估价', width: 200}
      ,{field: 'price_eval', title: '最终估价', width: 200}
      ,{field: 'is_sure', title: '卖家是否确认', width: 200,templet:function (d) {
          if(d.is_sure==1){
            return '已确认';
          }else{
            return  '未确认';
          }
        }}
      ,{field: 'sure_time', title: '确认时间', width: 200}
      ,{field: 'type', title: '订单分类', width: 200,templet:function (d) {
          if(d.type==1){
            return '邮寄';
          }else if(d.type==2){
            return '上门';
          }else if(d.type==3){
            return '线下';
          }else{
            return  '';
          }
        }}
      ,{field: 'receiver', title: '收货姓名', width: 100}
      ,{title: '操作', width: 270, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
    ]],
    parseData: function (res) {
      return {
        "code": res.code, //解析接口状态
        "msg": res.msg, //解析提示文本
        "count": res.data.count, //解析数据长度
        "data": res.data.data //解析数据列表
      }
    }, done: function (res, curr, count) {
      $('td[data-field="image"] .layui-table-cell, .layui-table-tool-panel li').each(function () {
        $(this).css('overflow', 'none !important');
      })
    }
  });
  //监听搜索
  form.on('submit(LAY-app-contlist-search-dis)', function(data){
    var field = data.field;
    console.log(field);
    //执行重载
    table.render({
      elem: '#LAY-app-content-tags-dis'
      ,url: layui.setter.api_host+'getOrderDisList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
      ,height: view.getTableHeight($('.layui-show').children('.layui-tab-iem-option-form').outerHeight(true) + 100)
      // ,toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
      // ,defaultToolbar: ['filter']
      ,where:field
      ,page: true
      , loading: true                      // 开启loading
      , cellMinWidth: 80                   // 每列最小宽度
      , limits: [20, 30, 50]                 // 每页条数的选择项
      , limit: 20                          // 默认每页条数
      ,cols: [[
        {field: 'create_time', title: '创建时间', minWidth: 200}
        ,{field: 'order_sn', title: '订单号', width: 200}
        ,{field: 'good_name', title: '产品名称', width: 200}
        ,{field: 'status', title: '订单状态', width: 200,templet:function (d) {
            if(d.status==1){
              return '待质检';
            }else if(d.status==2&&d.is_sure==1){
              return '已确认';
            }else if(d.status==2&&d.is_sure!=1){
              return '待确认';
            }else if(d.status==3){
              return '已完成';
            }else{
              return  '';
            }
          }}
        ,{field: 'price', title: '原始估价', width: 200}
        ,{field: 'price_eval', title: '最终估价', width: 200}
        ,{field: 'is_sure', title: '卖家是否确认', width: 200,templet:function (d) {
            if(d.is_sure==1){
              return '已确认';
            }else{
              return  '未确认';
            }
          }}
        ,{field: 'sure_time', title: '确认时间', width: 200}
        ,{field: 'type', title: '订单分类', width: 200,templet:function (d) {
            if(d.type==1){
              return '邮寄';
            }else if(d.type==2){
              return '上门';
            }else if(d.type==3){
              return '线下';
            }else{
              return  '';
            }
          }}
        ,{field: 'receiver', title: '收货姓名', width: 100}
        ,{title: '操作', width: 270, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
      ]],
      parseData: function (res) {
        return {
          "code": res.code, //解析接口状态
          "msg": res.msg, //解析提示文本
          "count": res.data.count, //解析数据长度
          "data": res.data.data, //解析数据列表
          "url": res.url //解析数据列表
        }
      }, done: function (res, curr, count) {
        $('td[data-field="image"] .layui-table-cell, .layui-table-tool-panel li').each(function () {
          $(this).css('overflow', 'none !important');
        })
      }
    });
  });
  //头工具栏事件
  table.on('toolbar(LAY-app-content-tags-dis)', function(obj){
    let ranktime = $('#test10').val();
    switch(obj.event){
      case 'exportAllData':
        var department = $('#department').val();
        var position =$('#position').val();
        var username = $('#username').val();
        var phone = $('#phone').val();
        view.request({
          url:'getOrderDisAll',
          type:'get',
          data:{},
          auth:true,
          tips: false,
          success:function(res){
            if(!res.code){
              table.exportFile(res.data.menu, res.data.data);
            }else{
              layer.msg(res.msg,{time:2000});
            }
          }
        });
        break;
    };
  });
  //分销订单监听工具条
  table.on('tool(LAY-app-content-tags-dis)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除？', function(index){
        console.log(obj.data.id);
        view.request({
          url:'orderDel',
          type:'post',
          data:{
            'id':obj.data.id,
          },
          auth:true,
          tips: true,
          success:function(res){
            if(!res.code){
              obj.del();
              layer.close(index);
            }else{
              layer.msg(res.msg,{time:2000});
            }
          }
        })
      });
    } else if(obj.event === 'edit'){
      admin.popup({
        title: '编辑订单状态'
        ,area: ['500px', '400px']
        ,id: 'LAY-popup-content-tags'
        ,success: function(layero, index){
          view(this.id).render('order/tagsform_distribution', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              var field = data.field; //获取提交的字段
              view.request({
                url:'editDis',
                type:'post',
                data:field,
                auth:true,
                tips: true,
                success:function(res){
                  if(!res.code){
                    if(res.success){
                      layui.table.reload('LAY-app-content-tags-dis'); //重载表格
                      layer.close(index); //执行关闭
                    }
                  }
                }
              })

            });
          });
        }
      });
    }else if(obj.event === 'integral'){
      location.hash = '/member/integral/id=' + obj.data.id;
    } else if(obj.event === 'con'){
      location.hash = '/member/managecon/id=' + obj.data.id;
    } else if(obj.event === 'top'){
      location.hash = '/member/managetop/id=' + obj.data.id;
    } else if(obj.event === 'showself'){
      html ='用户名'+obj.data.username+'' +
          '</br>手机号码:'+obj.data.phone;
      layer.open({
        title: '个人信息'
        ,content: html
      });
    }
  });

  exports('order', {})
});
