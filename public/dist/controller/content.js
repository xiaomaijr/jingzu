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

  //管理
  table.render({
    elem: '#LAY-app-content-tags'
    ,toolbar: '#toolbarDemo'
    ,defaultToolbar: ['filter']
    ,url: layui.setter.api_host+'getContentList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,height: '500'
    ,cols: [[
      {field: 'title', title: '名称', minWidth: 100}
      // ,{field:'is_best', title:'是否是精华', minWidth:110, templet: '#checkboxTpl', unresize: true}
      ,{field: 'click', title: '点击量', minWidth: 100}
      ,{field: 'create_time', title: '创建时间', minWidth: 100}
      ,{title: '操作', width: 300, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
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
    table.reload('LAY-app-content-tags', {
      where: field
      ,url: layui.setter.api_host+'getContentList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
      ,page: true
      , loading: true                      // 开启loading
      , cellMinWidth: 80                   // 每列最小宽度
      , limits: [15, 30, 50]                 // 每页条数的选择项
      , limit: 10                          // 默认每页条数
      ,cols: [[
        {field: 'title', title: '名称', minWidth: 100}
        ,{field:'is_best', title:'是否是精华', minWidth:110, templet: '#checkboxTpl', unresize: true}
        ,{field: 'click', title: '点击量', minWidth: 100}
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
  });
  //管理头工具栏事件
  table.on('toolbar(LAY-app-content-tags)', function(obj){
    var checkStatus = table.checkStatus(obj.config.id);
    switch(obj.event){
      case 'add':
        admin.popup({
          title: '添加'
          ,area: ['60%', '600px']
          ,id: 'LAY-popup-content-tags'
          ,success: function(layero, index){
            view(this.id).render('content/edit','').done(function(){
              form.render(null, 'layuiadmin-form-tags');
              var edit = tinymce.render({
                elem: "#mytextarea"
                , height: 600
                ,menubar: false //隐藏菜单栏
                , images_upload_url:'/admin/abundantUpload'
              });
              //监听提交
              form.on('submit(layuiadmin-app-tags-submit)', function(data){
                var field = data.field; //获取提交的字段
                data.field.content = edit.getContent();
                //提交 Ajax 成功后，关闭当前弹层并重载表格
                view.request({
                  url:'ContentAdd',
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
        break;
    };
  });
  //监听工具条
  table.on('tool(LAY-app-content-tags)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除？', function(index){
        console.log(obj.data.id);
        selfajax.ajax('Contentdel','post',{
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
          view(this.id).render('content/edit', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            var edit = tinymce.render({
              elem: "#mytextarea"
              , height: 600
              ,menubar: false //隐藏菜单栏
              , images_upload_url:'/admin/abundantUpload'
            });
            // if(data.type==1){
            //   $('#cz').html('(402*221)');
            // }else{
            //   $('#cz').html('(300*300)');
            // }
            if(data.jump_type==2){
              $('#urlurl').show();
            }
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              if(data.field.id!=3&&data.field.id!=4){
                data.field.content = edit.getContent();
              }
              var field = data.field; //获取提交的字段

              selfajax.ajax('ContentEdit','post',field, function(res){
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
    }else if(obj.event === 'seec'){
      location.hash = '/content/managecomment/aid=' + obj.data.id;
    }
  });
  var id = router.search.aid
  //评论管理
  table.render({
    elem: '#LAY-app-content-comm'
    ,url: layui.setter.api_host+'getContentCommentList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    , where:{
      aid:id,
    }
    ,cols: [[
      // {type: 'checkbox', fixed: 'left'}
      {field: 'id', width: 100, title: 'ID', sort: true}
      // ,{field: 'title', minWidth: 100, title: '标题'}
      ,{field: 'username', title: '评论者', width: 100}
      ,{field: 'description', title: '内容', minWidth: 100}
      ,{field: 'status', title: '管理员审核状态', width: 150, templet:function(d){
          if(d.status =='0'){
            return '审核通过';
          }else if(d.status =='1'){
            return '审核中';
          }else if(d.status =='2'){
            return '审核不通过';
          }else{
            return '未知';
          }
        }}
      ,{field: 'reason', title: '原因', minWidth: 100}
      // ,{field: 'status', title: '接口审核状态', width: 150, templet:function(d){
      //     if(d.inte_status =='0'){
      //       return '审核通过';
      //     }else if(d.inte_status =='2'){
      //       return '审核不通过';
      //     }else{
      //       return '未知';
      //     }
      //   }}
      ,{title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
    ]]
    ,parseData: function (res) {
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
  table.on('tool(LAY-app-content-comm)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除此条评论？', function(index){
        var field={'id':obj.data.id}
        selfajax.ajax('delContentComment','post',field, function(res){
          if(!res.code){
            layer.msg(res.msg,{time:2000},function(){
              if(res.success){
                layui.table.reload('LAY-app-content-comm'); //重载表格
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
    } else if(obj.event === 'toexam'){
      admin.popup({
        title: '审核评论'
        ,area: ['60%', '500px']
        ,id: 'LAY-popup-content-comm'
        ,success: function(layero, index){
          view(this.id).render('content/tagsformcomment', data).done(function(){
            form.render(null, 'layuiadmin-form-comment');
            var edit = tinymce.render({
              elem: "#mytextarea"
              , height: 600
              ,menubar: false //隐藏菜单栏
              , images_upload_url:'/admin/abundantUpload'
              ,font_formats: '幼圆=YouYuan;隶书=LiSu;楷体=楷体;华康新综艺体W9=华康新综艺体W9,华康新综艺体W9(P);方正楷体简体=方正清刻本悦宋简体;微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif,宋体,新宋体;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;'
            });
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              var field = data.field; //获取提交的字段
              selfajax.ajax('ContenttoExamComment','post',field, function(res){
                if(!res.code){
                  layer.msg(res.msg,{time:2000},function(){
                    if(res.success){
                      layui.table.reload('LAY-app-content-comm'); //重载表格
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
    }else if(obj.event === 'toreplay'){
      admin.popup({
        title: '回复内容'
        ,area: ['60%', '500px']
        ,id: 'LAY-popup-content-comm'
        ,success: function(layero, index){
          view(this.id).render('topic/tagsformreply', data).done(function(){
            form.render(null, 'layuiadmin-form-comment');
            var edit = tinymce.render({
              elem: "#mytextarea"
              , height: 300
              ,menubar: false //隐藏菜单栏
              , images_upload_url:'/admin/abundantUpload'
              ,plugins : 'emoticons'
              ,font_formats: '幼圆=YouYuan;隶书=LiSu;楷体=楷体;华康新综艺体W9=华康新综艺体W9,华康新综艺体W9(P);方正楷体简体=方正清刻本悦宋简体;微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif,宋体,新宋体;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;'
            });
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              data.field.description = edit.getContent();
              var field = data.field; //获取提交的字段
              selfajax.ajax('/admin/TopicreplyByAdmin','post',field, function(res){
                if(!res.code){
                  layer.msg(res.msg,{time:2000},function(){
                    if(res.success){
                      layui.table.reload('LAY-app-content-comm'); //重载表格
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
    }
  });
  //跳转类型详细
  form.on('select(sheng)', function(data){
      if(data.value==1){
          $('#cz').html('(402*221)');
      }else{
          $('#cz').html('(300*300)');
      }
  });
  //跳转类型
  form.on('select(jump_type)', function(data){
    console.log(data)
    if(data.value==1){
      $('#urlurl').hide();
    }else{
      $('#urlurl').show();
    }
  });
  //监听精华操作
  form.on('checkbox(lockDemo)', function(obj){
    // layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
    view.request({
      url:'ContentBest',
      type:'post',
      data:{
        id:obj.value,
        is_best:obj.elem.checked,
      },
      tips: true,
      auth:true,
      success:function(res){
        if(!res.code){
          if(res.success){
            // layui.table.reload('LAY-app-content-tags'); //重载表格
            layer.close(index); //执行关闭
          }
        }
      }
    })
  });

  exports('content', {})
});
