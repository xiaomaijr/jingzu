/** layuiAdmin.std-v1.0.0 LPPL License By http://www.layui.com/admin/ */
 ;/**
 @Name：layuiAdmin 内容系统
 @Author：star1029
 @Site：http://www.layui.com/admin/
 @License：LPPL
 */
layui.define(['table', 'form','selfajax','tinymce', 'laydate'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,setter = layui.setter
  ,laydate = layui.laydate
  ,tinymce = layui.tinymce
  ,selfajax  = layui.selfajax
  ,router = layui.router()
  ,search = router.search
  ,form = layui.form;

  var id = router.search.id

  //权益图标管理
  table.render({
    elem: '#LAY-app-content-tags'
    ,toolbar: '#toolbarDemo'
    ,defaultToolbar: ['filter']
    ,url: layui.setter.api_host+'getSdIconList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,cols: [[
      {field: 'title', title: '名称', minWidth: 100}
      ,{field: 'type', title: '类型', minWidth: 100, templet: function(d){
          if(d.type==1){
            return '领袖';
          }else if(d.type==2){
            return '私董';
          }else if(d.type==3){
            return '委员';
          }else if(d.type==4){
            return '';
          }else{

          }
        }}
      ,{field: 'image', title: '图片', minWidth: 100, templet: '#imgTpl1',style:'padding:0;min-width:150px;'}
      ,{field: 'create_time', title: '创建时间', minWidth: 100}
      ,{title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
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
  //权益图标管理头工具栏事件
  table.on('toolbar(LAY-app-content-tags)', function(obj){
    var checkStatus = table.checkStatus(obj.config.id);
    switch(obj.event){
      case 'add':
        admin.popup({
          title: '添加'
          ,area: ['60%', '600px']
          ,id: 'LAY-popup-content-tags'
          ,success: function(layero, index){
            view(this.id).render('sd/edit','').done(function(){
              form.render(null, 'layuiadmin-form-tags');
              //监听提交
              form.on('submit(layuiadmin-app-tags-submit)', function(data){
                var field = data.field; //获取提交的字段
                //提交 Ajax 成功后，关闭当前弹层并重载表格
                view.request({
                  url:'SdhAdd',
                  type:'post',
                  data:field,
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
        break;
    };
  });
  //权益图标监听工具条
  table.on('tool(LAY-app-content-tags)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除？', function(index){
        console.log(obj.data.id);
        selfajax.ajax('SdhDel','post',{
          'id':obj.data.id,
        }, function(res){
          if(!res.code){
            layer.msg(res.msg,{time:2000},function(){
              if(res.success){
                obj.del();
                layer.close(index);
              }
            })
          }else{
            layer.msg(res.msg,{time:2000});
          }
        });
      });
    } else if(obj.event === 'edit'){
      admin.popup({
        title: '编辑'
        ,area: ['60%', '600px']
        ,id: 'layuiadmin-app-form-tags'
        ,success: function(layero, index){
          console.log(data);
          view(this.id).render('sd/edit', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              var field = data.field; //获取提交的字段

              selfajax.ajax('SdhEdit','post',field, function(res){
                if(!res.code){
                  layer.msg(res.msg,{time:2000},function(){
                    if(res.success){
                      layui.table.reload('LAY-app-content-tags'); //重载表格
                      layer.close(index); //执行关闭
                    }
                  })
                }else{
                  layer.msg(res.msg,{time:2000});
                }
              },'', function (res) {
                loading = layer.load();
              },function(){
                layer.close(loading);
              });
            });
          });
        }
      });
    }
  });
  //权益明细管理
  table.render({
    elem: '#LAY-app-content-tags-right'
    ,toolbar: '#toolbarDemo-right'
    ,defaultToolbar: ['filter']
    ,url: layui.setter.api_host+'getSdRightList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,cols: [[
      {field: 'title', title: '名称', minWidth: 100}
      ,{field: 'type', title: '类型', minWidth: 100, templet: function(d){
          if(d.type==1){
            return '领袖';
          }else if(d.type==2){
            return '私董';
          }else if(d.type==3){
            return '委员';
          }else if(d.type==4){
            return '';
          }else{

          }
        }}
      ,{field: 'create_time', title: '创建时间', minWidth: 100}
      ,{title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
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
  //权益明细管理头工具栏事件
  table.on('toolbar(LAY-app-content-tags-right)', function(obj){
    var checkStatus = table.checkStatus(obj.config.id);
    switch(obj.event){
      case 'add':
        admin.popup({
          title: '添加'
          ,area: ['60%', '600px']
          ,id: 'LAY-popup-content-tags'
          ,success: function(layero, index){
            view(this.id).render('sd/edit_right','').done(function(){
              form.render(null, 'layuiadmin-form-tags');
              //监听提交
              form.on('submit(layuiadmin-app-tags-submit)', function(data){
                var field = data.field; //获取提交的字段
                //提交 Ajax 成功后，关闭当前弹层并重载表格
                view.request({
                  url:'SdhRightAdd',
                  type:'post',
                  data:field,
                  tips: true,
                  success:function(res){
                    if(!res.code){
                      if(res.success){
                        layui.table.reload('LAY-app-content-tags-right'); //重载表格
                        layer.close(index); //执行关闭
                      }
                    }
                  }
                })
              });
            });
          }
        });
        break;
    };
  });
  //权益明细监听工具条
  table.on('tool(LAY-app-content-tags-right)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除？', function(index){
        console.log(obj.data.id);
        selfajax.ajax('SdhRightDel','post',{
          'id':obj.data.id,
        }, function(res){
          if(!res.code){
            layer.msg(res.msg,{time:2000},function(){
              if(res.success){
                obj.del();
                layer.close(index);
              }
            })
          }else{
            layer.msg(res.msg,{time:2000});
          }
        });
      });
    } else if(obj.event === 'edit'){
      admin.popup({
        title: '编辑'
        ,area: ['60%', '600px']
        ,id: 'layuiadmin-app-form-tags'
        ,success: function(layero, index){
          console.log(data);
          view(this.id).render('sd/edit_right', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              var field = data.field; //获取提交的字段

              selfajax.ajax('SdhRightEdit','post',field, function(res){
                if(!res.code){
                  layer.msg(res.msg,{time:2000},function(){
                    if(res.success){
                      layui.table.reload('LAY-app-content-tags-right'); //重载表格
                      layer.close(index); //执行关闭
                    }
                  })
                }else{
                  layer.msg(res.msg,{time:2000});
                }
              },'', function (res) {
                loading = layer.load();
              },function(){
                layer.close(loading);
              });
            });
          });
        }
      });
    }
  });
  //权益明细说明管理
  table.render({
    elem: '#LAY-app-content-tags-right-des'
    // ,toolbar: '#toolbarDemo-right-des'
    // ,defaultToolbar: ['filter']
    ,url: layui.setter.api_host+'getSdRightDesList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,cols: [[
      {field: 'type', title: '类型', minWidth: 300, templet: function(d){
          if(d.type==1){
            return '领袖';
          }else if(d.type==2){
            return '私董';
          }else if(d.type==3){
            return '委员';
          }else if(d.type==4){
            return '';
          }else{

          }
        }}
      ,{field: 'create_time', title: '创建时间', minWidth: 100}
      ,{title: '操作', minWidth: 150, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
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
  //权益明细说明管理头工具栏事件
  table.on('toolbar(LAY-app-content-tags-right-des)', function(obj){
    var checkStatus = table.checkStatus(obj.config.id);
    switch(obj.event){
      case 'add':
        admin.popup({
          title: '添加'
          ,area: ['60%', '600px']
          ,id: 'LAY-popup-content-tags'
          ,success: function(layero, index){
            view(this.id).render('sd/edit_right_des','').done(function(){
              form.render(null, 'layuiadmin-form-tags');
              var edit = tinymce.render({
                elem: "#mytextarea"
                , height: 600
                , images_upload_url:'/admin/abundantUpload'
              });
              //监听提交
              form.on('submit(layuiadmin-app-tags-submit)', function(data){
                var field = data.field; //获取提交的字段
                data.field.content = edit.getContent();
                //提交 Ajax 成功后，关闭当前弹层并重载表格
                view.request({
                  url:'SdhRightDesAdd',
                  type:'post',
                  data:field,
                  tips: true,
                  success:function(res){
                    if(!res.code){
                      if(res.success){
                        layui.table.reload('LAY-app-content-tags-right-des'); //重载表格
                        layer.close(index); //执行关闭
                      }
                    }
                  }
                })
              });
            });
          }
        });
        break;
    };
  });
  //权益明细说明监听工具条
  table.on('tool(LAY-app-content-tags-right-des)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除？', function(index){
        console.log(obj.data.id);
        selfajax.ajax('SdhRightDesDel','post',{
          'id':obj.data.id,
        }, function(res){
          if(!res.code){
            layer.msg(res.msg,{time:2000},function(){
              if(res.success){
                obj.del();
                layer.close(index);
              }
            })
          }else{
            layer.msg(res.msg,{time:2000});
          }
        });
      });
    } else if(obj.event === 'edit'){
      admin.popup({
        title: '编辑'
        ,area: ['60%', '600px']
        ,id: 'layuiadmin-app-form-tags'
        ,success: function(layero, index){
          console.log(data);
          view(this.id).render('sd/edit_right_des', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            var edit = tinymce.render({
              elem: "#mytextarea"
              , height: 600
              , images_upload_url:'/admin/abundantUpload'
            });
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              var field = data.field; //获取提交的字段
              data.field.content = edit.getContent();
              selfajax.ajax('SdhRightDesEdit','post',field, function(res){
                if(!res.code){
                  layer.msg(res.msg,{time:2000},function(){
                    if(res.success){
                      layui.table.reload('LAY-app-content-tags-right-des'); //重载表格
                      layer.close(index); //执行关闭
                    }
                  })
                }else{
                  layer.msg(res.msg,{time:2000});
                }
              },'', function (res) {
                loading = layer.load();
              },function(){
                layer.close(loading);
              });
            });
          });
        }
      });
    }
  });
  exports('sdh', {})
});
