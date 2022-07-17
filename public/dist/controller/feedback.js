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
  ,laydate = layui.laydate
  ,tinymce = layui.tinymce
  ,selfajax  = layui.selfajax
  ,router = layui.router()
  ,search = router.search
  ,setter = layui.setter
  ,form = layui.form;

  var id = router.search.id

  //反馈管理
  table.render({
    elem: '#LAY-app-content-tags'
    ,url: layui.setter.api_host+'getFeedbackList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,cols: [[
      // {type: 'numbers', fixed: 'left'}
      // {field: 'id', width: 100, title: '项目ID', sort: true}
      {field: 'name', title: '名称', minWidth: 100}
      ,{field: 'email', title: '邮箱', minWidth: 100}
      ,{field: 'phone', title: '手机', minWidth: 100}
      ,{field: 'content', title: '内容', minWidth: 100}
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
  //监听工具条
  table.on('tool(LAY-app-content-tags)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除？', function(index){
        console.log(obj.data.id);
        selfajax.ajax('delFeedback','post',{
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
          view(this.id).render('content/tagsform', data).done(function(){
            form.render(null, 'layuiadmin-form-comment');
            var edit = tinymce.render({
              elem: "#mytextarea"
              , height: 600
              , images_upload_url:'/admin/abundantUpload'
            });
            laydate.render({
              elem: '#date'
            });
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              // data.field.content = edit.getContent();
              var field = data.field; //获取提交的字段
              data.field.content = edit.getContent();

              selfajax.ajax('/admin/Contentedit','post',field, function(res){
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
  //分类管理
  table.render({
    elem: '#LAY-app-content-tags-type'
    ,url: layui.setter.www_NAME+'/admin/getContentTypeList'  //模拟接口
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,cols: [[
      // {type: 'numbers', fixed: 'left'}
      {field: 'id', width: 100, title: '项目ID', sort: true}
      ,{field: 'title', title: '名称', minWidth: 100}
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
  //监听工具条
  table.on('tool(LAY-app-content-tags-type)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除？', function(index){
        console.log(obj.data.id);
        selfajax.ajax('/admin/ContentTypedel','post',{
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
          view(this.id).render('content/catetagsform', data).done(function(){
            form.render(null, 'layuiadmin-form-comment');

            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              // data.field.content = edit.getContent();
              var field = data.field; //获取提交的字段

              selfajax.ajax('/admin/ContentTypeedit','post',field, function(res){
                if(!res.code){
                  layer.msg(res.msg,{time:2000},function(){
                    if(res.success){
                      layui.table.reload('LAY-app-content-tags-type'); //重载表格
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

  exports('feedback', {})
});
