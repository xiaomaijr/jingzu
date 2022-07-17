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
  ,selfajax  = layui.selfajax
  ,table = layui.table
  ,setter = layui.setter
  ,form = layui.form;
  //管理
  table.render({
    elem: '#LAY-app-content-tags'
    ,toolbar: '#toolbarDemo'
    ,defaultToolbar: ['filter']
    ,url: layui.setter.api_host+'getBannerList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,cols: [[
      // {type: 'numbers', fixed: 'left'}
      {field: 'sort', width: 100, title: '排序', sort: true}
      ,{field: 'image', title: '图片', minWidth: 100, templet: '#imgTpl',style:'padding:0;min-width:150px;'}
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
  //管理头工具栏事件
  table.on('toolbar(LAY-app-content-tags)', function(obj){
    var checkStatus = table.checkStatus(obj.config.id);
    switch(obj.event){
      case 'add':
        admin.popup({
          title: '添加'
          ,area: ['700px', '500px']
          ,id: 'LAY-popup-content-tags'
          ,success: function(layero, index){
            view(this.id).render('banner/tagsform','').done(function(){
              form.render(null, 'layuiadmin-form-tags');
              //跳转类型
              let brand=[{id:1,name:'体育资讯'},{id:2,name:'体育场地'},{id:3,name:'精彩活动'},{id:4,name:'线上赛事'},{id:5,name:'培训课程'}];
              $("#sheng").html('<option value="0">请选择跳转类型</option>');
              $.each(brand, function (key, val) {
                  var option1 = $("<option>").val(val.id).text(val.name);
                //通过LayUI.jQuery添加列表项
                $("#sheng").append(option1);
              });
              layui.form.render('select');
              //监听提交
              form.on('submit(layuiadmin-app-tags-submit)', function(data){
                var field = data.field; //获取提交的字段
                //提交 Ajax 成功后，关闭当前弹层并重载表格
                view.request({
                  url:'BannerAdd',
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
        break;
    };
  });
  //监听工具条
  table.on('tool(LAY-app-content-tags)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除此轮播？', function(index){
        console.log(obj.data.id);
        var field={'id':obj.data.id}
        view.request({
          url:'Bannerdel',
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
        title: '编辑轮播'
        ,area: ['700px', '500px']
        ,id: 'LAY-popup-content-tags'
        ,success: function(layero, index){
          view(this.id).render('banner/tagsform', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            //跳转类型
            let brand=[{id:1,name:'体育资讯'},{id:2,name:'体育场地'},{id:3,name:'精彩活动'},{id:4,name:'线上赛事'},{id:5,name:'培训课程'}];
            $("#sheng").html('<option value="0">请选择跳转类型</option>');
            $.each(brand, function (key, val) {
              if(data.type==val.id){
                var option1 = $("<option selected>").val(val.id).text(val.name);
              }else{
                var option1 = $("<option>").val(val.id).text(val.name);
              }
              //通过LayUI.jQuery添加列表项
              $("#sheng").append(option1);
            });
            layui.form.render('select');
            var option11 = $("<option selected>").val(data.jumpid).text(data.jumpname);
            $("#shi").append(option11);  form.render();
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              var field = data.field; //获取提交的字段
              view.request({
                url:'Banneredit',
                type:'post',
                data:field,
                tips: true,
                auth:true,
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
    }
  });
  //跳转类型详细
  form.on('select(sheng)', function(data){
    selfajax.ajax('getJumpList','get',{type:data.value}, function(res){
      brand=res.data
      $("#shi").html('<option value="0">请选择</option>');
      $.each(brand, function (key, val) {
        var option1 = $("<option>").val(val.id).text(val.name);
        //通过LayUI.jQuery添加列表项
        $("#shi").append(option1);
      });
      layui.form.render('select');
    }, '',function(){
      loading = layer.load();
    },function () {
      layer.close(loading);
    });
  });

  exports('banner', {})
});
