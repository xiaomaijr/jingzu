/** layuiAdmin.std-v1.0.0 LPPL License By http://www.layui.com/admin/ */
 ;/** 核桃说后台管理-v1.2.1 LPPL License By http://www.layui.com/admin/ */
 ;/** 核桃说后台管理-v1.2.1 LPPL License By http://www.layui.com/admin/ */
 ;layui.define(['table', 'form', 'element', 'admin'], function (exports) {
    var setter = layui.setter,
        view = layui.view,
        table = layui.table,
        form = layui.form,
        element = layui.element,
        admin = layui.admin;
    //添加类型按钮绑定事件
    form.on('submit(add-type)', function () {
        admin.popup({
            title: '添加物品类型',
            area: ['400px', '200px'],
            id: 'LAY-popup-user-add',
            success: function (layero, index) {
                view(this.id).render('caiji/article_type_add', null).done(function () {
                    form.on('submit(save)', function (data) {
                        view.request({
                            url: 'article/type/add',
                            type: 'post',
                            auth: true,
                            data: {name: data.field.name},
                            tips: true,
                            success: function (e) {
                                if (e.success) {
                                    list.reload();
                                    layer.closeAll();
                                }
                            }
                        })
                    })
                });
            }
        });
    });
    //属性管理按钮绑定事件
    form.on('submit(type-manage)', function () {
        var cols = [];
        cols.push({field: 'topic', title: '维度', width: 300});
        //获取物品类型列表数据
        view.request({
            url: 'article/type/data',
            type: 'get',
            auth: true,
            async: false,
            success: function (e) {
                if (e.success) {
                    $.each(e.data, function () {
                        var _this = this;
                        cols.push({
                            field: 'type_' + this.id,
                            align: 'center',
                            title: this.name,
                            templet: function (d) {
                                var html = '<input type="checkbox" data-topic="' + d.LAY_INDEX + '" data-type="' + _this.id + '" lay-skin ="primary" ';
                                if (d['type_' + _this.id] == 2) {
                                    html += ' checked ';
                                }
                                html += '>';
                                html += '<img class="edit-article-alias-img" data-topic="' + d.LAY_INDEX + '"' +
                                    ' data-type="' + _this.id + '" lay-submit lay-filter="edit-article-alias"' +
                                    ' src="/static/images/web/edit.png" />';
                                return html;
                            }
                        });
                    });
                }
            }
        });
        //默认渲染物品类型列表数据
        list = table.render({
            elem: '#list',
            url: setter.api_host + 'comment/topic/type/status?access_token=' + layui.data(setter.tableName)[setter.request.tokenName],
            cols: [cols],
            text: {none: '暂无数据'},
            type: 'post',
            parseData: function (res) {
                return {
                    "code": res.code, //解析接口状态
                    "msg": res.msg, //解析提示文本
                    'count': res.data.count, //解析数据长度
                    "data": res.data.data //解析数据列表
                }
            }
        });
    });
    form.on('checkbox()', function (e) {
        var dataset = e.elem.dataset;
        dataset.status = e.elem.checked;
        view.request({
            url: 'comment/topic/type/updatestatus',
            type: 'post',
            auth: true,
            tips: true,
            data: dataset
        })
    });
    //默认渲染物品类型列表数据
    list = table.render({
        elem: '#list',
        url: setter.api_host + 'article/type/getList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName],
        cols: [
            [
                {field: 'id', title: '序号', align: 'center'},
                {field: 'name', title: '类型', align: 'center'},
                {field: 'create_time', title: '创建时间', align: 'center'},
                {field: 'alter_time', title: '修改时间', align: 'center'},
                {title: '操作', width: 250, align: 'center', fixed: 'right', toolbar: '#type-btn'}
            ]
        ],
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
    //物品类型列表tool事件
    //监听工具条
    table.on('tool(test)', function (obj) {
        var data = obj.data;
        if (obj.event === 'delete') {
            view.request({
                url: 'article/type/del',
                type: 'post',
                auth: true,
                data: {id: data.id},
                tips: true,
                success: function (e) {
                    if (e.success) {
                        obj.del();
                    }
                }
            })
        } else if (obj.event === 'edit') {
            admin.popup({
                title: '修改物品类型',
                area: ['400px', '200px'],
                id: 'LAY-popup-user-add',
                success: function (layero, index) {
                    view(this.id).render('goods/goods_match_edit', null).done(function () {
                        form.val('info', {name: data.name});
                        var _data = data;
                        form.on('submit(save)', function (data) {
                            view.request({
                                url: 'article/type/edit',
                                type: 'post',
                                auth: true,
                                data: {name: data.field.name, id: _data.id},
                                tips: true,
                                success: function (e) {
                                    if (e.success) {
                                        list.reload();
                                        layer.closeAll();
                                    }
                                }
                            })
                        })
                    });
                }
            });
        }
    });
    //物品修改别名图像点击事件
    form.on('submit(edit-article-alias)', function (e) {
        let topic = this.dataset.topic,
            type = this.dataset.type,
            data;
        view.request({
            url: 'topic/article/topic/alias/get',
            type: 'get',
            data: {
                topic_id: topic,
                type_id: type
            },
            auth: true,
            async: false,
            success: function (e) {
                if (e.success) {
                    data = e.data;
                }
            }
        })
        admin.popup({
            title: '修改物品维度名称',
            area: ['400px', '200px'],
            id: 'LAY-popup-user-add',
            success: function (layero, index) {
                view(this.id).render('article/article-edit-alias', data).done(function () {
                    form.val('alias-form', {alias: data.alias});
                    var _data = data;
                    form.on('submit(save-alias-form)', function (data) {
                        view.request({
                            url: 'topic/article/topic/alias/edit',
                            type: 'post',
                            auth: true,
                            data: {alias: data.field.alias, topic_id: topic, type_id: type},
                            tips: true,
                            success: function (e) {
                                if (e.success) {
                                    layer.closeAll();
                                }
                            }
                        })
                    })
                });
            }
        });
    });
    form.render();
    //对外暴露的接口
    exports('article', {});
});
