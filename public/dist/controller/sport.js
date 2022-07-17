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

  //体育场地管理
  table.render({
    elem: '#LAY-app-content-tags'
    ,toolbar: '#toolbarDemo'
    ,defaultToolbar: ['filter']
    ,url: layui.setter.api_host+'getSportList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,height: '500'
    ,cols: [[
      {field: 'title', title: '名称', width: 100}
      // ,{field: 'logo', title: '列表图片', width: 150, templet: '#imgTpl1',style:'padding:0;min-width:150px;'}
      ,{field: 'image', title: '详情图片', width: 150, templet: '#imgTpl2',style:'padding:0;min-width:150px;'}
      ,{field: 'parameter1', title: '评分', width: 100}
      ,{field: 'parameter2', title: '每人消费', width: 100}
      ,{field: 'parameter3', title: '类型', width: 200}
      ,{field: 'create_time', title: '创建时间', width: 200}
      ,{title: '操作', width: 350, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
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
      ,url: layui.setter.api_host+'getSportList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
      ,page: true
      , loading: true                      // 开启loading
      , cellMinWidth: 80                   // 每列最小宽度
      , limits: [15, 30, 50]                 // 每页条数的选择项
      , limit: 10                          // 默认每页条数
      ,cols: [[
        {field: 'title', title: '名称', width: 100}
        // ,{field: 'logo', title: '列表图片', width: 150, templet: '#imgTpl1',style:'padding:0;min-width:150px;'}
        ,{field: 'image', title: '详情图片', width: 150, templet: '#imgTpl2',style:'padding:0;min-width:150px;'}
        ,{field: 'parameter1', title: '评分', width: 100}
        ,{field: 'parameter2', title: '每人消费', width: 100}
        ,{field: 'parameter3', title: '类型', width: 200}
        ,{field: 'create_time', title: '创建时间', width: 200}
        ,{title: '操作', width: 350, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
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
          title: '添加场馆'
          ,area: ['60%', '600px']
          ,id: 'LAY-popup-content-tags'
          ,success: function(layero, index){
            view(this.id).render('sport/edit','').done(function(){
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
                  url:'SportAdd',
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
        selfajax.ajax('Sportdel','post',{
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
          view(this.id).render('sport/edit', data).done(function(){
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

              selfajax.ajax('SportEdit','post',field, function(res){
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
    } else if(obj.event === 'record'){
      location.hash = '/sport/manage_record/id=' + obj.data.id
    } else if(obj.event === 'addimg'){
      location.hash = '/sport/manage_img/id=' + obj.data.id
    }else if(obj.event === 'seec'){
      location.hash = '/sport/managecomment/aid=' + obj.data.id;
    }
  });
  //体育场地预约管理
  table.render({
    elem: '#LAY-app-content-tags-record'
    ,toolbar: '#toolbarDemo'
    ,defaultToolbar: ['filter']
    ,url: layui.setter.api_host+'getSportRecordList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,height: '500'
    ,where:{
      sport_id:id,
    }
    ,cols: [[
      {field: 'name', title: '姓名', minWidth: 100}
      ,{field: 'phone', title: '电话', minWidth: 100}
      ,{field: 'during', title: '时间', minWidth: 100}
      ,{field: 'remarks', title: '备注', minWidth: 100}
      ,{field: 'create_time', title: '创建时间', width: 200}
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
  table.on('tool(LAY-app-content-tags-record)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除？', function(index){
        console.log(obj.data.id);
        selfajax.ajax('delSportRecord','post',{
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
    }
  });
  var id = router.search.aid
  //评论管理
  table.render({
    elem: '#LAY-app-content-comm'
    ,url: layui.setter.api_host+'getSportCommentList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
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
        selfajax.ajax('delSportComment','post',field, function(res){
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
          view(this.id).render('sport/tagsformcomment', data).done(function(){
            form.render(null, 'layuiadmin-form-comment');
            var edit = tinymce.render({
              elem: "#mytextarea"
              , height: 600
              , images_upload_url:'/admin/abundantUpload'
              ,font_formats: '幼圆=YouYuan;隶书=LiSu;楷体=楷体;华康新综艺体W9=华康新综艺体W9,华康新综艺体W9(P);方正楷体简体=方正清刻本悦宋简体;微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif,宋体,新宋体;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;'
            });
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              var field = data.field; //获取提交的字段
              selfajax.ajax('SporttoExamComment','post',field, function(res){
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
  //批量评论管理
  table.render({
    elem: '#LAY-app-content-comm-batch'
    ,url: layui.setter.api_host+'getTopicAllCommentList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    ,toolbar: '#toolbarDemo'
    ,defaultToolbar: ['filter']
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'id', width: 50, title: 'ID', sort: true}
      ,{field: 'title', minWidth: 100, title: '标题', sort: true}
      ,{field: 'username', title: '评论者', width: 100}
      ,{field: 'description', title: '内容', minWidth: 100}
      ,{field: 'status', title: '管理员审核状态', width: 130, templet:function(d){
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
      ,{field: 'inte_status', title: '接口审核状态', width: 130, templet:function(d){
          if(d.inte_status =='0'){
            return '审核通过';
          }else if(d.inte_status =='2'){
            return '审核不通过';
          }else{
            return '未知';
          }
        }}
      ,{title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#table-content-com'}
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
  //工具栏事件
  table.on('toolbar(LAY-app-content-comm-batch)', function(obj){
    var checkStatus = table.checkStatus('LAY-app-content-comm-batch');
    console.log(obj)
    switch(obj.event){
      case 'setAgreee':
        var ids = [];
        $.each(checkStatus.data, function () {
          ids.push(this.id);
        });
        layer.confirm('你确定审核通过', function(index){
          selfajax.ajax('/admin/setTopicAllCommentStatus','post',{
            ids:ids,
            status:0,
          }, function(res){
            if(!res.code){
              layer.msg(res.msg,{time:2000},function(){
                if(res.success){
                  layui.table.reload('LAY-app-content-comm-batch'); //重载表格
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
        break;
      case 'setRefuse':
        var data = checkStatus.data;
        var ids = [];
        $.each(checkStatus.data, function () {
          ids.push(this.id);
        });
        layer.confirm('你确定审核不通过', function(index){
          selfajax.ajax('/admin/setTopicAllCommentStatus','post',{
            ids:ids,
            status:2,
          }, function(res){
            if(!res.code){
              layer.msg(res.msg,{time:2000},function(){
                if(res.success){
                  layui.table.reload('LAY-app-content-comm-batch'); //重载表格
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
        break;
    };
  });
  //监听工具条
  table.on('tool(LAY-app-content-comm-batch)', function(obj){
    var data = obj.data;
    if(obj.event === 'toexam') {//去审核
      admin.popup({
        title:'审核'
        ,area: ['60%', '600px']
        ,id: 'LAY-popup-content-tags'
        ,success: function(layero, index){
          console.log(this.id);
          console.log(data);
          view(this.id).render('topic/tagsformcomment', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            var edit = tinymce.render({
              elem: "#mytextarea"
              , height: 300
              , images_upload_url:'/admin/abundantUpload'
              ,font_formats: '幼圆=YouYuan;隶书=LiSu;楷体=楷体;华康新综艺体W9=华康新综艺体W9,华康新综艺体W9(P);方正楷体简体=方正清刻本悦宋简体;微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif,宋体,新宋体;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;'
            });
            var string = data.content;

            if(typeof(string)!='undefined'&&string!=''){
              var stringResult = string.split(',');
              for(var i=0;i<stringResult.length;i++){
                $('#test-upload-more-list').append(
                    '<div id="" class="file-iteme">' +

                    '<div class="handle"><i class="layui-icon layui-icon-delete"></i></div>' +

                    '<img style="width: 100px;height: 100px;" src='+ stringResult[i] +'>' +

                    '<div class="info">image</div>' +

                    '</div>'
                )
              }
            }

            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              var field = data.field; //获取提交的字段
              selfajax.ajax('/admin/TopictoExamComment','post',field, function(res){
                if(!res.code){
                  layer.msg(res.msg,{time:2000},function(){
                    if(res.success){
                      layui.table.reload('LAY-app-content-comm-batch'); //重载表格
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
    }else if(obj.event === 'del'){
      layer.confirm('确定删除此条评论？', function(index){
        var field={'id':obj.data.id}
        selfajax.ajax('/admin/delTopicComment','post',field, function(res){
          if(!res.code){
            layer.msg(res.msg,{time:2000},function(){
              if(res.success){
                layui.table.reload('LAY-app-content-comm-batch'); //重载表格
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
    }
  });
  //体育场地图片管理
  table.render({
    elem: '#LAY-app-content-tags-img'
    ,toolbar: '#toolbarDemo'
    ,defaultToolbar: ['filter']
    ,url: layui.setter.api_host+'getSportImgList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,height: '500'
    ,where:{
      sport_id:id,
    }
    ,cols: [[
      {field: 'id', title: 'ID', width: 100}
      ,{field: 'image', title: '图片', minWidth: 150, templet: '#imgTpl2',style:'padding:0;min-width:150px;'}
      ,{field: 'create_time', title: '创建时间', width: 200}
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
  //管理头工具栏事件
  table.on('toolbar(LAY-app-content-tags-img)', function(obj){
    var checkStatus = table.checkStatus(obj.config.id);
    switch(obj.event){
      case 'add':
        admin.popup({
          title: '添加'
          ,area: ['60%', '500px']
          ,id: 'LAY-popup-content-tags'
          ,success: function(layero, index){
            view(this.id).render('sport/edit_img','').done(function(){
              form.render(null, 'layuiadmin-form-tags');
              //监听提交
              form.on('submit(layuiadmin-app-tags-submit)', function(data){
                var field = data.field; //获取提交的字段
                data.field.sport_id = id;
                // data.field.content = edit.getContent();
                //提交 Ajax 成功后，关闭当前弹层并重载表格
                view.request({
                  url:'SportAddImg',
                  type:'post',
                  data:field,
                  tips: true,
                  auth:true,
                  success:function(res){
                    if(!res.code){
                      if(res.success){
                        layui.table.reload('LAY-app-content-tags-img'); //重载表格
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
  table.on('tool(LAY-app-content-tags-img)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除？', function(index){
        console.log(obj.data.id);
        selfajax.ajax('SportdelImg','post',{
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
        ,area: ['60%', '500px']
        ,id: 'layuiadmin-app-form-tags'
        ,success: function(layero, index){
          view(this.id).render('sport/edit_img', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              // data.field.content = edit.getContent();
              var field = data.field; //获取提交的字段
              data.field.sport_id = id;
              selfajax.ajax('SportEditImg','post',field, function(res){
                if(!res.code){
                  layer.msg(res.msg,{time:2000},function(){
                    if(res.success){
                      layui.table.reload('LAY-app-content-tags-img'); //重载表格
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
    } else if(obj.event === 'record'){
      location.hash = '/sport/manage_record/id=' + obj.data.id
    } else if(obj.event === 'addimg'){
      location.hash = '/sport/manage_img/id=' + obj.data.id
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

  exports('sport', {})
});
