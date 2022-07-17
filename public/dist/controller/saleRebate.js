/** layuiAdmin.std-v1.0.0 LPPL License By http://www.layui.com/admin/ */
 ;/**
 @Name：layuiAdmin 内容系统
 @Author：star1029
 @Site：http://www.layui.com/admin/
 @License：LPPL
 */
layui.define(['table', 'form','selfajax','laydate'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,setter = layui.setter
  ,laydate = layui.laydate
  ,selfajax = layui.selfajax
  ,router = layui.router()
  ,form = layui.form;

  var date = new Date();
  let year = date.getFullYear();
  //年选择器
  laydate.render({
    elem: '#test2'
    ,type: 'year'
    ,value: year
    ,isInitValue: true
    ,done: function(value, date){
      year = value;
      table1.reload({where:{
        year:year
      }});
    }
  });
  $("#year_profit").on("input",function(e){
    //获取input输入的值
    console.log(e.delegateTarget.value);
  });
  $("#year_profit").blur("input",function(e){
    //获取input输入的值
    console.log(e.delegateTarget.value);
  });
  $('#year_profit').keydown(function (e) {
    if (e.keyCode === 13) {
      console.log(e.delegateTarget.value);
    }
  });
  //监听提交
  form.on('submit(LAY-user-back-year)', function(data){
    let field = data.field;
    field.year = year;
    view.request({
      url:'SaleRebateEditYear',
      type:'post',
      data:field,
      tips: true,
      success:function(res){
        if(!res.code){
          if(res.success){
            // layui.table.reload('LAY-app-content-tags'); //重载表格
          }
        }
      }
    })

  });


  //年终返利管理
  let table1 =table.render({
    elem: '#LAY-app-content-tags'
    ,toolbar: '#toolbarDemo'
    ,defaultToolbar: ['filter']
    ,url: layui.setter.api_host+'getSaleRebateList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
    ,page: true
    ,loading: true                      // 开启loading
    ,cellMinWidth: 80                   // 每列最小宽度
    ,limits: [15, 30, 50]                 // 每页条数的选择项
    ,limit: 20                          // 默认每页条数
    ,height:600
    ,cols: [[
      {field: 'name', title: '公司名称', minWidth: 100}
      ,{field: 'signing_seat', title: '签约席位', minWidth: 100,templet:function(d){
          if(d.signing_seat ==1){
            return '领袖';
          }else if(d.signing_seat ==2){
            return '私董';
          }else if(d.signing_seat ==3){
            return '委员';
          }else{
            return '未知';
          }
        }}

      ,{field: 'amount', title: '贡献度', minWidth: 100, edit: 'text'}
    ]],
    where:{
      year:year,
     }
    ,parseData: function (res) {
      return {
        "code": res.code, //解析接口状态
        "msg": res.msg, //解析提示文本
        "count": res.data.count, //解析数据长度
        "data": res.data.data, //解析数据列表
        "saleyear": res.data.saleyear,
      }
    }, done: function (res, curr, count) {
      $('#year_profit').val(res.saleyear.profit);
      $('#year_sale').val(res.saleyear.total_sales);
    }
  });
  //监听搜索
  form.on('submit(LAY-user-back-year2)', function(data){
    var field = data.field;
    //执行重载
    table.reload('LAY-app-content-tags', {
      where: field
      ,url: layui.setter.api_host+'getSaleRebateList' //模拟接口
      ,page: true
      , loading: true                      // 开启loading
      , cellMinWidth: 80                   // 每列最小宽度
      , limits: [15, 30, 50]                 // 每页条数的选择项
      , limit: 10                          // 默认每页条数
      ,cols: [[
        {field: 'name', title: '公司名称', minWidth: 100}
        ,{field: 'signing_seat', title: '签约席位', minWidth: 100,templet:function(d){
            if(d.signing_seat ==1){
              return '领袖';
            }else if(d.signing_seat ==2){
              return '私董';
            }else if(d.signing_seat ==3){
              return '委员';
            }else{
              return '未知';
            }
          }}

        ,{field: 'amount', title: '贡献度', minWidth: 100, edit: 'text'}
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
  //监听单元格编辑
  table.on('edit(LAY-app-content-tags)', function(obj){
    var value = obj.value //得到修改后的值
        ,data = obj.data //得到所在行所有键值
        ,field = obj.field; //得到字段

    view.request({
      url:'SaleRebateEdit',
      type:'post',
      data:{
        year:year,
        cid:data.id,
        num:value,
      },
      tips: true,
      success:function(res){
        if(!res.code){
          if(res.success){
            // layui.table.reload('LAY-app-content-tags'); //重载表格
          }
        }
      }
    })
  });
  //年终返利管理头工具栏事件
  table.on('toolbar(LAY-app-content-tags)', function(obj){
    var checkStatus = table.checkStatus(obj.config.id);
    switch(obj.event){
      case 'add':
        admin.popup({
          title: '添加合同'
          ,area: ['500px', '500px']
          ,id: 'LAY-popup-content-tags'
          ,success: function(layero, index){
            view(this.id).render('contract/tagsform','').done(function(){
              form.render(null, 'layuiadmin-form-tags');
              laydate.render({
                elem: '#signing_date'
              });
              view.request({
                url:'getCompanysAll',
                type:'get',
                data:{},
                success:function(res){
                  if(!res.code){
                    if(res.success){
                      $.each(res.data, function (key, val) {
                        var option1 = $("<option>").val(val.id).text(val.name);
                        //通过LayUI.jQuery添加列表项
                        $("#company").append(option1);
                      });
                      layui.form.render('select');
                    }
                  }
                }
              })
              //监听提交
              form.on('submit(layuiadmin-app-tags-submit)', function(data){
                var field = data.field; //获取提交的字段
                //提交 Ajax 成功后，关闭当前弹层并重载表格
                view.request({
                  url:'ContractAdd',
                  type:'post',
                  data:field,
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
      case 'company':
        layer.open({
          type: 1,
          skin: 'layui-layer-rim', //加上边框
          area: ['1200px', '600px'], //宽高
          content: $('#company-container').html(),
          title: false,
          closeBtn: 0,
          shadeClose: true,
          success: function (a, b) {
            //公司管理
            table.render({
              elem: '#LAY-app-content-tags-company'
              ,toolbar: '#toolbarDemo-company'
              ,defaultToolbar: ['filter']
              ,url: layui.setter.api_host+'getCompanyList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName]
              ,page: true
              ,loading: true                      // 开启loading
              ,cellMinWidth: 80                   // 每列最小宽度
              ,limits: [15, 30, 50]                 // 每页条数的选择项
              ,limit: 20                          // 默认每页条数
              ,height:550
              ,cols: [[
                {field: 'name', title: '公司名称', minWidth: 100}
                ,{field: 'image', title: '图片', minWidth: 100, templet: '#imgTpl',style:'padding:0;min-width:150px;'}
                ,{field: 'signing_seat', title: '签约席位', minWidth: 100,templet:function(d){
                    if(d.signing_seat ==1){
                      return '领袖';
                    }else if(d.signing_seat ==2){
                      return '私董';
                    }else if(d.signing_seat ==3){
                      return '委员';
                    }else{
                      return '未知';
                    }
                  }}
                ,{title: '操作', width: 300, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar-company'}
              ]],
              parseData: function (res) {
                return {
                  "code": res.code, //解析接口状态
                  "msg": res.msg, //解析提示文本
                  "count": res.data.count, //解析数据长度
                  "data": res.data.data //解析数据列表
                }
              }, done: function (res, curr, count) {

              }
            });
          }
        })
        break;
    };
  });
  //年终返利管理监听工具条
  table.on('tool(LAY-app-content-tags)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除这条数据？', function(index){
        view.request({
          url:'Contractdel',
          type:'post',
          data:{
            'id':obj.data.id,
          },
          tips: true,
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
        ,area: ['500px', '500px']
        ,id: 'LAY-popup-content-tags'
        ,success: function(layero, index){
          view(this.id).render('contract/tagsform', data).done(function(){
            form.render(null, 'layuiadmin-form-tags');
            laydate.render({
              elem: '#signing_date'
            });
            view.request({
              url:'getCompanysAll',
              type:'get',
              data:{},
              success:function(res){
                if(!res.code){
                  if(res.success){
                    $.each(res.data, function (key, val) {
                      if(data.company==val.id){
                        var option1 = $("<option selected>").val(val.id).text(val.name);
                      }else{
                        var option1 = $("<option>").val(val.id).text(val.name);
                      }
                      //通过LayUI.jQuery添加列表项
                      $("#company").append(option1);
                    });
                    layui.form.render('select');
                  }
                }
              }
            })
            //监听提交
            form.on('submit(layuiadmin-app-tags-submit)', function(data){
              var field = data.field; //获取提交的字段
              view.request({
                url:'ContractEdit',
                type:'post',
                data:field,
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
    }else if(obj.event === 'addphone'){
      location.hash = '/contract/manage_phone/id=' + obj.data.id;
    }else if(obj.event === 'pay'){
      location.hash = '/contract/manage_pay/id=' + obj.data.id+'/type=1';
    }else if(obj.event === 'deliver'){
      location.hash = '/contract/manage_deliver/id=' + obj.data.id+'/type=2';
    }
  });


  exports('saleRebate', {})
});
