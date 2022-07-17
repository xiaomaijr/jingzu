/**
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
  ,tinymce = layui.tinymce
  ,laydate = layui.laydate
  ,setter = layui.setter
  ,selfajax  = layui.selfajax
  ,router = layui.router()
  ,search = router.search
  ,form = layui.form;
  var type = router.search.type;
  var pid = router.search.aid;
  //数据管理
  table.render({
    elem: '#LAY-app-content-tags-data'
    ,url: setter.api_host + 'getActivityDataList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,toolbar: '#toolbarDemo'
    ,defaultToolbar: ['filter']
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,cols: [[
      // {type: 'numbers', fixed: 'left'}
      {field: 'sort', width: 100, title: '排序', sort: true}
      ,{field: 'type', title: '类型', minWidth: 100,templet:function (d) {
          if(d.type==1){
            return '视频';
          }else{
            return '内容';
          }
        }}
      ,{field: 'create_time', title: '创建时间', minWidth: 100}
      ,{title: '操作', width: 270, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
    ]],
    where:{
      pid:pid,
    },
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
      if(type==1){
        $('#title').html('纤维管理');
      }else{
        $('#title').html('面料管理');
      }
    }
  });
  //管理头工具栏事件
  table.on('toolbar(LAY-app-content-tags-data)', function(obj){
    var checkStatus = table.checkStatus(obj.config.id);
    switch(obj.event){
      case 'add':
        admin.popup({
          title: '添加'
          ,area: ['60%', '600px']
          ,id: 'layuiadmin-app-form-tags'
          ,success: function(layero, index){
            var data={}
            data.type= type;
            view(this.id).render('activity/edit_data',data).done(function(){
              form.render(null, 'layuiadmin-form-tags');
              // var edit = tinymce.render({
              //   elem: "#mytextarea"
              //   , height: 600
              //   , images_upload_url:'/admin/abundantUpload'
              // });
              //监听提交
              form.on('submit(layuiadmin-app-tags-submit)', function(data){
                // data.field.content = edit.getContent();
                var field = data.field; //获取提交的字段
                data.field.pid=pid;
                data.field.type=1;
                //提交 Ajax 成功后，关闭当前弹层并重载表格
                selfajax.ajax('ActivityDataAdd','post',field, function(res){
                  if(!res.code){
                    layer.msg(res.msg,{time:2000},function(){
                      if(res.success){
                        layui.table.reload('LAY-app-content-tags-data'); //重载表格
                        layer.close(index); //执行关闭
                      }
                    })
                  }else{
                    layer.msg(res.msg,{time:2000});
                  }
                });
              });
            });
          }
        });
        break;
      case 'addcon':
        admin.popup({
          title: '添加图片'
          ,area: ['60%', '600px']
          ,id: 'layuiadmin-app-form-tags'
          ,success: function(layero, index){
            var data={}
            data.type= type;
            view(this.id).render('activity/edit_data_con',data).done(function(){
              form.render(null, 'layuiadmin-form-tags');
              var edit = tinymce.render({
                elem: "#mytextarea"
                , height: 600
                , images_upload_url:'/admin/abundantUpload'
              });
              //监听提交
              form.on('submit(layuiadmin-app-tags-submit)', function(data){
                data.field.content = edit.getContent();
                var field = data.field; //获取提交的字段
                data.field.pid=pid;
                data.field.type=2;
                //提交 Ajax 成功后，关闭当前弹层并重载表格
                selfajax.ajax('ActivityDataAdd','post',field, function(res){
                  if(!res.code){
                    layer.msg(res.msg,{time:2000},function(){
                      if(res.success){
                        layui.table.reload('LAY-app-content-tags-data'); //重载表格
                        layer.close(index); //执行关闭
                      }
                    })
                  }else{
                    layer.msg(res.msg,{time:2000});
                  }
                });
              });
            });
          }
        });
        break;
    };
  });
  //监听工具条
  table.on('tool(LAY-app-content-tags-data)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除？', function(index){
        console.log(obj.data.id);
        view.request({
          url:'ActivityDatadel',
          type:'post',
          data:{
            'id':obj.data.id,
          },
          tips: true,
          auth:true,
          success:function(res){
            if(!res.code){
              if(res.success){
                obj.del();
                layer.close(index);
              }
            }
          }
        })
      });
    } else if(obj.event === 'edit'){
      admin.popup({
        title: '编辑'
        ,area: ['60%', '600px']
        ,id: 'layuiadmin-app-form-tags'
        ,success: function(layero, index){
          layui.xxx=data.space_id
          view(this.id).render('activity/edit_data', data).done(function(){
            form.render(null, 'layuiadmin-form-comment');
            var edit = tinymce.render({
              elem: "#mytextarea"
              , height: 600
              , images_upload_url:'/admin/abundantUpload'
            });
            form.render();
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              // data.field.content = edit.getContent();
              var field = data.field; //获取提交的字段
              data.field.type = 1;
              data.field.pid=pid;
              selfajax.ajax('ActivityDataEdit','post',field, function(res){
                if(!res.code){
                  layer.msg(res.msg,{time:2000},function(){
                    if(res.success){
                      layui.table.reload('LAY-app-content-tags-data'); //重载表格
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
    } else if(obj.event === 'editcon'){
      admin.popup({
        title: '编辑'
        ,area: ['60%', '600px']
        ,id: 'layuiadmin-app-form-tags'
        ,success: function(layero, index){
          layui.xxx=data.space_id
          view(this.id).render('activity/edit_data_con', data).done(function(){
            form.render(null, 'layuiadmin-form-comment');
            var edit = tinymce.render({
              elem: "#mytextarea"
              , height: 600
              , images_upload_url:'/admin/abundantUpload'
            });
            form.render();
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              data.field.content = edit.getContent();
              var field = data.field; //获取提交的字段
              data.field.type = 2;
              data.field.pid=pid;
              selfajax.ajax('ActivityDataEdit','post',field, function(res){
                if(!res.code){
                  layer.msg(res.msg,{time:2000},function(){
                    if(res.success){
                      layui.table.reload('LAY-app-content-tags-data'); //重载表格
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
    }else if(obj.event==='seespace'){
      layui.data.d=obj.data;
      location.hash = '/activityagent/process/aid=' + obj.data.id;
    }
  });

  exports('activitydata', {})
});
