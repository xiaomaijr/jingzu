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

  //用户管理
  table.render({
    elem: '#LAY-app-content-tags'
    ,url: layui.setter.api_host+'getMemberList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,height: view.getTableHeight($('.layui-show').children('.layui-tab-iem-option-form').outerHeight(true) + 90)
    ,toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
    ,defaultToolbar: ['filter']
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,cols: [[
      {field: 'id', width: 100, title: '用户ID', sort: true}
      ,{field: 'username', title: '昵称', minWidth: 100}
      ,{field: 'image', title: '头像', minWidth: 100, templet: '#imgTpl',style:'padding:0;'}
      ,{field: 'phone', title: '手机', minWidth: 100}
      ,{field: 'create_time', title: '创建时间', minWidth: 100}
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

    //执行重载
    table.render({
      elem: '#LAY-app-content-tags'
      ,url: layui.setter.api_host+'getMemberList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
      ,height: view.getTableHeight($('.layui-show').children('.layui-tab-iem-option-form').outerHeight(true) + 90)
      ,toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
      ,defaultToolbar: ['filter']
      ,where:field
      ,page: true
      , loading: true                      // 开启loading
      , cellMinWidth: 80                   // 每列最小宽度
      , limits: [15, 30, 50]                 // 每页条数的选择项
      , limit: 10                          // 默认每页条数
      ,cols: [[
        {type: 'checkbox', fixed: 'left'}
        ,{field: 'id', title: 'ID', width: 100}
        ,{field: 'phone', title: '手机号', minWidth:100 }
        ,{field: 'is_distribution', title: '是否是分销商', minWidth:100,templet:function(d){
            if(d.is_distribution==1){
              return '是' ;
            }else {
              return '否' ;
            }
          } }
        ,{field: 'create_time', title: '创建时间', minWidth: 100}
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
      case 'add':
        admin.popup({
          title: '添加会员'
          ,area: ['50%', '400px']
          ,id: 'LAY-popup-content-tags'
          ,success: function(layero, index){
            view(this.id).render('member/tagsform').done(function(){
              form.render(null, 'layuiadmin-form-tags');
              //公司
              //部门
              // form.on('select(company)', function(data){
              //   $("#department_id").empty();
              //   selfajax.ajax('getMemberDpListAll','get',{pid:data.value}, function(res){
              //     $.each(res.data, function (key, val) {
              //         var option1 = $("<option>").val(val.id).text(val.name);
              //       //通过LayUI.jQuery添加列表项
              //       $("#department_id").append(option1);
              //     });
              //     layui.form.render('select');
              //   }, '',function(){
              //     loading = layer.load();
              //   },function () {
              //     layer.close(loading);
              //   });
              // });
              //监听提交
              form.on('submit(layuiadmin-app-tags-submit)', function(data){
                view.request({
                  url:'MemberAdd',
                  type:'post',
                  data:data.field,
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
      case 'delSelected':
        layer.confirm('确定删除？', function(index){
          var checkStatus = table.checkStatus('LAY-app-content-tags');
          let data = checkStatus.data;
          let keywords = [];
          for (let i = 0; i < data.length; i++) {
            keywords.push(data[i].id)
          }
          let ids = keywords.join(',');

          view.request({
            url:'MemberbatchDel',
            type:'post',
            data:{
              'ids':ids,
            },
            auth:true,
            tips: true,
            success:function(res){
              if(!res.code){
                layui.table.reload('LAY-app-content-tags'); //重载表格
                layer.close(index); //执行关闭
              }else{
                layer.msg(res.msg,{time:2000});
              }
            }
          })
        });
        break;
      case 'exportAllData':
        var department = $('#department').val();
        var position =$('#position').val();
        var username = $('#username').val();
        var phone = $('#phone').val();
        view.request({
          url:'getMemberAll',
          type:'get',
          data:{
            department:department,
            position:position,
            username:username,
            phone:phone,
          },
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
      layer.confirm('确定删除此用户？', function(index){
        console.log(obj.data.id);
        view.request({
          url:'Memberdel',
          type:'post',
          data:{
            'id':obj.data.id,
          },
          auth:true,
          tips: true,
          success:function(res){
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
          }
        })
      });
    } else if(obj.event === 'edit'){
      admin.popup({
        title: '编辑'
        ,area: ['50%', '500px']
        ,id: 'LAY-popup-content-tags'
        ,success: function(layero, index){
          view(this.id).render('member/tagsform', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            //公司
            $("#department_id").append($("<option selected>").val(data.department_id).text(data.department_name));
            //部门

            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              var field = data.field; //获取提交的字段
              view.request({
                url:'Memberedit',
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
      html ='用户名:'+obj.data.realname+'' +
          '</br>手机号码:'+obj.data.phone;
      layer.open({
        title: '个人信息'
        ,content: html
      });
    }
  });
  //公司部门管理
  var id = router.search.pid
  var level = router.search.level
  table.render({
    elem: '#LAY-app-content-tags-cate'
    ,url: layui.setter.api_host+'getMemberDpList?pid='+id+'&access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,cols: [[
      // {type: 'numbers', fixed: 'left'}
      {field: 'id', width: 100, title: 'ID', sort: true}
      ,{field: 'title', title: '公司名称', minWidth: 100}
      ,{field: 'create_time', title: '创建时间', minWidth: 100}
      ,{title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
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
      if(res.url==1){
        $('#title').html('添加公司');
      }else{
        $('#title').html('添加部门');
      }
    }
  });
  //部门职位监听工具条
  table.on('tool(LAY-app-content-tags-cate)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除？', function(index){
        console.log(obj.data.id);
        var field={'id':obj.data.id}
        selfajax.ajax('MemberDpdel','post',field, function(res){
          if(!res.code){
            layer.msg(res.msg,{time:2000},function(){
              if(res.success){
                layui.table.reload('LAY-app-content-tags-cate'); //重载表格
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
        title: '编辑'
        ,area: ['30%', '400px']
        ,id: 'LAY-popup-content-tags'
        ,success: function(layero, index){
          console.log(this.id);
          console.log(data);
          view(this.id).render('member/tagsformdp', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              // data.field.content = edit.getContent();
              var field = data.field; //获取提交的字段
              selfajax.ajax('MemberDpEdit','post',field, function(res){
                if(!res.code){
                  layer.msg(res.msg,{time:2000},function(){
                    if(res.success){
                      layui.table.reload('LAY-app-content-tags-cate'); //重载表格
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
    }else if(obj.event === 'gochild'){
      location.hash = '/member/managedp/pid=' + obj.data.id+'/level='+(Number(obj.data.level)+1);
    }
  });
  exports('member', {})
});
