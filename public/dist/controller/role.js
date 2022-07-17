/** layuiAdmin.std-v1.0.0 LPPL License By http://www.layui.com/admin/ */
 ;layui.define(['table', 'form','selfajax','tree'], function (exports) {
    let table = layui.table,
        form = layui.form,
        $ = layui.$,
        setter = layui.setter,
        selfajax = layui.selfajax,
        admin = layui.admin,
        tree = layui.tree,
        view = layui.view;
    //搜索角色
    form.on('select(LAY-user-adminrole-type)', function (data) {
        //执行重载
        table.reload('LAY-user-back-role', {
            where: {
                role: data.value
            }
        });
    });
    //角色管理
    table.render({
        elem: '#LAY-user-back-role'
        , url: setter.api_host + 'getRoleList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName] //模拟接口
        ,cellMinWidth: 80
        , cols: [[
            {type: 'checkbox', fixed: 'left'}
            , {field: 'id', width: 80, title: 'ID', sort: true}
            , {field: 'name', title: '角色名'}
            , {field: 'description', title: '具体描述'}
            , {field: 'create_time', title: '创建时间'}
            , {field: 'alter_time', title: '修改时间'}
            , {title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#table-useradmin-admin'}
        ]]
        , text: {none: '暂无数据'}
        , parseData: function (res) {
            return {
                "code": res.code, //解析接口状态
                "msg": res.msg, //解析提示文本
                'count': res.data.count, //解析数据长度
                "data": res.data.data //解析数据列表
            }
        }, done: function (res, curr, count) {
            $('td[data-field="image"] .layui-table-cell, .layui-table-tool-panel li').each(function () {
                $(this).css('overflow', 'none !important');
            })
        },
        page: true
    });
    //监听工具条
    table.on('tool(LAY-user-back-role)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('确定删除此角色？', function (index) {
                //发送请求,删除角色
                view.request({
                    url: 'role/del',
                    auth: true,
                    type: 'post',
                    tips: true,
                    data: {id: data.id},
                    success: function (e) {
                        if (e.success) {
                            obj.del();
                            layer.close(index);
                        }
                    }
                });
            });
        } else if (obj.event === 'edit') {
            layui.ruleids=obj.data.ruleids
            admin.popup({
                title: '修改角色'
                , area: ['500px', '480px']
                , id: 'LAY-popup-user-add'
                , success: function (layero, index) {
                    view(this.id).render('role/roleform', data).done(function () {
                        form.render(null, 'layuiadmin-form-role');
                        //监听提交
                        form.on('submit(LAY-user-role-submit)', function (data) {
                            var field = data.field; //获取提交的字段
                            var checkData = tree.getChecked('demoId');
                            data.field.qx=checkData
                            view.request({
                                url: 'RoleEdit',
                                type: 'post',
                                auth: true,
                                tips: true,
                                data: field,
                                success: function (e) {
                                    if (e.success) {
                                        layui.table.reload('LAY-user-back-role'); //重载表格
                                        layer.close(index); //执行关闭
                                    }
                                }
                            })
                        });
                    });
                }
            });
        } else if (obj.event === 'list') {
            admin.popup({
                title: '成员列表'
                , area: ['800px', '480px']
                , id: 'LAY-popup-user-add'
                , success: function (layero, index) {
                    console.log(data);
                    view(this.id).render('user/administrators/roleadminlist', data).done(function () {
                        form.render(null, 'layuiadmin-form-role');
                        //角色管理
                        table.render({
                            elem: '#admin-list',
                            url: setter.api_host + 'role/getAdminList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName] + '&role=' + data.level
                            ,
                            cols: [[
                                {field: 'admin_id', width: 80, title: '用户id', sort: true}
                                , {field: 'username', title: '登录账户'}
                                , {field: 'nickname', title: '昵称'}
                            ]],
                            text: {none: '暂无数据'},
                            parseData: function (res) {
                                return {
                                    "code": res.code, //解析接口状态
                                    "msg": res.msg, //解析提示文本
                                    'count': res.data.count, //解析数据长度
                                    "data": res.data.data //解析数据列表
                                }
                            }
                        });
                        //监听提交
                        form.on('submit(LAY-user-role-submit)', function (data) {
                            var field = data.field; //获取提交的字段
                            view.request({
                                url: 'role/edit',
                                type: 'post',
                                auth: true,
                                tips: true,
                                data: field,
                                success: function (e) {
                                    if (e.success) {
                                        layui.table.reload('LAY-user-back-role'); //重载表格
                                        layer.close(index); //执行关闭
                                    }
                                }
                            })
                        });
                    });
                }
            });
        }
    });
    //事件
    var active = {
        batchdel: function () {
            var checkStatus = table.checkStatus('LAY-user-back-role')
                , checkData = checkStatus.data; //得到选中的数据

            if (checkData.length === 0) {
                return layer.msg('请选择数据');
            }

            layer.confirm('确定删除吗？', function (index) {
                var ids = {id:[]};
                $.each(checkData,function () {
                    ids.id.push(this.id)
                });
                view.request({
                    url:'role/dels',
                    type:'post',
                    data:ids,
                    auth:true,
                    tips:true,
                    success:function (e) {
                        if(e.success){
                            table.reload('LAY-user-back-role');
                        }
                    }
                })

            });
        },
        add: function () {
            admin.popup({
                title: '添加新角色'
                , area: ['500px', '480px']
                , id: 'LAY-popup-user-add'
                , success: function (layero, index) {
                    layui.ruleids='a';
                    view(this.id).render('role/roleform').done(function () {
                        form.render(null, 'layuiadmin-form-role');

                        //监听提交
                        form.on('submit(LAY-user-role-submit)', function (data) {
                            var field = data.field; //获取提交的字段
                            var checkData = tree.getChecked('demoId');
                            data.field.qx=checkData
                            view.request({
                                url:'RoleAdd',
                                data:field,
                                type:'post',
                                tips:true,
                                auth:true,
                                success:function (e) {
                                    if(e.success){
                                        layui.table.reload('LAY-user-back-role'); //重载表格
                                        layer.close(index); //执行关闭
                                    }
                                }
                            })
                        });
                    });
                }
            });
        }
    }
    $('.layui-btn.layuiadmin-btn-role').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    //管理员管理
    table.render({
        elem: '#LAY-user-back-manage'
        ,url: setter.api_host+'/getAdminList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName] //模拟接口
        ,cols: [[
            // {type: 'checkbox', fixed: 'left'}
            {field: 'id', width: 80, title: 'ID', sort: true}
            ,{field: 'username', title: '登录名'}
            // ,{field: 'phone', title: '手机'}
            // ,{field: 'email', title: '邮箱'}
            // ,{field: 'role', title: '角色'}
            ,{field: 'create_time', title: '修改时间', sort: true}
            ,{title: '操作', width: 300, align: 'center', fixed: 'right', toolbar: '#table-useradmin-admin'}
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
        ,text: '对不起，加载出现异常！'
    });

    //监听工具条
    table.on('tool(LAY-user-back-manage)', function(obj){
        var data = obj.data;
        if(obj.event === 'del'){
            layer.prompt({
                formType: 1
                ,title: '敏感操作，请验证口令'
            }, function(value, index){
                layer.close(index);
                console.log(value)
                if(value=='ssqc009'){
                    layer.msg("",{time:2000})
                }else{
                    layer.msg("口令不正确",{time:2000})
                }
                return false;
                layer.confirm('确定删除此管理员？', function(index){
                    console.log(obj)
                    obj.del();
                    layer.close(index);
                });
            });
        }else if(obj.event === 'edit'){
            admin.popup({
                title: '编辑管理员'
                ,area: ['420px', '450px']
                ,id: 'LAY-popup-user-add'
                ,success: function(layero, index){
                    view(this.id).render('role/adminform', data).done(function(){
                        form.render(null, 'layuiadmin-form-admin');

                        view.request({
                            url:'getRoleall',
                            type:'get',
                            data:{},
                            auth:true,
                            tips:false,
                            success:function (e) {
                                if(e.success){
                                    brand=e.data
                                    $("#role").html('<option value="0">全部角色</option>');
                                    $.each(brand, function (key, val) {
                                        if(data.role==val.id){
                                            var option1 = $("<option selected>").val(val.id).text(val.name);
                                        }else{
                                            var option1 = $("<option>").val(val.id).text(val.name);
                                        }
                                        //通过LayUI.jQuery添加列表项
                                        $("#role").append(option1);
                                    });
                                    layui.form.render('select');
                                }
                            }
                        });
                        if(data.id==1){
                            $('#role-con').hide();
                        }
                        //监听提交
                        form.on('submit(LAY-user-back-submit)', function(data){
                            var field = data.field; //获取提交的字段
                            selfajax.ajax('AdminEdit','post',field, function(res){
                                if(!res.code){
                                    layer.msg(res.msg,{time:2000},function(){
                                        if(res.success){
                                            layui.table.reload('LAY-user-back-manage'); //重载表格
                                            layer.close(index); //执行关闭
                                        }
                                    })
                                }else{
                                    layer.msg(res.msg,{time:2000});
                                }
                            },'',function(){
                                loading = layer.load();
                            },function () {
                                layer.close(loading);
                            });
                        });
                    });
                }
            });
        }else if(obj.event === 'editcustomer'){
            admin.popup({
                title: '编辑客户'
                ,area: ['50%', '450px']
                ,id: 'LAY-popup-user-add'
                ,success: function(layero, index){
                    view(this.id).render('role/customerform', data).done(function(){
                        form.render(null, 'layuiadmin-form-admin');
                        let company_ids = data.company_ids;
                        let arr = [];
                        if(company_ids!=null){
                            arr = company_ids.split(',');
                        }
                        var company = [],
                            demo1;
                        view.request({
                            url:'getCompanysAllV2',
                            data:{},
                            type:'get',
                            tips:false,
                            auth:true,
                            success:function (e) {
                                if(e.success){
                                    company = e.data;
                                    layui.each(company,function(index,item){
                                        let i =item.value.toString();
                                        if($.inArray(i, arr)>=0){
                                            company[index].selected = true;
                                        }
                                    });
                                    //渲染多选
                                    demo1 = xmSelect.render({
                                        el: '#demo1',
                                        autoRow: true,
                                        filterable: true,
                                        data: company
                                    });
                                }
                            }
                        })

                        //监听提交
                        form.on('submit(LAY-user-back-submit)', function(data){
                            var field = data.field; //获取提交的字段
                            field.company_ids = demo1.getValue('valueStr');
                            selfajax.ajax('editAdminCompanyIds','post',field, function(res){
                                if(!res.code){
                                    layer.msg(res.msg,{time:2000},function(){
                                        if(res.success){
                                            layui.table.reload('LAY-user-back-manage'); //重载表格
                                            layer.close(index); //执行关闭
                                        }
                                    })
                                }else{
                                    layer.msg(res.msg,{time:2000});
                                }
                            },'',function(){
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
    exports('role', {})
});
