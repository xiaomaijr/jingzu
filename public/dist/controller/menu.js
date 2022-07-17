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
  ,setter = layui.setter
  ,selfajax = layui.selfajax
  ,router = layui.router()
  ,form = layui.form;
  var id = router.search.pid
  if(typeof (id)=='undefined'){
    id=0;
  }
  layui.pid=id;
  //分类管理
  table.render({
    elem: '#LAY-app-content-tags'
    ,url: layui.setter.api_host+'/getMenuList?pid='+id+'&access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,height: view.getTableHeight($('.layui-show').children('.layui-tab-iem-option-form').outerHeight(true) + 90)
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,cols: [[
      // {type: 'numbers', fixed: 'left'}
      {field: 'id', width: 100, title: '菜单ID', sort: true}
      ,{field: 'title', title: '菜单名', minWidth: 100}
      ,{field: 'icon', title: '菜单icon', minWidth: 100}
      ,{field: 'jump', title: '路径', minWidth: 100}
      ,{field: 'parent', title: '父级', minWidth: 100}
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
      layer.confirm('确定删除此菜单？', function(index){
        console.log(obj.data.id);
        var field={'id':obj.data.id}
        selfajax.ajax('Menudel','post',field, function(res){
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
        }, '',function(){
          loading = layer.load();
        },function () {
          layer.close(loading);
        });
      });
    } else if(obj.event === 'edit'){
      admin.popup({
        title: '编辑菜单'
        ,area: ['500px', '400px']
        ,id: 'LAY-popup-content-tags'
        ,success: function(layero, index){
          console.log(this.id);
          console.log(data);
          view(this.id).render('menu/tagsform', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');

            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              var field = data.field; //获取提交的字段
              selfajax.ajax('/MenuEdit','post',field, function(res){
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
              }, '',function(){
                loading = layer.load();
              },function () {
                layer.close(loading);
              });
            });

          });
        }
      });
    }else if(obj.event==='editc'){
      location.hash = '/menu/manage/pid=' + obj.data.id+'/level='+(Number(obj.data.level)+1);
    }
  });

  exports('menu', {})
});
