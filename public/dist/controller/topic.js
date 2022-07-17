/**
 @Name：layuiAdmin 内容系统
 @Author：star1029
 @Site：http://www.layui.com/admin/
 @License：LPPL
 */
layui.define(['table', 'form','selfajax','tinymce'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,tinymce = layui.tinymce
  ,setter = layui.setter
  ,selfajax  = layui.selfajax
  ,router = layui.router()
  ,table = layui.table
  ,form = layui.form;
  //话题管理
  table.render({
    elem: '#LAY-app-content-tags'
    ,url: layui.setter.api_host+'getTopicList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,cols: [[
      {
        templet: "#checkbd",
        title: "<input type='checkbox' name='siam_all' title='' lay-skin='primary' lay-filter='siam_all'> ",
        width: 60,
      }
      ,{field: 'description', title: '内容', width: 300, event: 'read',templet:'<div><span title="{{d.description}}">{{d.description}}</span></div>'}
      ,{field: 'author', title: '内容创作者', width: 100, templet:function(d){
          if(d.is_system ==1){
            return '管理员';
          }else{
            return d.author;
          }
        }}
      // ,{field: 'top', title: '热门知识', templet: '#buttonTpl1', width: 100, align: 'center', event: 'setPop', style:'cursor: pointer;'}
      // ,{field: 'top', title: '置顶', templet: '#buttonTpl', width: 100, align: 'center', event: 'setTop', style:'cursor: pointer;'}
      ,{field: 'status', title: '审核状态', align: 'center',event: 'seeStatus',style:'cursor: pointer;',width: 100, templet:function(d){
          if(d.status =='0'){
            return '通过';
          }else if(d.status =='2'){
            return '不通过';
          }else if(d.status =='1'){
            return '审核中';
          }else{
            return '审核中';
          }
        }}
      ,{field: 'is_release', title: '上下架', align: 'center',width: 100, templet:function(d){
          if(d.is_release =='0'){
            return '下架';
          }else if(d.is_release =='1'){
            return '上架';
          }else{
            return '未知';
          }
        }}
      ,{field: 'release_time', title: '发布时间', minWidth: 200, templet:function(d){
          if(d.is_release =='0'){
            return '未发布';
          }else if(d.is_release =='1'){
            return d.release_time;
          }else{
            return '未知';
          }
        }}
      ,{title: '操作', width: 200, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
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
        var field={'id':obj.data.id}
        selfajax.ajax('/admin/Topicdel','post',field, function(res){
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
        title: '编辑'
        ,area: ['60%', '600px']
        ,id: 'LAY-popup-content-tags'
        ,success: function(layero, index){
          console.log(this.id);
          console.log(data);
          view(this.id).render('topic/tagsform', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            var edit = tinymce.render({
              elem: "#mytextarea"
              , height: 600
              , images_upload_url:'/admin/abundantUpload'
              ,font_formats: '幼圆=YouYuan;隶书=LiSu;楷体=楷体;华康新综艺体W9=华康新综艺体W9,华康新综艺体W9(P);方正楷体简体=方正清刻本悦宋简体;微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif,宋体,新宋体;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;'
            });
            var string = data.content;

            if(typeof(string)!='undefined'&&string!=''){
              var stringResult = string.split('&');
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
              data.field.richcontent = edit.getContent();
              var field = data.field; //获取提交的字段
              selfajax.ajax('/admin/Topicedit','post',field, function(res){
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
    } else if(obj.event === 'seec'){
      layui.data.d=obj.data;
      location.hash = '/topic/managecomment/aid=' + obj.data.id;
    }else if(obj.event === 'setTop'){
        console.log(obj.data.id);
        var field = data.field; //获取提交的字段
        selfajax.ajax('/admin/setToptop','post',{'id':obj.data.id}, function(res){
          if(!res.code){
            layer.msg(res.msg,{time:2000},function(){
              if(res.success){
                layui.table.reload('LAY-app-content-tags'); //重载表格
                layer.close(); //执行关闭
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
    }else if(obj.event === 'setPop'){
      console.log(obj.data.id);
      var field = data.field; //获取提交的字段
      selfajax.ajax('/admin/setPoptop','post',{'id':obj.data.id}, function(res){
        if(!res.code){
          layer.msg(res.msg,{time:2000},function(){
            if(res.success){
              layui.table.reload('LAY-app-content-tags'); //重载表格
              layer.close(); //执行关闭
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
    }else if(obj.event === 'read'){//分配
      layer.open({
        type: 1,
        area: ['600px', '360px'],
        content: obj.data.description //这里content是一个普通的String
      });
    }else if(obj.event === 'seeStatus'){//查看原因
      // console.log(obj.data)
      if(obj.data.status==2){
        layer.open({
          type: 1,
          area: ['600px', '360px'],
          shadeClose: true, //点击遮罩关闭
          content: obj.data.reason||''
        });
      }
    }
  });
  var id = router.search.aid
  //评论管理
  table.render({
    elem: '#LAY-app-content-comm'
    ,url: layui.setter.api_host+'getTopicCommentList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
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
      ,{field: 'title', minWidth: 100, title: '标题'}
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
        selfajax.ajax('delTopicComment','post',field, function(res){
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
          view(this.id).render('topic/tagsformcomment', data).done(function(){
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
              selfajax.ajax('/admin/TopictoExamComment','post',field, function(res){
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
  //待审核内容管理
  table.render({
    elem: '#LAY-app-content-tags-check'
    ,url: layui.setter.api_host+'getTopicTestList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    ,toolbar: '#toolbarDemo'
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'id', width: 60, title: 'ID', sort: true}
      ,{field: 'description', title: '标题', width: 300,templet:'<div><span title="{{d.description}}">{{d.description}}</span></div>'}
      ,{field: 'releaser', title: '发布人', width: 100}
      ,{field: 'status', title: '管理员审核状态', align: 'center', width: 150, templet:function(d){
          if(d.status =='0'){
            return '通过';
          }else if(d.status =='2'){
            return '不通过';
          }else if(d.status =='1'){
            return '审核中';
          }else{
            return '审核中';
          }
        }}
      ,{field: 'is_release', title: '上下架', align: 'center',width: 100, templet:function(d){
          if(d.is_release =='0'){
            return '未上架';
          }else if(d.is_release =='1'){
            return '已上架';
          }else{
            return '未知';
          }
        }}
      ,{field: 'create_time', title: '创建时间', width: 200}
      ,{title: '操作', width: 200, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
    ]],
    parseData: function (res) {
      return {
        "code": res.code, //解析接口状态
        "msg": res.msg, //解析提示文本
        "count": res.data.count, //解析数据长度
        "data": res.data.data //解析数据列表
      }
    }, done: function (res, curr, curr) {
      $('td[data-field="image"] .layui-table-cell, .layui-table-tool-panel li').each(function () {
        $(this).css('overflow', 'none !important');
      })
    }
  });
  //监听工具条
  table.on('tool(LAY-app-content-tags-check)', function(obj){
    var data = obj.data;
    if(obj.event === 'toexam') {//去审核
      admin.popup({
        title:'审核'
        ,area: ['60%', '600px']
        ,id: 'LAY-popup-content-tags'
        ,success: function(layero, index){
          console.log(this.id);
          console.log(data);
          view(this.id).render('topic/tagsformcheck', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            var edit = tinymce.render({
              elem: "#mytextarea"
              , height: 600
              , images_upload_url:'/admin/abundantUpload'
              ,font_formats: '幼圆=YouYuan;隶书=LiSu;楷体=楷体;华康新综艺体W9=华康新综艺体W9,华康新综艺体W9(P);方正楷体简体=方正清刻本悦宋简体;微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif,宋体,新宋体;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;'
            });
            var string = JSON.parse(data.content);

            if(typeof(string)!='undefined'&&string!=''){
              var stringResult = string.split(',');
              for(var i=0;i<stringResult.length;i++){
                $('#test-upload-more-list').append(
                    '<div id="" class="file-iteme" data-id="'+i+'" layer-src="'+ stringResult[i] +'">' +

                    '<div class="handle"><i class="layui-icon layui-icon-delete"></i></div>' +

                    '<img style="width: 100px;height: 100px;"  src='+ stringResult[i] +'>'

                     +'<div class="info">image</div>' +

                    '</div>'
                )
              }
            }
            layer.ready(function () {
              layer.photos({
                photos: '#test-upload-more-list'
                ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                ,tab: function(pic, layero){
                  // console.log(pic) //当前图片的一些信息
                }
              });
            });
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              var field = data.field; //获取提交的字段
              field.status=0
              selfajax.ajax('toexamtop','post',field, function(res){
                if(!res.code){
                  layer.msg(res.msg,{time:2000},function(){
                    if(res.success){
                      layui.table.reload('LAY-app-content-tags-check'); //重载表格
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
            form.on('submit(layuiadmin-app-tags-submit1)', function(data){
              var field = data.field; //获取提交的字段
              field.status=2
              selfajax.ajax('/admin/toexamtop','post',field, function(res){
                if(!res.code){
                  layer.msg(res.msg,{time:2000},function(){
                    if(res.success){
                      layui.table.reload('LAY-app-content-tags-check'); //重载表格
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
  //工具栏事件
  table.on('toolbar(LAY-app-content-tags-check)', function(obj){
    var checkStatus = table.checkStatus('LAY-app-content-tags-check');
    console.log(obj)
    switch(obj.event){
      case 'setAgreee':
        var ids = [];
        $.each(checkStatus.data, function () {
          ids.push(this.id);
        });
        layer.confirm('你确定审核通过', function(index){
          selfajax.ajax('totoexamBatch','post',{
            ids:ids,
            status:0,
          }, function(res){
            if(!res.code){
              layer.msg(res.msg,{time:2000},function(){
                if(res.success){
                  layui.table.reload('LAY-app-content-tags-check'); //重载表格
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
          selfajax.ajax('/admin/totoexamBatch','post',{
            ids:ids,
            status:2,
          }, function(res){
            if(!res.code){
              layer.msg(res.msg,{time:2000},function(){
                if(res.success){
                  layui.table.reload('LAY-app-content-tags-check'); //重载表格
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
  //首页热门图片管理
  table.render({
    elem: '#LAY-app-content-tags-pic'
    ,url: layui.setter.www_NAME+'/admin/getTopicPic?id=2' //模拟接口
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,cols: [[
      {field: 'title', title: '标题', minWidth: 30, event: 'read'}
      ,{field: 'logo', title: 'logo', minWidth: 100, templet: '#imgTpl',style:'padding:0;'}
      ,{title: '操作', width: 200, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
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
  table.on('tool(LAY-app-content-tags-pic)', function(obj){
    var data = obj.data;
    if(obj.event === 'edit'){
      admin.popup({
        title: '编辑'
        ,area: ['60%', '600px']
        ,id: 'LAY-popup-content-tags'
        ,success: function(layero, index){
          console.log(this.id);
          console.log(data);
          view(this.id).render('topic/edit', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              var field = data.field; //获取提交的字段
              selfajax.ajax('/admin/TopiceditPic','post',field, function(res){
                if(!res.code){
                  layer.msg(res.msg,{time:2000},function(){
                    if(res.success){
                      layui.table.reload('LAY-app-content-tags-pic'); //重载表格
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
    } else if(obj.event === 'seec'){
      layui.data.d=obj.data;
      location.hash = '/topic/managecomment/aid=' + obj.data.id;
    }else if(obj.event === 'setTop'){
      console.log(obj.data.id);
      var field = data.field; //获取提交的字段
      selfajax.ajax('/admin/setToptop','post',{'id':obj.data.id}, function(res){
        if(!res.code){
          layer.msg(res.msg,{time:2000},function(){
            if(res.success){
              layui.table.reload('LAY-app-content-tags'); //重载表格
              layer.close(); //执行关闭
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
    }else if(obj.event === 'setPop'){
      console.log(obj.data.id);
      var field = data.field; //获取提交的字段
      selfajax.ajax('/admin/setPoptop','post',{'id':obj.data.id}, function(res){
        if(!res.code){
          layer.msg(res.msg,{time:2000},function(){
            if(res.success){
              layui.table.reload('LAY-app-content-tags'); //重载表格
              layer.close(); //执行关闭
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
    }else if(obj.event === 'read'){//分配
      layer.open({
        type: 1,
        area: ['600px', '360px'],
        content: obj.data.description //这里content是一个普通的String
      });
    }else if(obj.event === 'seeStatus'){//查看原因
      // console.log(obj.data)
      if(obj.data.status==2){
        layer.open({
          type: 1,
          area: ['600px', '360px'],
          shadeClose: true, //点击遮罩关闭
          content: obj.data.reason||''
        });
      }
    }
  });
  //管理员logo图片管理
  table.render({
    elem: '#LAY-app-content-tags-pic-admin'
    ,url: layui.setter.www_NAME+'/admin/getTopicPic?id=3' //模拟接口
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,cols: [[
      {field: 'title', title: '标题', minWidth: 30, event: 'read'}
      ,{field: 'logo', title: 'logo', minWidth: 100, templet: '#imgTpl',style:'padding:0;'}
      ,{title: '操作', width: 200, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
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
  table.on('tool(LAY-app-content-tags-pic-admin)', function(obj){
    var data = obj.data;
    if(obj.event === 'edit'){
      admin.popup({
        title: '编辑'
        ,area: ['60%', '600px']
        ,id: 'LAY-popup-content-tags'
        ,success: function(layero, index){
          console.log(this.id);
          console.log(data);
          view(this.id).render('topic/editadmin', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              var field = data.field; //获取提交的字段
              selfajax.ajax('/admin/TopiceditPic','post',field, function(res){
                if(!res.code){
                  layer.msg(res.msg,{time:2000},function(){
                    if(res.success){
                      layui.table.reload('LAY-app-content-tags-pic-admin'); //重载表格
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
    } else if(obj.event === 'seec'){
      layui.data.d=obj.data;
      location.hash = '/topic/managecomment/aid=' + obj.data.id;
    }else if(obj.event === 'setTop'){
      console.log(obj.data.id);
      var field = data.field; //获取提交的字段
      selfajax.ajax('/admin/setToptop','post',{'id':obj.data.id}, function(res){
        if(!res.code){
          layer.msg(res.msg,{time:2000},function(){
            if(res.success){
              layui.table.reload('LAY-app-content-tags'); //重载表格
              layer.close(); //执行关闭
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
    }else if(obj.event === 'setPop'){
      console.log(obj.data.id);
      var field = data.field; //获取提交的字段
      selfajax.ajax('/admin/setPoptop','post',{'id':obj.data.id}, function(res){
        if(!res.code){
          layer.msg(res.msg,{time:2000},function(){
            if(res.success){
              layui.table.reload('LAY-app-content-tags'); //重载表格
              layer.close(); //执行关闭
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
    }else if(obj.event === 'read'){//分配
      layer.open({
        type: 1,
        area: ['600px', '360px'],
        content: obj.data.description //这里content是一个普通的String
      });
    }else if(obj.event === 'seeStatus'){//查看原因
      // console.log(obj.data)
      if(obj.data.status==2){
        layer.open({
          type: 1,
          area: ['600px', '360px'],
          shadeClose: true, //点击遮罩关闭
          content: obj.data.reason||''
        });
      }
    }
  });

  exports('topic', {})
});
