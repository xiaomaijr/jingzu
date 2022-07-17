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

  //设定管理
  table.render({
    elem: '#LAY-app-content-tags'
    ,url: layui.setter.api_host+'getSystemList?id=1&access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 50                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 20                          // 默认每页条数
    ,cols: [[
      // {type: 'numbers', fixed: 'left'}
      {field: 'id', width: 100, title: 'ID', sort: true}
      ,{field: 'title', title: '名称', minWidth: 100}
      ,{field: 'description', title: '简介', minWidth: 160}
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
  //设定监听工具条
  table.on('tool(LAY-app-content-tags)', function(obj){
    var data = obj.data;
    if(obj.event === 'edit'){
      admin.popup({
        title: '编辑'
        ,area: ['80%', '90%']
        ,id: 'layuiadmin-app-form-tags'
        ,success: function(layero, index){
          console.log(data);
          view(this.id).render('systemset/edit', data).done(function(){
            form.render(null, 'layuiadmin-form-comment');
            console.log(data);
            if(data.id==4){
              // 时间
              laydate.render({
                elem: '#num'
              });
            }
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              // data.field.content = edit.getContent();
              var field = data.field; //获取提交的字段

              selfajax.ajax('SystemEdit','post',field, function(res){
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
  //条件设定管理
  table.render({
    elem: '#LAY-app-content-tags-condition'
    ,url: layui.setter.api_host+'getSystemConditionList?id=1&access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 50                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 20                          // 默认每页条数
    ,cols: [[
      // {type: 'numbers', fixed: 'left'}
      {field: 'id', width: 100, title: 'ID', sort: true}
      ,{field: 'title', title: '名称', minWidth: 100}
      ,{field: 'description', title: '简介', minWidth: 160}
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
  //设定监听工具条
  table.on('tool(LAY-app-content-tags-condition)', function(obj){
    var data = obj.data;
   if(obj.event === 'edit'){
      admin.popup({
        title: '编辑'
        ,area: ['80%', '90%']
        ,id: 'layuiadmin-app-form-tags'
        ,success: function(layero, index){
          console.log(data);
          view(this.id).render('systemset/editcondition', data).done(function(){
            form.render(null, 'layuiadmin-form-comment');
            laydate.render({
              elem: '#sub_date'
            });
            laydate.render({
              elem: '#pay_date'
            });
            laydate.render({
              elem: '#re_date'
            });
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              // data.field.content = edit.getContent();
              var field = data.field; //获取提交的字段

              selfajax.ajax('editCondition','post',field, function(res){
                if(!res.code){
                  layer.msg(res.msg,{time:2000},function(){
                    if(res.success){
                      layui.table.reload('LAY-app-content-tags-condition'); //重载表格
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

  exports('system', {})
});
