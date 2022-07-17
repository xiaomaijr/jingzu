/** layuiAdmin.std-v1.0.0 LPPL License By http://www.layui.com/admin/ */
 ;/**
 @Name：layuiAdmin 内容系统
 @Author：star1029
 @Site：http://www.layui.com/admin/
 @License：LPPL
 */
layui.define(['table', 'form','selfajax','tinymce', 'laydate','upload','layedit'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,setter = layui.setter
  ,laydate = layui.laydate
  ,tinymce = layui.tinymce
  ,layedit = layui.layedit
  ,selfajax  = layui.selfajax
  ,router = layui.router()
  ,search = router.search
  ,upload = layui.upload
  ,form = layui.form;

  layedit.set({
      uploadImage: {  //上传图片的设置
         url:  layui.setter.api_host+'layeditUpload'//接口url
          ,type: 'post' //默认post
       }
   });

  var activity_id = router.search.id;
  var type = router.search.type;

  //活动管理
  table.render({
    elem: '#LAY-app-content-tags'
    ,toolbar: '#toolbarDemo'
    ,defaultToolbar: ['filter']
    ,url: layui.setter.api_host+'getActivityList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,height: '500'
    ,where:{type:type}
    ,cols: [[
      {field: 'title', title: '名称', minWidth: 100}
      ,{field: 'type', title: '类型', minWidth: 100,templet:function (d) {
          if(d.type==1){
            return '精彩活动';
          }else if(d.type==2){
            return '线上赛事';
          }else if(d.type==3){
            return '培训课程';
          }
        }}
      ,{field: 'image', title: '图片', width: 200, templet: '#imgTpl',style:'padding:0;min-width:150px;'}
      ,{field: 'is_signup', title: '是否报名', minWidth: 100,templet:function (d) {
          if(d.is_signup==1){
            return '是';
          }else{
            return '否';
          }
        }}
      ,{field: 'top', title: '精彩推荐', templet: '#buttonTpl1', width: 100, align: 'center', event: 'setPop', style:'cursor: pointer;'}
      ,{field: 'signup_num', title: '报名数量', minWidth: 100}
      ,{field: 'signup_time', title: '报名时间', width: 300}
      ,{field: 'activity_time', title: '活动时间', width: 300}
      ,{field: 'create_time', title: '创建时间', width: 200}
      ,{title: '操作', width: 400, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
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
    field.type= type;
    //执行重载
    table.reload('LAY-app-content-tags', {
      where: field
      ,url: layui.setter.api_host+'getActivityList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
      ,page: true
      , loading: true                      // 开启loading
      , cellMinWidth: 80                   // 每列最小宽度
      , limits: [15, 30, 50]                 // 每页条数的选择项
      , limit: 10                          // 默认每页条数
      ,cols: [[
        {field: 'title', title: '名称', minWidth: 100}
        ,{field: 'type', title: '类型', minWidth: 100,templet:function (d) {
            if(d.type==1){
              return '精彩活动';
            }else if(d.type==2){
              return '线上赛事';
            }else if(d.type==3){
              return '培训课程';
            }
          }}
        ,{field: 'image', title: '图片', width: 200, templet: '#imgTpl',style:'padding:0;min-width:150px;'}
        ,{field: 'is_signup', title: '是否报名', minWidth: 100,templet:function (d) {
            if(d.is_signup==1){
              return '是';
            }else{
              return '否';
            }
          }}
        ,{field: 'top', title: '精彩推荐', templet: '#buttonTpl1', width: 100, align: 'center', event: 'setPop', style:'cursor: pointer;'}
        ,{field: 'signup_num', title: '报名数量', minWidth: 100}
        ,{field: 'signup_time', title: '报名时间', width: 300}
        ,{field: 'activity_time', title: '活动时间', width: 300}
        ,{field: 'create_time', title: '创建时间', width: 200}
        ,{title: '操作', width: 400, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
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
          title: '添加活动'
          ,area: ['60%', '600px']
          ,id: 'LAY-popup-content-tags'
          ,success: function(layero, index){
            if(type==3){
              view(this.id).render('activity/edit2','').done(function(){
                form.render(null, 'layuiadmin-form-tags');
                //日期时间范围
                laydate.render({
                  elem: '#signup_time'
                  ,type: 'datetime'
                  ,range: true
                });
                //日期时间范围
                laydate.render({
                  elem: '#activity_time'
                  ,type: 'datetime'
                  ,range: true
                });
                var index1 = layedit.build('mytextarea', {
                  tool: ['strong', 'italic', 'underline', 'del', '|', 'left', 'center', 'right','|','link','unlink','image'],
                  height: 200
                });
                // var edit = tinymce.render({
                //   elem: "#mytextarea"
                //   , height: 600
                //   , images_upload_url:'/admin/abundantUpload'
                // });
                // 视频上传
                var fileForm = document.getElementById("test6");
                var stopBtn = document.getElementById('stop');
                var upload;
                var isupload=true
                console.log(fileForm);
                fileForm.onchange = function(){
                  upload = new Upload(0);
                  upload.addFileAndSend(this);
                }
                // stopBtn.onclick = function(){
                //   this.value = "停止中";
                //   upload.stop();
                //   this.value = "已停止";
                // }
                function Upload(start){
                  var xhr = new XMLHttpRequest();
                  const LENGTH = 1024 * 1024;
                  var end = start + LENGTH;
                  var blob;
                  var is_stop = 0
                  var blob_num = 1;
                  //对外方法，传入文件对象
                  this.addFileAndSend = function(that){

                    if(blob_num != 1){
                      blob_num=1;
                    }
                    console.log(that.files[0].type)
                    // if(that.files[0].type!='application/pdf'){
                    if(that.files[0].type!='video/mp4'){
                      layer.msg('请上传视频');
                      return false;
                    }
                    // document.getElementById('test5').classList.add("disnone")
                    var file = that.files[0];
                    blob = cutFile(file);
                    sendFile(blob,file);
                    blob_num += 1;
                  }

                  //停止文件上传
                  this.stop = function(){
                    xhr.abort();
                    is_stop = 1;
                  }
                  //切割文件
                  function cutFile(file){
                    var file_blob = file.slice(start,end);
                    start = end;
                    end = start + LENGTH;
                    return file_blob;
                  };
                  //发送文件
                  function sendFile(blob,file){
                    var form_data = new FormData();
                    var total_blob_num = Math.ceil(file.size / LENGTH); console.log('total_blob_num'+total_blob_num)
                    form_data.append('file',blob);
                    form_data.append('blob_num',blob_num);
                    form_data.append('total_blob_num',total_blob_num);
                    form_data.append('file_name',file.name);

                    xhr.open('POST','/admin/uploadBigVideo',false);
                    var t;
                    xhr.onreadystatechange = function (e) {
                      if (xhr.readyState == 4 && xhr.status == 200) {
                        var rest=JSON.parse(xhr.response);
                        var progress;
                        var progressObj = document.getElementById('finish1');
                        console.log(rest.code)
                        console.log(rest.new_file_name)
                        if(rest.code==2){
                          $("#test6").val('');
                          progress = '0%';
                          progressObj.style.width = progress;
                          clearTimeout(t);
                          // let html = edit.getContent();
                          let html = layedit.getContent(index1);
                          html +='<p><span class="mce-preview-object mce-object-video" contenteditable="false" data-mce-object="video" data-mce-p-controls="controls" data-mce-html="<source src='+rest.new_file_name+'/>"><video src="'+rest.new_file_name+'" controls="controls" width="100%" height="auto" frameborder="0"></video><span class="mce-shim"></span></span>﻿</p>'
                          // edit.setContent(html);
                          layedit.setContent(index1, html);
                          start =0;
                          // document.getElementById("pdf").value=rest.new_file_name;
                          // document.getElementById("ori_pdf").value=rest.fileName;
                          // document.getElementById("urlurl").innerHTML=rest.fileName;
                        }
                      }
                      if(total_blob_num == 1){
                        progress = '100%';
                      }else{
                        progress = Math.min(100,(blob_num/total_blob_num)* 100 ) +'%';
                      }
                      progressObj.style.width = progress;
                      t = setTimeout(function(){
                        console.log('start'+start)
                        console.log(file.size)
                        console.log(is_stop)
                        if(start < file.size && is_stop === 0){ console.log('jll')
                          blob = cutFile(file);
                          sendFile(blob,file);
                          blob_num += 1;
                        }else{
                          setTimeout(t);
                        }
                      },1000);
                    }
                    xhr.send(form_data);
                  }
                }
                // 视频上传
                //类型
                let brand=[{id:1,name:'精彩活动'},{id:2,name:'赛事推荐'},{id:3,name:'培训项目'}];
                $("#type").html('<option value="0">请选择类型</option>');
                $.each(brand, function (key, val) {
                  var option1 = $("<option>").val(val.id).text(val.name);
                  //通过LayUI.jQuery添加列表项
                  $("#type").append(option1);
                });
                layui.form.render('select');
                form.on('switch(is_signup)', function(data){
                  // console.log(data.elem); //得到checkbox原始DOM对象
                  console.log(data.elem.checked); //开关是否开启，true或者false
                  // console.log(data.value); //开关value值，也可以通过data.elem.value得到
                  // console.log(data.othis); //得到美化后的DOM对象
                  if(data.elem.checked){
                    $('#uploadvideo').hide();
                  }else{
                    $('#uploadvideo').show();
                  }
                });
                //监听提交
                form.on('submit(layuiadmin-app-tags-submit)', function(data){
                  var field = data.field; //获取提交的字段
                  // data.field.content = edit.getContent();
                  data.field.content = layedit.getContent(index1);
                  //提交 Ajax 成功后，关闭当前弹层并重载表格
                  view.request({
                    url:'ActivityAdd',
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
            }else{
              view(this.id).render('activity/edit','').done(function(){
                form.render(null, 'layuiadmin-form-tags');
                //日期时间范围
                laydate.render({
                  elem: '#signup_time'
                  ,type: 'datetime'
                  ,range: true
                });
                //日期时间范围
                laydate.render({
                  elem: '#activity_time'
                  ,type: 'datetime'
                  ,range: true
                });
                var edit = tinymce.render({
                  elem: "#mytextarea"
                  , height: 600
                  ,menubar: false //隐藏菜单栏
                  , images_upload_url:'/admin/abundantUpload'
                });
                //类型
                let brand=[{id:1,name:'精彩活动'},{id:2,name:'赛事推荐'},{id:3,name:'培训项目'}];
                $("#type").html('<option value="0">请选择类型</option>');
                $.each(brand, function (key, val) {
                  var option1 = $("<option>").val(val.id).text(val.name);
                  //通过LayUI.jQuery添加列表项
                  $("#type").append(option1);
                });
                layui.form.render('select');
                //监听提交
                form.on('submit(layuiadmin-app-tags-submit)', function(data){
                  var field = data.field; //获取提交的字段
                  data.field.content = edit.getContent();
                  //提交 Ajax 成功后，关闭当前弹层并重载表格
                  view.request({
                    url:'ActivityAdd',
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
        selfajax.ajax('Activitydel','post',{
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
    } else if(obj.event === 'edit'&& type!=3){
      admin.popup({
        title: '编辑'
        ,area: ['60%', '600px']
        ,id: 'layuiadmin-app-form-tags'
        ,success: function(layero, index){
          view(this.id).render('activity/edit', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            //日期时间范围
            laydate.render({
              elem: '#signup_time'
              ,type: 'datetime'
              ,range: true
            });
            //日期时间范围
            laydate.render({
              elem: '#activity_time'
              ,type: 'datetime'
              ,range: true
            });
            var edit = tinymce.render({
              elem: "#mytextarea"
              , height: 600
              // ,toolbar: false //隐藏工具栏
              ,menubar: false //隐藏菜单栏
              , images_upload_url:'/admin/abundantUpload'
            });
            //类型
            let brand=[{id:1,name:'精彩活动'},{id:2,name:'线上赛事'},{id:3,name:'培训课程'}];
            $("#type").html('<option value="0">请选择类型</option>');
            $.each(brand, function (key, val) {
              if(val.id==data.type){
                var option1 = $("<option selected>").val(val.id).text(val.name);
              }else{
                var option1 = $("<option>").val(val.id).text(val.name);
              }

              //通过LayUI.jQuery添加列表项
              $("#type").append(option1);
            });
            layui.form.render('select');
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              if(data.field.id!=3&&data.field.id!=4){
                data.field.content = edit.getContent();
              }
              var field = data.field; //获取提交的字段

              selfajax.ajax('ActivityEdit','post',field, function(res){
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
    }else if(obj.event === 'edit'&& type==3){
      admin.popup({
        title: '编辑'
        ,area: ['60%', '600px']
        ,id: 'layuiadmin-app-form-tags'
        ,success: function(layero, index){
          view(this.id).render('activity/edit2', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            //日期时间范围
            laydate.render({
              elem: '#signup_time'
              ,type: 'datetime'
              ,range: true
            });
            //日期时间范围
            laydate.render({
              elem: '#activity_time'
              ,type: 'datetime'
              ,range: true
            });
            var index1 = layedit.build('mytextarea', {
              tool: ['strong', 'italic', 'underline', 'del', '|', 'left', 'center', 'right','|','link','unlink','image'],
              height: 200
            });
            // let url = '/upload/pdf/2022-03-24/4d5a1427a11cb9ea01dd9ab30c67c413.mp4';
            // var edit = tinymce.render({
            //   elem: "#mytextarea"
            //   , height: 600
            //   , images_upload_url:'/admin/abundantUpload'
            // },(opt,edit)=>{
            //   // edit.setContent('<p><span class="mce-preview-object mce-object-video" contenteditable="false" data-mce-object="video" data-mce-p-controls="controls" data-mce-html="<source src='+url+'/>"><video src="/upload/pdf/2022-03-24/4d5a1427a11cb9ea01dd9ab30c67c413.mp4" controls="controls" width="100%" height="auto" frameborder="0"></video><span class="mce-shim"></span></span>﻿</p>');
            // });
            // let hh= '<p><span class="mce-preview-object mce-object-video" contenteditable="false" data-mce-object="video" data-mce-p-controls="controls" data-mce-html="<source src='+url+'/>"><video src="'+url+'" controls="controls" width="100%" height="auto" frameborder="0"></video><span class="mce-shim"></span></span>﻿</p>';

            // 视频上传
            var fileForm = document.getElementById("test6");
            var stopBtn = document.getElementById('stop');
            var upload;
            var isupload=true
            console.log(fileForm);
            fileForm.onchange = function(){
              upload = new Upload(0);
              upload.addFileAndSend(this);
            }
            // stopBtn.onclick = function(){
            //   this.value = "停止中";
            //   upload.stop();
            //   this.value = "已停止";
            // }
            function Upload(start){
              var xhr = new XMLHttpRequest();
              const LENGTH = 1024 * 1024;
              var end = start + LENGTH;
              var blob;
              var is_stop = 0
              var blob_num = 1;
              //对外方法，传入文件对象
              this.addFileAndSend = function(that){

                if(blob_num != 1){
                  blob_num=1;
                }
                console.log(that.files[0].type)
                // if(that.files[0].type!='application/pdf'){
                if(that.files[0].type!='video/mp4'){
                  layer.msg('请上传视频');
                  return false;
                }
                // document.getElementById('test5').classList.add("disnone")
                var file = that.files[0];
                blob = cutFile(file);
                sendFile(blob,file);
                blob_num += 1;
              }

              //停止文件上传
              this.stop = function(){
                xhr.abort();
                is_stop = 1;
              }
              //切割文件
              function cutFile(file){
                var file_blob = file.slice(start,end);
                start = end;
                end = start + LENGTH;
                return file_blob;
              };
              //发送文件
              function sendFile(blob,file){
                var form_data = new FormData();
                var total_blob_num = Math.ceil(file.size / LENGTH); console.log('total_blob_num'+total_blob_num)
                form_data.append('file',blob);
                form_data.append('blob_num',blob_num);
                form_data.append('total_blob_num',total_blob_num);
                form_data.append('file_name',file.name);

                xhr.open('POST','/admin/uploadBigVideo',false);
                var t;
                xhr.onreadystatechange = function (e) {
                  if (xhr.readyState == 4 && xhr.status == 200) {
                    var rest=JSON.parse(xhr.response);
                    var progress;
                    var progressObj = document.getElementById('finish1');
                    console.log(rest.code)
                    console.log(rest.new_file_name)
                    if(rest.code==2){
                      $("#test6").val('');
                      progress = '0%';
                      progressObj.style.width = progress;
                      clearTimeout(t);
                      // let html = edit.getContent();
                      let html = layedit.getContent(index1);
                      html +='<p><span class="mce-preview-object mce-object-video" contenteditable="false" data-mce-object="video" data-mce-p-controls="controls" data-mce-html="<source src='+rest.new_file_name+'/>"><video src="'+rest.new_file_name+'" controls="controls" width="100%" height="auto" frameborder="0"></video><span class="mce-shim"></span></span>﻿</p>'
                      // edit.setContent(html);
                      layedit.setContent(index1, html);
                      start =0;
                      // document.getElementById("pdf").value=rest.new_file_name;
                      // document.getElementById("ori_pdf").value=rest.fileName;
                      // document.getElementById("urlurl").innerHTML=rest.fileName;
                    }
                  }
                  if(total_blob_num == 1){
                    progress = '100%';
                  }else{
                    progress = Math.min(100,(blob_num/total_blob_num)* 100 ) +'%';
                  }
                  progressObj.style.width = progress;
                  t = setTimeout(function(){
                    console.log('start'+start)
                    console.log(file.size)
                    console.log(is_stop)
                    if(start < file.size && is_stop === 0){ console.log('jll')
                      blob = cutFile(file);
                      sendFile(blob,file);
                      blob_num += 1;
                    }else{
                      setTimeout(t);
                    }
                  },1000);
                }
                xhr.send(form_data);
              }
            }
            // 视频上传
            //类型
            let brand=[{id:1,name:'精彩活动'},{id:2,name:'线上赛事'},{id:3,name:'培训课程'}];
            $("#type").html('<option value="0">请选择类型</option>');
            $.each(brand, function (key, val) {
              if(val.id==data.type){
                var option1 = $("<option selected>").val(val.id).text(val.name);
              }else{
                var option1 = $("<option>").val(val.id).text(val.name);
              }

              //通过LayUI.jQuery添加列表项
              $("#type").append(option1);
            });
            layui.form.render('select');
            if(data.is_signup=="1"){
              $('#uploadvideo').hide();
            }else{
              $('#uploadvideo').show();
            }
            form.on('switch(is_signup)', function(data){
              // console.log(data.elem); //得到checkbox原始DOM对象
              console.log(data.elem.checked); //开关是否开启，true或者false
              // console.log(data.value); //开关value值，也可以通过data.elem.value得到
              // console.log(data.othis); //得到美化后的DOM对象
              if(data.elem.checked){
                $('#uploadvideo').hide();
              }else{
                $('#uploadvideo').show();
              }
            });
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              if(data.field.id!=3&&data.field.id!=4){
                // data.field.content = edit.getContent();
              }
              data.field.content = layedit.getContent(index1);

              var field = data.field; //获取提交的字段

              selfajax.ajax('ActivityEdit','post',field, function(res){
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
      location.hash = '/activity/manage_record/id=' + obj.data.id
    } else if(obj.event === 'setPop'){
      console.log(obj.data.id);
      var field = data.field; //获取提交的字段
      selfajax.ajax('activitySetBest','post',{'id':obj.data.id,'is_pop':obj.data.is_pop}, function(res){
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
    }else if(obj.event === 'seec'){
      location.hash = '/activity/managecomment/aid=' + obj.data.id;
    }else if(obj.event === 'data'){
      location.hash = '/activity/manage_data/aid=' + obj.data.id;
    }
  });
  var id = router.search.aid
  //评论管理
  table.render({
    elem: '#LAY-app-content-comm'
    ,url: layui.setter.api_host+'getActivityCommentList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
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
        selfajax.ajax('delActivityComment','post',field, function(res){
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
          view(this.id).render('activity/tagsformcomment', data).done(function(){
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
              selfajax.ajax('ActivitytoExamComment','post',field, function(res){
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
  //活动报名记录管理
  table.render({
    elem: '#LAY-app-content-tags-record'
    ,toolbar: '#toolbarDemo'
    ,defaultToolbar: ['filter']
    ,url: layui.setter.api_host+'getActivityRecordList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    , loading: true                      // 开启loading
    , cellMinWidth: 80                   // 每列最小宽度
    , limits: [15, 30, 50]                 // 每页条数的选择项
    , limit: 10                          // 默认每页条数
    ,height: '500'
    ,cols: [[
      {field: 'name', title: '姓名', width: 200}
      ,{field: 'phone', title: '电话', width: 200}
      ,{field: 'card', title: '身份证', width: 200}
      ,{field: 'age', title: '年龄', width: 70}
      ,{field: 'address', title: '地址', width: 200}
      ,{field: 'filenames', title: '图片', width: 100,templet: function (d) {
          if (d.filenames != "") {
            return '<div class="layui-text" style="cursor: pointer;"><a lay-submit lay-filter="show-label-image3" data-imgs=' + d.detailImages + ' data-id="' + d.id + '">详情链接</a></div>';
          } else {
            return '';
          }
        },style: 'cursor: pointer;'}
      ,{field: 'pdf_filename', title: 'pdf', width: 100,templet: function (d) {
          if (d.pdf_filename != "") {
            return '<div class="layui-text" style="cursor: pointer;"><a  href=' + d.pdf_filename + '>pdf</a></div>';
          } else {
            return '';
          }
        },style: 'cursor: pointer;'}
      ,{field: 'remarks', title: '备注', width: 200}
      ,{field: 'create_time', title: '报名时间', width: 200}
      ,{title: '操作', width: 100, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar'}
    ]],
    where: {
      activity_id:activity_id
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
    }
  });
  //监听工具条
  table.on('tool(LAY-app-content-tags-record)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除？', function(index){
        console.log(obj.data.id);
        selfajax.ajax('delActivityRecord','post',{
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

  form.on('submit(show-label-image3)', function (data) {
    let imgs = this.dataset.imgs;
    console.log(imgs)
    imgs = JSON.parse(imgs);
    console.log(imgs.data)
    $('.select-head-img li').remove();
    $.each(imgs.data, function () {
      $('.select-head-img').append('<li style="cursor:pointer;" data-id="' + this.pid + '" ><img src="' + this.src + '" alt=""></li>')
    });
    var content = $('#select-head-img').html();
    layer.open({
      type: 1,
      skin: 'layui-layer-rim', //加上边框
      area: ['80%', '500px'], //宽高
      content: content,
      title: false,
      closeBtn: 0,
      shadeClose: true,
    });
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

  exports('activity', {})
});
