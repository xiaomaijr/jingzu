/** layuiAdmin.std-v1.0.0 LPPL License By http://www.layui.com/admin/ */
 ;/** 核桃说后台管理-v1.2.1 LPPL License By http://www.layui.com/admin/ */
 ;/** 核桃说后台管理-v1.2.1 LPPL License By http://www.layui.com/admin/ */
 ;/** 核桃说后台管理-v1.2.1 LPPL License By http://www.layui.com/admin/ */
 ;/** 核桃说后台管理-v1.2.1 LPPL License By http://www.layui.com/admin/ */
 ;/** 核桃说后台管理-v1.2.1 LPPL License By http://www.layui.com/admin/ */
 ;/** 核桃说后台管理-v1.2.1 LPPL License By http://www.layui.com/admin/ */
 ;layui.define(['table', 'form', 'element'], function (exports) {
    var $ = layui.$,
        layer = layui.layer,
        setter = layui.setter,
        view = layui.view,
        table = layui.table,
        form = layui.form,
        router = layui.router(),
        product_id = router.search.product_id,
        element = layui.element,
        count = 0,
        is_admin =false;

    //获取数据核对权限
    view.request({
        url: 'comment/commentAnalyze/getCheckAUth',
        auth: true,
        type: 'get',
        success: function (e) {
            if (e.success) {
                if(e.data.uid == 1){
                    $('.layui-tab-title li[data-filter="6"]').hide();
                    $('.layui-tab-title li[data-filter="8"]').hide();
                    $('.layui-tab-title li[data-filter="9"]').hide();
                }
                is_admin = e.data.auth;
                // if (e.data.auth) {
                //     $.each($('.layui-tab-title li'), function () {
                //         if (this.dataset.filter != 6) {
                //             $(this).hide();
                //         }
                //     });
                //     $('.layui-tab-title li[data-filter="6"]').show();
                //     $('.layui-tab-title li[data-filter="8"]').show();
                //     $('.layui-tab-title li[data-filter="9"]').show();
                //     $('.comment-filter-form').hide();
                // } else {
                    //菜单管理
                    list_tableIns = table.render({
                        elem: '#comment-no-analysis',
                        url: setter.api_host + 'comment/getList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName] //模拟接口
                        ,
                        height: view.getTableHeight(70),
                        cols: [
                            [
                                {type: 'checkbox', fixed: 'left'}, {
                                field: 'content',
                                title: '点评内容',
                                width: 900,
                                templet: '#content'
                            }, {field: 'create_time', title: '建立时间', width: 150, align: 'center'}, {
                                field: 'id',
                                title: '编号',
                                width: 150,
                                align: 'center'
                            }, {

                                title: '操作',
                                rowspan: 2,
                                width: 150,
                                align: 'center',
                                toolbar: '#btn-comment-list-del'
                            }
                            ]
                        ],
                        text: {none: '暂无数据'},
                        parseData: function (res) {
                            return {
                                "code": res.code, //解析接口状态
                                "msg": res.msg, //解析提示文本
                                'count': res.data.count, //解析数据长度
                                "data": res.data.data, //解析数据列
                                'option': res.data.option
                            }
                        },
                        page: {
                            groups: 3,
                            layout: ['prev', 'page', 'next', 'limit']
                        },
                        limit: 20,
                        limits: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                        // limits: [100, 200, 300],
                        done: function (data) {
                            list_tableIns.config.where['count'] = data.count;
                            list_tableIns.config.where['option'] = data.option;
                            //回调函数,处理表格选择框所在单元样式问题
                            $.each($('#comment-no-analysis').next().children('.layui-table-box').children('.layui-table-body').children('table').children('tbody').children('tr'), function () {
                                $('#comment-no-analysis').next().children('.layui-table-box').children('.layui-table-fixed').children('.layui-table-body').children('table').children('tbody').children('tr[data-index="' + this.dataset.index + '"]').height($(this).height());
                            });
                        }
                    });
                    form.on('submit(comment-filter)', function (data) {
                        this.dataset.value = $(this).siblings('input[name="keyword"]').val();
                        table.reload(this.dataset.filter, {
                            where: data.field
                        });
                    });
                // }
            }
        }
    });
    // 点击某一行变色
    // $("body").on('click','.layui-table-body tr ',function () {
    //     // console.log($(this))
    //     var data_index=$(this).attr('data-index');//得到当前的tr的index
    //     $(".layui-table-body tr").attr({"style":"background:#FFFFFF"});//其他tr恢复颜色
    //     $(".layui-table-body tr[data-index="+data_index+"]").attr({"style":"background:rgb(243, 246, 251)"});//改变当前tr颜色
    // });
    element.on('tab(comment)', function (data) {
        console.log(data)
        if (data.index == 0) {
            console.log(1)
            // list_tableIns.reload('comment-manage', {
            //     where: ''
            // });
            table.render({
                elem: '#comment-download',
                url: setter.api_host + 'comment/getCommentArticleList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName] //模拟接口
                ,
                height: view.getTableHeight(70),
                cols: [
                    [
                        // {
                        //     type: 'checkbox',
                        //     fixed: 'left'
                        // },
                        {
                            field: 'name',
                            title: '物品名称',
                            width: 200,
                            align: 'center'
                        },
                        {
                            field: 'RelationGoodsNum',
                            title: '已关联商品总数',
                            width: 200,
                            align: 'center'
                        },
                        {
                            field: 'ProductNum',
                            title: '已合并商品总数',
                            width: 200,
                            align: 'center'
                        },
                        // {
                        //     field: 'CommentNum',
                        //     title: '点评总数',
                        //     width: 200,
                        //     align: 'center'
                        // },
                        {
                            field: 'RemakeNum',
                            title: '已下载点评总数',
                            width: 200,
                            align: 'center'
                        },
                        {
                            field: 'AnalyzeCommentNum',
                            title: '已分析点评数量',
                            width: 200,
                            align: 'center'
                        },
                        {
                            field: 'NoAnalyzeCommentNum',
                            title: '未分析点评数量',
                            width: 200,
                            align: 'center'
                        },
                        {

                            title: '操作',
                            rowspan: 2,
                            width: 300,
                            align: 'center',
                            toolbar: '#btn-comment-list-del'
                        }
                    ]
                ],
                text: {none: '暂无数据'},
                parseData: function (res) {
                    return {
                        "code": res.code, //解析接口状态
                        "msg": res.msg, //解析提示文本
                        'count': res.data.count, //解析数据长度
                        "data": res.data.data, //解析数据列
                        'option': res.data.option
                    }
                },
                page: {
                    groups: 3,
                    layout: ['prev', 'page', 'next', 'limit']
                },
                limit: 20,
                limits: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                // limits: [100, 200, 300],
                done: function (data) {
                    list_tableIns.config.where['count'] = data.count;
                    list_tableIns.config.where['option'] = data.option;
                    //回调函数,处理表格选择框所在单元样式问题
                    $.each($('#comment-no-analysis').next().children('.layui-table-box').children('.layui-table-body').children('table').children('tbody').children('tr'), function () {
                        $('#comment-no-analysis').next().children('.layui-table-box').children('.layui-table-fixed').children('.layui-table-body').children('table').children('tbody').children('tr[data-index="' + this.dataset.index + '"]').height($(this).height());
                    });
                }
            });
            table.on('row(comment-download)', function(obj){
                $(".layui-table-body tr ").removeClass('tr-bj');//其他tr恢复原样
                console.log(obj.tr) //得到当前点击的tr
                $(obj.tr).addClass('tr-bj');//改变当前tr颜色
            });
        } else if (data.index == 1) {
            //发送请求获取执行人id
            view.request({
                url: 'comment/getAnalyzeUser',
                auth: true,
                type: 'get',
                success: function (e) {
                    if (e.success) {
                        $('.comment-already-user-option').remove();
                        $.each(e.data, function () {
                            $('select[name="comment-already-user"]').append('<option class="comment-already-user-option" value="' + this.id + '">' + this.nickname + '</option>');
                        })
                        form.render();
                    }
                }
            });
            //发送请求获取题目列表数据
            view.request({
                url: 'comment/getTopic',
                auth: true,
                type: 'get',
                success: function (e) {
                    if (e.success) {
                        $('.comment-already-topic-option').remove();
                        $.each(e.data, function () {
                            $('select[name="comment-topic"]').append('<option class="comment-already-topic-option" value="' + this.id + '">' + this.title + '</option>')
                        })
                        form.render();
                    }
                }
            });

            //菜单管理
            already_tableIns = table.render({
                elem: '#comment-already',
                url: setter.api_host + 'comment/getAnalyzeList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName] //模拟接口
                ,
                height: view.getTableHeight(90),
                cols: [
                    [
                        {
                            type: 'checkbox',
                            rowspan: 2,
                            fixed: 'left'
                        }, {
                        field: 'title',
                        title: '物品名称',
                        rowspan: 2,
                        width: 100, fixed: 'left',align: 'center'
                    }, {
                        field: 'good_type',
                        title: 'NLP维度',
                        rowspan: 2,
                        width: 100, fixed: 'left',align: 'center'
                    },{
                        field: 'content',
                        title: '点评内容',
                        rowspan: 2,
                        width: 500, fixed: 'left',align: 'center'
                    },  {
                        field: '',
                        title: '使用效果',
                        colspan: 3,
                        align: 'center',
                        width: 433,
                    }, {
                        field: '',
                        title: '性价比',
                        align: 'center',
                        width: 450,
                        colspan: 3
                    }, {
                        field: '',
                        title: '宝宝接受度',
                        colspan: 3,
                        align: 'center',
                        width: 403,
                    }, {
                        field: '',
                        title: '外观',
                        colspan: 3,
                        align: 'center',
                        width: 361,
                    }, {
                        field: '',
                        title: '口味怎么样？',
                        colspan: 3,
                        align: 'center',
                        width: 347,
                    }, {
                        field: '',
                        title: '是否有异味？',
                        colspan: 3,
                        align: 'center',
                        width: 376,
                    }, {
                        field: '',
                        title: '安全性',
                        colspan: 3,
                        align: 'center',
                        width: 403,
                    }, {
                        field: 'create_time',
                        title: '分析时间',
                        rowspan: 2,
                        width: 200,
                        align: 'center'
                    }, {field: 'comment_id', title: '编号', rowspan: 2, width: 100, align: 'center'},
                        {
                        title: '操作',
                        rowspan: 2,
                        width: 150,
                        align: 'center',
                        toolbar: '#btn-comment-already'
                    } //这里的toolbar值是模板元素的选择器
                    ],
                    [{
                        field: 'topic7.k0.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic7_k0_content'
                    }, {
                        field: 'topic7.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic7_k2_content'
                    }, {
                        field: 'topic7.k1.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic7_k1_content'
                    },{
                        field: 'topic1.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k1_content'
                    }, {
                        field: 'topic1.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k2_content'
                    }, {
                        field: '',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k0_content'
                    },{
                        field: 'topic2.k0.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic2_k0_content'
                    }, {
                        field: 'topic2.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic2_k2_content'
                    }, {
                        field: 'topic2.k1.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic2_k1_content'
                    },{
                        field: 'topic3.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k1_content'
                    }, {
                        field: 'topic3.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k2_content'
                    }, {
                        field: 'topic3.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k0_content'
                    },{
                        field: 'topic4.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k1_content'
                    }, {
                        field: 'topic4.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k2_content'
                    }, {
                        field: 'topic4.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k0_content'
                    },{
                        field: 'topic5.k1.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic5_k1_content'
                    }, {
                        field: 'topic5.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic5_k2_content'
                    }, {
                        field: 'topic5.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic5_k0_content'
                    }, {
                        field: 'topic6.k1.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic6_k1_content'
                    }, {
                        field: 'topic6.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic6_k2_content'
                    }, {
                        field: 'topic6.k0.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic6_k0_content'
                    }]
                ],
                text: {none: '暂无数据'},
                parseData: function (res) {
                    return {
                        "code": res.code, //解析接口状态
                        "msg": res.msg, //解析提示文本
                        'count': res.data.count, //解析数据长度
                        "data": res.data.data //解析数据列表
                    }
                },
                page: true,
                limit: 20,
                limits: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                done: function (res) {
                    $('td[data-field="topic1"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic1"]').css('padding', 0);
                    $('td[data-field="topic2"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic2"]').css('padding', 0);
                    $('td[data-field="topic3"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic3"]').css('padding', 0);
                    $('td[data-field="topic4"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic4"]').css('padding', 0);
                    $('td[data-field="topic5"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic5"]').css('padding', 0);
                    $('td[data-field="topic6"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic6"]').css('padding', 0);
                    $('td[data-field="topic7"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic7"]').css('padding', 0);
                    //回调函数,处理表格选择框所在单元样式问题
                    $.each($('#comment-already').next().children('.layui-table-box').children('.layui-table-body').children('table').children('tbody').children('tr'), function () {
                        $('#comment-already').next().children('.layui-table-box').children('.layui-table-fixed').children('.layui-table-body').children('table').children('tbody').children('tr[data-index="' + this.dataset.index + '"]').height($(this).height());
                    });
                    handleTopicBackGround();

                },
                where: {
                    status: 1,
                    product_id:product_id,
                }
            });
            table.on('row(comment-already)', function(obj){
                $(".layui-table-body tr ").removeClass('tr-bj');//其他tr恢复原样
                console.log(obj.tr) //得到当前点击的tr
                $(obj.tr).addClass('tr-bj');//改变当前tr颜色
            });

        } else if (data.index == 2) {
            //菜单管理
            abnormal_tableIns = table.render({
                elem: '#comment-analyze-abnormal',
                url: setter.api_host + 'comment/getAnalyzeList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName],
                height: view.getTableHeight(90),
                cols: [
                    [
                        {type: 'checkbox', rowspan: 2, fixed: 'left'},
                        {field: 'title',title: '物品名称', rowspan: 2, width: 100, fixed: 'left',align: 'center'},
                        {field: 'good_type', title: 'NLP维度', rowspan: 2, width: 100, fixed: 'left',align: 'center'},
                        {field: 'content', title: '点评内容', rowspan: 2, width: 500, fixed: 'left'},
                        {field: 'create_time', title: '分析时间', rowspan: 2, width: 200, align: 'center'},
                        {
                            field: 'alter_time', rowspan: 2, title: '审核时间', width: 150, align: 'center'
                        }, {
                        field: '',
                        title: '使用效果',
                        colspan: 3,
                        align: 'center',
                        width: 433,
                    }, {
                        field: '',
                        title: '性价比',
                        align: 'center',
                        width: 450,
                        colspan: 3
                    }, {
                        field: '',
                        title: '宝宝接受度',
                        colspan: 3,
                        align: 'center',
                        width: 403,
                    }, {
                        field: '',
                        title: '外观',
                        colspan: 3,
                        align: 'center',
                        width: 361,
                    }, {
                        field: '',
                        title: '口味怎么样？',
                        colspan: 3,
                        align: 'center',
                        width: 347,
                    }, {
                        field: '',
                        title: '是否有异味？',
                        colspan: 3,
                        align: 'center',
                        width: 376,
                    }, {
                        field: '',
                        title: '安全性',
                        colspan: 3,
                        align: 'center',
                        width: 403,
                    }, {
                        field: 'comment_id', title: '编号', rowspan: 2, width: 100, align: 'center'
                    },
                        {title: '操作', rowspan: 2, width: 150, align: 'center', toolbar: '#btn-comment-abnormal'} //这里的toolbar值是模板元素的选择器
                    ], [{
                        field: 'topic7.k0.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic7_k0_content'
                    }, {
                        field: 'topic7.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic7_k2_content'
                    }, {
                        field: 'topic7.k1.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic7_k1_content'
                    },
                    //     {
                    //     field: 'topic7.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic7_k3_content'
                    // },
                        {
                        field: 'topic1.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k1_content'
                    }, {
                        field: 'topic1.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k2_content'
                    }, {
                        field: '',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k0_content'
                    }, {
                        field: 'topic2.k0.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic2_k0_content'
                    }, {
                        field: 'topic2.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic2_k2_content'
                    }, {
                        field: 'topic2.k1.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic2_k1_content'
                    },
                    //     {
                    //     field: 'topic2.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic2_k3_content'
                    // },
                        {
                        field: 'topic3.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k1_content'
                    }, {
                        field: 'topic3.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k2_content'
                    }, {
                        field: 'topic3.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k0_content'
                    },
                    //     {
                    //     field: 'topic3.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 80,
                    //     event: 'abnormal',
                    //     templet: '#topic3_k3_content'
                    // },
                        {
                        field: 'topic4.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k1_content'
                    }, {
                        field: 'topic4.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k2_content'
                    }, {
                        field: 'topic4.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k0_content'
                    },
                    //     {
                    //     field: 'topic4.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 80,
                    //     event: 'abnormal',
                    //     templet: '#topic4_k3_content'
                    // },
                        {
                        field: 'topic5.k1.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic5_k1_content'
                    }, {
                        field: 'topic5.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic5_k2_content'
                    }, {
                        field: 'topic5.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic5_k0_content'
                    }, {
                        field: 'topic6.k1.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic6_k1_content'
                    }, {
                        field: 'topic6.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic6_k2_content'
                    }, {
                        field: 'topic6.k0.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic6_k0_content'
                    }
                    // ,
                    //     {
                    //     field: 'topic6.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic6_k3_content'
                    // }
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
                },
                page: true,
                limit: 20,
                limits: [10, 20, 40, 60, 80, 100],
                done: function (res) {
                    $('td[data-field="topic1"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic1"]').css('padding', 0);
                    $('td[data-field="topic2"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic2"]').css('padding', 0);
                    $('td[data-field="topic3"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic3"]').css('padding', 0);
                    $('td[data-field="topic4"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic4"]').css('padding', 0);
                    $('td[data-field="topic5"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic5"]').css('padding', 0);
                    $('td[data-field="topic6"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic6"]').css('padding', 0);
                    $('td[data-field="topic7"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic7"]').css('padding', 0);
                    merge(res);
                    handleTopicBackGround();
                    // $.each($('div[lay-id="comment-analyze-abnormal"]').find('td[data-field="12"]'), function () {
                    //     var rowspan = $(this).siblings('td[data-field="content"]').attr('rowspan');
                    //     console.log('rowspan'+rowspan);
                    //     if (rowspan != undefined) {
                    //         $(this).attr('rowspan', rowspan);
                    //     }
                    //     var display = $(this).siblings('td[data-field="content"]').css('display');
                    //     $(this).css('display', display);
                    // });
                    // $.each($('div[lay-id="comment-analyze-abnormal"]').find('td[data-field="alter_time"]'), function () {
                    //     var rowspan = $(this).siblings('td[data-field="content"]').attr('rowspan');
                    //     if (rowspan != undefined) {
                    //         $(this).attr('rowspan', rowspan);
                    //     }
                    //     var display = $(this).siblings('td[data-field="content"]').css('display');
                    //     $(this).css('display', display);
                    // });
                    // $.each($('div[lay-id="comment-analyze-abnormal"]').find('td[data-field="comment_id"]'), function () {
                    //     var rowspan = $(this).siblings('td[data-field="content"]').attr('rowspan');
                    //     if (rowspan != undefined) {
                    //         $(this).attr('rowspan', rowspan);
                    //     }
                    //     var display = $(this).siblings('td[data-field="content"]').css('display');
                    //     $(this).css('display', display);
                    // });
                    // $.each($('div[lay-id="comment-analyze-abnormal"]').find('.layui-table-fixed').children('.layui-table-body').find('tr'), function () {
                    //     var tr = 'tr[data-index="' + $(this).attr('data-index') + '"]';
                    //     var element_tr = $('div[lay-id="comment-analyze-abnormal"]').find('.layui-table-main').find(tr);
                    //     if (element_tr.length != 0) {
                    //         var rowspan = $(element_tr).children('td[data-field="content"]').attr('rowspan');
                    //         if (rowspan != undefined) {
                    //             $(this).children('td').attr('rowspan', rowspan);
                    //         }
                    //         var display = $(element_tr).children('td[data-field="content"]').css('display');
                    //         $(this).children('td').css('display', display);
                    //     }
                    // });
                    //回调函数,处理表格选择框所在单元样式问题
                    $.each($('#comment-analyze-abnormal').next().children('.layui-table-box').children('.layui-table-body').children('table').children('tbody').children('tr'), function () {
                        $('#comment-analyze-abnormal').next().children('.layui-table-box').children('.layui-table-fixed').children('.layui-table-body').children('table').children('tbody').children('tr[data-index="' + this.dataset.index + '"]').height($(this).height());
                    });
                },
                where: {
                    status: 2,
                    is_audit: 3
                }
            });
            table.on('row(comment-analyze-abnormal)', function(obj){
                $(".layui-table-body tr ").removeClass('tr-bj');//其他tr恢复原样
                console.log(obj.tr) //得到当前点击的tr
                let trtr = obj.tr;
                let tmp_concon
                trtr.each(function(){
                    tmp_concon = $(this).attr('concon');
                    if(typeof tmp_concon !='undefined'){
                        let tjtr = $(this).siblings();
                        tjtr.each(function(){
                            if($(this).attr('concon')==tmp_concon){
                                var trArr = $('div[lay-id="comment-analyze-abnormal"] .layui-table-main>.layui-table').find("tr"); //所有行
                                trArr.eq($(this).attr('data-index')).addClass('tr-bj');
                                $(this).addClass('tr-bj');
                            }
                        });
                    }
                });
                $(obj.tr).addClass('tr-bj');//改变当前tr颜色
            });
        } else if (data.index == 4) {
            //菜单管理
            check_tableIns = table.render({
                elem: '#comment-analyze-check',
                url: setter.api_host + 'comment/commentAnalyze/getCheckList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName],
                height: view.getTableHeight(90),
                cols: [
                    [
                        {field: 'title',title: '物品名称', rowspan: 2, width: 100, fixed: 'left',align: 'center'},
                        {field: 'good_type', title: 'NLP维度', rowspan: 2, width: 100, fixed: 'left',align: 'center'},{
                            field: 'content',
                            title: '点评内容',
                            rowspan: 2,
                            width: 350,
                            fixed: 'left'
                        }, {
                        field: '',
                        title: '使用效果',
                        colspan: 3,
                        align: 'center',
                        width: 433,
                    }, {
                        field: '',
                        title: '性价比',
                        align: 'center',
                        width: 450,
                        colspan: 3
                    }, {
                        field: '',
                        title: '宝宝接受度',
                        colspan: 3,
                        align: 'center',
                        width: 403,
                    }, {
                        field: '',
                        title: '外观',
                        colspan: 3,
                        align: 'center',
                        width: 361,
                    }, {
                        field: '',
                        title: '口味怎么样？',
                        colspan: 3,
                        align: 'center',
                        width: 347,
                    }, {
                        field: '',
                        title: '是否有异味？',
                        colspan: 3,
                        align: 'center',
                        width: 376,
                    }, {
                        field: '',
                        title: '安全性',
                        colspan: 3,
                        align: 'center',
                        width: 403,
                    }, {
                        field: 'center',
                        title: '物品',
                        rowspan: 2,
                        width: 100,
                        align: 'center'
                    }, {
                        field: 'admin.nickname',
                        title: '执行人',
                        rowspan: 2,
                        align: 'center',
                        width: 100,
                    }, {
                        field: 'create_time',
                        title: '分析时间',
                        rowspan: 2,
                        width: 200,
                        align: 'center'
                    }, {field: 'comment_id', title: '编号', rowspan: 2, width: 100, align: 'center'}, {

                        title: '操作',
                        rowspan: 2,
                        width: 150,
                        align: 'center',
                        toolbar: '#btn-comment-check'
                    } //这里的toolbar值是模板元素的选择器
                    ], [{
                        field: 'topic7.k0.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic7_k0_content'
                    }, {
                        field: 'topic7.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic7_k2_content'
                    }, {
                        field: 'topic7.k1.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic7_k1_content'
                    },
                    //     {
                    //     field: 'topic7.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic7_k3_content'
                    // },
                        {
                        field: 'topic1.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k1_content'
                    }, {
                        field: 'topic1.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k2_content'
                    }, {
                        field: 'topic1.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k0_content'
                    }, {
                        field: 'topic2.k0.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic2_k0_content'
                    }, {
                        field: 'topic2.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic2_k2_content'
                    }, {
                        field: 'topic2.k1.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic2_k1_content'
                    },
                    //     {
                    //     field: 'topic2.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic2_k3_content'
                    // },
                        {
                        field: 'topic3.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k1_content'
                    }, {
                        field: 'topic3.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k2_content'
                    }, {
                        field: 'topic3.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k0_content'
                    },
                    //     {
                    //     field: 'topic3.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 80,
                    //     event: 'abnormal',
                    //     templet: '#topic3_k3_content'
                    // },
                        {
                        field: 'topic4.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k1_content'
                    }, {
                        field: 'topic4.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k2_content'
                    }, {
                        field: 'topic4.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k0_content'
                    },
                    //     {
                    //     field: 'topic4.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 80,
                    //     event: 'abnormal',
                    //     templet: '#topic4_k3_content'
                    // },
                        {
                        field: 'topic5.k1.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic5_k1_content'
                    }, {
                        field: 'topic5.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic5_k2_content'
                    }, {
                        field: 'topic5.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic5_k0_content'
                    }, {
                        field: 'topic6.k1.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic6_k1_content'
                    }, {
                        field: 'topic6.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic6_k2_content'
                    }, {
                        field: 'topic6.k0.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic6_k0_content'
                    }
                    // , {
                    //     field: 'topic6.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic6_k3_content'
                    // }
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
                },
                page: true,
                limit: 20,
                limits: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                done: function () {
                    $('td[data-field="topic1"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic1"]').css('padding', 0);
                    $('td[data-field="topic2"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic2"]').css('padding', 0);
                    $('td[data-field="topic3"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic3"]').css('padding', 0);
                    $('td[data-field="topic4"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic4"]').css('padding', 0);
                    $('td[data-field="topic5"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic5"]').css('padding', 0);
                    $('td[data-field="topic6"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic6"]').css('padding', 0);
                    $('td[data-field="topic7"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic7"]').css('padding', 0);
                    //回调函数,处理表格选择框所在单元样式问题
                    $.each($('#comment-analyze-check').next().children('.layui-table-box').children('.layui-table-body').children('table').children('tbody').children('tr'), function () {
                        $('#comment-analyze-check').next().children('.layui-table-box').children('.layui-table-fixed').children('.layui-table-body').children('table').children('tbody').children('tr[data-index="' + this.dataset.index + '"]').height($(this).height());
                    });
                    handleTopicBackGround();
                    // //动态监听表头高度变化，冻结行跟着改变高度
                    // $(".layui-table-header  tr").resize(function () {
                    //     $(".layui-table-header  tr").each(function (index, val) {
                    //         $($(".layui-table-fixed .layui-table-header table tr")[index]).height($(val).height());
                    //     });
                    // });
                    // //初始化高度，使得冻结行表头高度一致
                    // $(".layui-table-header  tr").each(function (index, val) {
                    //     $($(".layui-table-fixed .layui-table-header table tr")[index]).height($(val).height());
                    // });
                    // //动态监听表体高度变化，冻结行跟着改变高度
                    // $(".layui-table-body  tr").resize(function () {
                    //     $(".layui-table-body  tr").each(function (index, val) {
                    //         $($(".layui-table-fixed .layui-table-body table tr")[index]).height($(val).height());
                    //     });
                    // });
                    // //初始化高度，使得冻结行表体高度一致
                    // $(".layui-table-body  tr").each(function (index, val) {
                    //     $($(".layui-table-fixed .layui-table-body table tr")[index]).height($(val).height());
                    // });
                    $('th[data-field="0"]').css('height', '77px');
                    $('th[data-field="0"]').siblings('th').css('height', '77px');
                    $('th[data-field="alter_time"]').css('height', '38px');
                    $('th[data-field="alter_time"]').siblings('th').css('height', '38px');
                },
                where: {
                    is_audit: 1
                },

            });
            table.on('row(comment-analyze-check)', function(obj){
                $(".layui-table-body tr ").removeClass('tr-bj');//其他tr恢复原样
                console.log(obj.tr) //得到当前点击的tr
                $(obj.tr).addClass('tr-bj');//改变当前tr颜色
            });
        } else if (data.index == 3) {
            //发送请求获取执行人id
            view.request({
                url: 'comment/getAnalyzeUser',
                auth: true,
                type: 'get',
                success: function (e) {
                    if (e.success) {
                        $('.comment-already-user-option').remove();
                        $.each(e.data, function () {
                            $('select[name="comment_already_user"]').append('<option class="comment-already-user-option" value="' + this.id + '">' + this.nickname + '</option>');
                        })
                        form.render();
                    }
                }
            });
            //菜单管理
            pending_tableIns = table.render({
                elem: '#comment-analyze-check-pending',
                url: setter.api_host + 'comment/getAnalyzeList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName] //模拟接口
                ,
                height: view.getTableHeight(90),
                cols: [
                    [
                        {type: 'checkbox', rowspan: 2, fixed: 'left'},
                        {field: 'title',title: '物品名称', rowspan: 2, width: 100, fixed: 'left',align: 'center'},
                        {field: 'good_type', title: 'NLP维度', rowspan: 2, width: 100, fixed: 'left',align: 'center'},
                        {
                        field: 'content',
                        title: '点评内容',
                        rowspan: 2,
                        width: 500, fixed: 'left'
                    }, {field: 'alter_time', title: '操作时间', rowspan: 2, width: 200, align: 'center', sort: true}, {
                        field: '',
                        title: '使用效果',
                        colspan: 3,
                        align: 'center',
                        width: 433,
                    }, {
                        field: '',
                        title: '性价比',
                        align: 'center',
                        width: 450,
                        colspan: 3
                    }, {
                        field: '',
                        title: '宝宝接受度',
                        colspan: 3,
                        align: 'center',
                        width: 403,
                    }, {
                        field: '',
                        title: '外观',
                        colspan: 3,
                        align: 'center',
                        width: 361,
                    }, {
                        field: '',
                        title: '口味怎么样？',
                        colspan: 3,
                        align: 'center',
                        width: 347,
                    }, {
                        field: '',
                        title: '是否有异味？',
                        colspan: 3,
                        align: 'center',
                        width: 376,
                    }, {
                        field: '',
                        title: '安全性',
                        colspan: 3,
                        align: 'center',
                        width: 403,
                    }, {
                        field: 'nickname',
                        title: '执行人',
                        rowspan: 2,
                        align: 'center'
                    }, {
                        field: 'comment_id',
                        title: '编号',
                        rowspan: 2,
                        width: 100,
                        align: 'center'
                    }, {field: 'create_time', title: '分析时间', rowspan: 2, width: 200, align: 'center', sort: true}, {
                        title: '操作',
                        rowspan: 2,
                        width: 200,
                        align: 'center',
                        toolbar: '#btn-comment-check-pending',
                    } //这里的toolbar值是模板元素的选择器
                    ],
                    [{
                        field: 'topic7.k0.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic7_k0_content'
                    }, {
                        field: 'topic7.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic7_k2_content'
                    }, {
                        field: 'topic7.k1.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic7_k1_content'
                    },
                    //     {
                    //     field: 'topic7.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic7_k3_content'
                    // },
                        {
                        field: 'topic1.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k1_content'
                    }, {
                        field: 'topic1.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k2_content'
                    }, {
                        field: '',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k0_content'
                    }, {
                        field: 'topic2.k0.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic2_k0_content'
                    }, {
                        field: 'topic2.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic2_k2_content'
                    }, {
                        field: 'topic2.k1.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic2_k1_content'
                    },
                    //     {
                    //     field: 'topic2.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic2_k3_content'
                    // },
                        {
                        field: 'topic3.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k1_content'
                    }, {
                        field: 'topic3.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k2_content'
                    }, {
                        field: 'topic3.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k0_content'
                    },
                    //     {
                    //     field: 'topic3.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 80,
                    //     event: 'abnormal',
                    //     templet: '#topic3_k3_content'
                    // },
                        {
                        field: 'topic4.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k1_content'
                    }, {
                        field: 'topic4.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k2_content'
                    }, {
                        field: 'topic4.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k0_content'
                    },
                    //     {
                    //     field: 'topic4.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 80,
                    //     event: 'abnormal',
                    //     templet: '#topic4_k3_content'
                    // },
                        {
                        field: 'topic5.k1.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic5_k1_content'
                    }, {
                        field: 'topic5.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic5_k2_content'
                    }, {
                        field: 'topic5.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic5_k0_content'
                    }, {
                        field: 'topic6.k1.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic6_k1_content'
                    }, {
                        field: 'topic6.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic6_k2_content'
                    }, {
                        field: 'topic6.k0.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic6_k0_content'
                    }
                    // , {
                    //     field: 'topic6.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic6_k3_content'
                    // }
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
                },
                page: true,
                limit: 20,
                limits: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                done: function () {
                    $('td[data-field="topic1"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic1"]').css('padding', 0);
                    $('td[data-field="topic2"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic2"]').css('padding', 0);
                    $('td[data-field="topic3"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic3"]').css('padding', 0);
                    $('td[data-field="topic4"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic4"]').css('padding', 0);
                    $('td[data-field="topic5"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic5"]').css('padding', 0);
                    $('td[data-field="topic6"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic6"]').css('padding', 0);
                    $('td[data-field="topic7"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic7"]').css('padding', 0);
                    //回调函数, 处理表格选择框所在单元样式问题
                    $.each($('#comment-analyze-check-pending').next().children('.layui-table-box').children('.layui-table-body').children('table').children('tbody').children('tr'), function () {
                        $('#comment-analyze-check-pending').next().children('.layui-table-box').children('.layui-table-fixed').children('.layui-table-body').children('table').children('tbody').children('tr[data-index="' + this.dataset.index + '"]').height($(this).height());
                    });
                    handleTopicBackGround();
                    $('th[data-field="0"]').css('height', '77px');
                    $('th[data-field="0"]').siblings('th').css('height', '77px');
                    $('th[data-field="alter_time"]').css('height', '38px');
                    $('th[data-field="alter_time"]').siblings('th').css('height', '38px');
                },
                where: {
                    is_audit: 2,
                    is_handle: form.val('commentFilterForm-dsh').is_handle,
                }
            });
            table.on('row(comment-analyze-check-pending)', function(obj){
                $(".layui-table-body tr ").removeClass('tr-bj');//其他tr恢复原样
                console.log(obj.tr) //得到当前点击的tr
                $(obj.tr).addClass('tr-bj');//改变当前tr颜色
            });
            //监听标注异常单选框事件
            form.on('checkbox(is_handle)', function (e) {
                let config = pending_tableIns.config;
                config['where']['is_handle'] = form.val('commentFilterForm-dsh').is_handle;
                table.render(config);
                form.render();
            });
        } else if (data.index == 5) {
            //菜单管理
            yes_tableIns = table.render({
                elem: '#comment-analyze-yes',
                url: setter.api_host + 'comment/getAnalyzeList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName] //模拟接口
                ,
                height: view.getTableHeight(90),
                cols: [
                    [
                        {type: 'checkbox', rowspan: 2, fixed: 'left'},
                        {field: 'title',title: '物品名称', rowspan: 2, width: 100, fixed: 'left',align: 'center'},
                        {field: 'good_type', title: 'NLP维度', rowspan: 2, width: 100, fixed: 'left',align: 'center'},
                        {
                        field: 'content',
                        title: '点评内容',
                        rowspan: 2,
                        width: 500, fixed: 'left'
                    }, {field: 'alter_time', title: '审核时间', rowspan: 2, width: 200, align: 'center'}, {
                        field: '',
                        title: '使用效果',
                        colspan: 3,
                        align: 'center',
                        width: 433,
                    }, {
                        field: '',
                        title: '性价比',
                        align: 'center',
                        width: 450,
                        colspan: 3
                    }, {
                        field: '',
                        title: '宝宝接受度',
                        colspan: 3,
                        align: 'center',
                        width: 403,
                    }, {
                        field: '',
                        title: '外观',
                        colspan: 3,
                        align: 'center',
                        width: 361,
                    }, {
                        field: '',
                        title: '口味怎么样？',
                        colspan: 3,
                        align: 'center',
                        width: 347,
                    }, {
                        field: '',
                        title: '是否有异味？',
                        colspan: 3,
                        align: 'center',
                        width: 376,
                    }, {
                        field: '',
                        title: '安全性',
                        colspan: 3,
                        align: 'center',
                        width: 403,
                    }, {
                        field: 'comment_id',
                        title: '编号',
                        rowspan: 2,
                        width: 100,
                        align: 'center'
                    },  {field: 'create_time', title: '分析时间', rowspan: 2, width: 200, align: 'center'}
                    ],
                    [{
                        field: 'topic7.k0.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic7_k0_content'
                    }, {
                        field: 'topic7.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic7_k2_content'
                    }, {
                        field: 'topic7.k1.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic7_k1_content'
                    },
                    //     {
                    //     field: 'topic7.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic7_k3_content'
                    // },
                        {
                        field: 'topic1.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k1_content'
                    }, {
                        field: 'topic1.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k2_content'
                    }, {
                        field: '',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k0_content'
                    }, {
                        field: 'topic2.k0.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic2_k0_content'
                    }, {
                        field: 'topic2.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic2_k2_content'
                    }, {
                        field: 'topic2.k1.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic2_k1_content'
                    },
                    //     {
                    //     field: 'topic2.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic2_k3_content'
                    // },
                        {
                        field: 'topic3.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k1_content'
                    }, {
                        field: 'topic3.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k2_content'
                    }, {
                        field: 'topic3.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k0_content'
                    },
                    //     {
                    //     field: 'topic3.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 80,
                    //     event: 'abnormal',
                    //     templet: '#topic3_k3_content'
                    // },
                        {
                        field: 'topic4.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k1_content'
                    }, {
                        field: 'topic4.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k2_content'
                    }, {
                        field: 'topic4.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k0_content'
                    },
                    //     {
                    //     field: 'topic4.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 80,
                    //     event: 'abnormal',
                    //     templet: '#topic4_k3_content'
                    // },
                        {
                        field: 'topic5.k1.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic5_k1_content'
                    }, {
                        field: 'topic5.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic5_k2_content'
                    }, {
                        field: 'topic5.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic5_k0_content'
                    }, {
                        field: 'topic6.k1.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic6_k1_content'
                    }, {
                        field: 'topic6.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic6_k2_content'
                    }, {
                        field: 'topic6.k0.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic6_k0_content'
                    }
                    // , {
                    //     field: 'topic6.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic6_k3_content'
                    // }
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
                },
                page: true,
                limit: 20,
                limits: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                done: function () {
                    $('td[data-field="topic1"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic1"]').css('padding', 0);
                    $('td[data-field="topic2"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic2"]').css('padding', 0);
                    $('td[data-field="topic3"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic3"]').css('padding', 0);
                    $('td[data-field="topic4"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic4"]').css('padding', 0);
                    $('td[data-field="topic5"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic5"]').css('padding', 0);
                    $('td[data-field="topic6"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic6"]').css('padding', 0);
                    $('td[data-field="topic7"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic7"]').css('padding', 0);
                    //回调函数,处理表格选择框所在单元样式问题
                    $.each($('#comment-analyze-yes').next().children('.layui-table-box').children('.layui-table-body').children('table').children('tbody').children('tr'), function () {
                        $('#comment-analyze-yes').next().children('.layui-table-box').children('.layui-table-fixed').children('.layui-table-body').children('table').children('tbody').children('tr[data-index="' + this.dataset.index + '"]').height($(this).height());
                    });
                    handleTopicBackGround();
                },
                where: {
                    is_audit: 3,
                    status: 1
                }
            });
            table.on('row(comment-analyze-yes)', function(obj){
                $(".layui-table-body tr ").removeClass('tr-bj');//其他tr恢复原样
                console.log(obj.tr) //得到当前点击的tr
                $(obj.tr).addClass('tr-bj');//改变当前tr颜色
            });
        }  else if (data.index == 6) {
            //菜单管理
            table.render({
                elem: '#comment-analyze-check-pass',
                url: setter.api_host + 'comment/commentAnalyze/getCheckList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName] //模拟接口
                ,
                height: view.getTableHeight(90),
                cols: [
                    [
                        {field: 'title',title: '物品名称', rowspan: 2, width: 100, fixed: 'left',align: 'center'},
                        {field: 'good_type', title: 'NLP维度', rowspan: 2, width: 100, fixed: 'left',align: 'center'},
                        // {type: 'checkbox', rowspan: 2, fixed: 'left'},
                        {
                        field: 'content',
                        title: '点评内容',
                        rowspan: 2,
                        width: 500, fixed: 'left'
                    }, {
                        field: '',
                        title: '使用效果',
                        colspan: 3,
                        align: 'center',
                        width: 433,
                    }, {
                        field: '',
                        title: '性价比',
                        align: 'center',
                        width: 450,
                        colspan: 3
                    }, {
                        field: '',
                        title: '宝宝接受度',
                        colspan: 3,
                        align: 'center',
                        width: 403,
                    }, {
                        field: '',
                        title: '外观',
                        colspan: 3,
                        align: 'center',
                        width: 361,
                    }, {
                        field: '',
                        title: '口味怎么样？',
                        colspan: 3,
                        align: 'center',
                        width: 347,
                    }, {
                        field: '',
                        title: '是否有异味？',
                        colspan: 3,
                        align: 'center',
                        width: 376,
                    }, {
                        field: '',
                        title: '安全性',
                        colspan: 3,
                        align: 'center',
                        width: 403,
                    }, {
                        field: 'comment_id',
                        title: '编号',
                        rowspan: 2,
                        width: 100,
                        align: 'center'
                    }, {field: 'create_time', title: '分析时间', rowspan: 2, width: 200, align: 'center'}
                    ], [{
                        field: 'topic7.k0.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic7_k0_content'
                    }, {
                        field: 'topic7.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic7_k2_content'
                    }, {
                        field: 'topic7.k1.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic7_k1_content'
                    },
                    //     {
                    //     field: 'topic7.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic7_k3_content'
                    // },
                        {
                        field: 'topic1.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k1_content'
                    }, {
                        field: 'topic1.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k2_content'
                    }, {
                        field: 'topic1.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k0_content'
                    },  {
                        field: 'topic2.k0.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic2_k0_content'
                    }, {
                        field: 'topic2.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic2_k2_content'
                    }, {
                        field: 'topic2.k1.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic2_k1_content'
                    },
                    //     {
                    //     field: 'topic2.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic2_k3_content'
                    // },
                        {
                        field: 'topic3.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k1_content'
                    }, {
                        field: 'topic3.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k2_content'
                    }, {
                        field: 'topic3.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k0_content'
                    },
                    //     {
                    //     field: 'topic3.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 80,
                    //     event: 'abnormal',
                    //     templet: '#topic3_k3_content'
                    // },
                        {
                        field: 'topic4.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k1_content'
                    }, {
                        field: 'topic4.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k2_content'
                    }, {
                        field: 'topic4.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k0_content'
                    },
                    //     {
                    //     field: 'topic4.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 80,
                    //     event: 'abnormal',
                    //     templet: '#topic4_k3_content'
                    // },
                        {
                        field: 'topic5.k1.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic5_k1_content'
                    }, {
                        field: 'topic5.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic5_k2_content'
                    }, {
                        field: 'topic5.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic5_k0_content'
                    }, {
                        field: 'topic6.k1.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic6_k1_content'
                    }, {
                        field: 'topic6.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic6_k2_content'
                    }, {
                        field: 'topic6.k0.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic6_k0_content'
                    }
                    // , {
                    //     field: 'topic6.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic6_k3_content'
                    // }
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
                },
                page: true,
                limit: 20,
                limits: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                done: function () {
                    $('td[data-field="topic1"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic1"]').css('padding', 0);
                    $('td[data-field="topic2"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic2"]').css('padding', 0);
                    $('td[data-field="topic3"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic3"]').css('padding', 0);
                    $('td[data-field="topic4"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic4"]').css('padding', 0);
                    $('td[data-field="topic5"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic5"]').css('padding', 0);
                    $('td[data-field="topic6"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic6"]').css('padding', 0);
                    $('td[data-field="topic7"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic7"]').css('padding', 0);
                    //回调函数,处理表格选择框所在单元样式问题
                    $.each($('#comment-analyze-yes').next().children('.layui-table-box').children('.layui-table-body').children('table').children('tbody').children('tr'), function () {
                        $('#comment-analyze-yes').next().children('.layui-table-box').children('.layui-table-fixed').children('.layui-table-body').children('table').children('tbody').children('tr[data-index="' + this.dataset.index + '"]').height($(this).height());
                    });
                    handleTopicBackGround();
                },
                where: {
                    is_audit: 2
                }
            });
            table.on('row(comment-analyze-check-pass)', function(obj){
                $(".layui-table-body tr ").removeClass('tr-bj');//其他tr恢复原样
                console.log(obj.tr) //得到当前点击的tr
                $(obj.tr).addClass('tr-bj');//改变当前tr颜色
            });
        }else if (data.index == 7) {
            //菜单管理
            table.render({
                elem: '#comment-analyze-check-no-pass',
                url: setter.api_host + 'comment/commentAnalyze/getCheckList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName] //模拟接口
                ,
                height: view.getTableHeight(90),
                cols: [
                    [
                        // {type: 'checkbox', rowspan: 2, fixed: 'left'},
                        {field: 'title',title: '物品名称', rowspan: 2, width: 100, fixed: 'left',align: 'center'},
                        {field: 'good_type', title: 'NLP维度', rowspan: 2, width: 100, fixed: 'left',align: 'center'},
                        {
                        field: 'content',
                        title: '点评内容',
                        rowspan: 2,
                        width: 500, fixed: 'left'
                    }, {
                        field: '',
                        title: '使用效果',
                        colspan: 3,
                        align: 'center',
                        width: 433,
                    }, {
                        field: '',
                        title: '性价比',
                        align: 'center',
                        width: 450,
                        colspan: 3
                    }, {
                        field: '',
                        title: '宝宝接受度',
                        colspan: 3,
                        align: 'center',
                        width: 403,
                    }, {
                        field: '',
                        title: '外观',
                        colspan: 3,
                        align: 'center',
                        width: 361,
                    }, {
                        field: '',
                        title: '口味怎么样？',
                        colspan: 3,
                        align: 'center',
                        width: 347,
                    }, {
                        field: '',
                        title: '是否有异味？',
                        colspan: 3,
                        align: 'center',
                        width: 376,
                    }, {
                        field: '',
                        title: '安全性',
                        colspan: 3,
                        align: 'center',
                        width: 403,
                    }, {
                        field: 'comment_id',
                        title: '编号',
                        rowspan: 2,
                        width: 100,
                        align: 'center'
                    }, {field: 'create_time', title: '分析时间', rowspan: 2, width: 200, align: 'center'},
                        {

                            title: '操作',
                            rowspan: 2,
                            width: 150,
                            align: 'center',
                            toolbar: '#btn-comment-check'
                        }
                    ], [{
                        field: 'topic7.k0.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic7_k0_content'
                    }, {
                        field: 'topic7.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic7_k2_content'
                    }, {
                        field: 'topic7.k1.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic7_k1_content'
                    },
                    //     {
                    //     field: 'topic7.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic7_k3_content'
                    // },
                        {
                        field: 'topic1.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k1_content'
                    }, {
                        field: 'topic1.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k2_content'
                    }, {
                        field: 'topic1.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k0_content'
                    }, {
                        field: 'topic2.k0.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic2_k0_content'
                    }, {
                        field: 'topic2.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic2_k2_content'
                    }, {
                        field: 'topic2.k1.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic2_k1_content'
                    },
                    //     {
                    //     field: 'topic2.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic2_k3_content'
                    // },
                        {
                        field: 'topic3.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k1_content'
                    }, {
                        field: 'topic3.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k2_content'
                    }, {
                        field: 'topic3.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k0_content'
                    },
                    //     {
                    //     field: 'topic3.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 80,
                    //     event: 'abnormal',
                    //     templet: '#topic3_k3_content'
                    // },
                        {
                        field: 'topic4.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k1_content'
                    }, {
                        field: 'topic4.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k2_content'
                    }, {
                        field: 'topic4.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k0_content'
                    },
                    //     {
                    //     field: 'topic4.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 80,
                    //     event: 'abnormal',
                    //     templet: '#topic4_k3_content'
                    // },
                        {
                        field: 'topic5.k1.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic5_k1_content'
                    }, {
                        field: 'topic5.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic5_k2_content'
                    }, {
                        field: 'topic5.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic5_k0_content'
                    }, {
                        field: 'topic6.k1.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic6_k1_content'
                    }, {
                        field: 'topic6.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic6_k2_content'
                    }, {
                        field: 'topic6.k0.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic6_k0_content'
                    }
                    // , {
                    //     field: 'topic6.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic6_k3_content'
                    // }
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
                },
                page: true,
                limit: 20,
                limits: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                done: function () {
                    $('td[data-field="topic1"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic1"]').css('padding', 0);
                    $('td[data-field="topic2"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic2"]').css('padding', 0);
                    $('td[data-field="topic3"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic3"]').css('padding', 0);
                    $('td[data-field="topic4"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic4"]').css('padding', 0);
                    $('td[data-field="topic5"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic5"]').css('padding', 0);
                    $('td[data-field="topic6"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic6"]').css('padding', 0);
                    $('td[data-field="topic7"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic7"]').css('padding', 0);
                    //回调函数,处理表格选择框所在单元样式问题
                    $.each($('#comment-analyze-yes').next().children('.layui-table-box').children('.layui-table-body').children('table').children('tbody').children('tr'), function () {
                        $('#comment-analyze-yes').next().children('.layui-table-box').children('.layui-table-fixed').children('.layui-table-body').children('table').children('tbody').children('tr[data-index="' + this.dataset.index + '"]').height($(this).height());
                    });
                    handleTopicBackGround();
                },
                where: {
                    is_audit: 4
                }
            });
            table.on('row(comment-analyze-check-no-pass)', function(obj){
                $(".layui-table-body tr ").removeClass('tr-bj');//其他tr恢复原样
                console.log(obj.tr) //得到当前点击的tr
                $(obj.tr).addClass('tr-bj');//改变当前tr颜色
            });
        } else if (data.index == 8) {//全部点评
            //菜单管理
            tableIns = table.render({
                elem: '#comment-all',
                url: setter.api_host + 'comment/getList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName] //模拟接口
                ,
                height: view.getTableHeight(90),
                cols: [
                    [
                        {type: 'checkbox', fixed: 'left'},
                        {field: 'title',title: '物品名称', rowspan: 2, width: 100, fixed: 'left',align: 'center'},
                        {field: 'good_type', title: 'NLP维度', rowspan: 2, width: 100, fixed: 'left',align: 'center'},
                        {
                        field: 'content',
                        title: '点评内容',
                        width: 700,
                        templet: '#content'
                    }, {field: 'create_time', title: '建立时间', width: 150, align: 'center'}, {
                        field: 'id',
                        title: '编号',
                        width: 150,
                        align: 'center'
                    }, {

                        title: '操作',
                        rowspan: 2,
                        width: 150,
                        align: 'center',
                        toolbar: '#btn-comment-list-del'
                    }
                    ]
                ],
                text: {none: '暂无数据'},
                parseData: function (res) {
                    return {
                        "code": res.code, //解析接口状态
                        "msg": res.msg, //解析提示文本
                        'count': res.data.count, //解析数据长度
                        "data": res.data.data, //解析数据列表
                        "option": res.data.option
                    }
                },
                page: true,
                limit: 20,
                limits: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                // limits: [100, 200, 300],
                done: function (res) {
                    $('a[lay-filter="back-result-list"]')[0].dataset.option = res.option;
                    //回调函数,处理表格选择框所在单元样式问题
                    $.each($('#comment-all').next().children('.layui-table-box').children('.layui-table-body').children('table').children('tbody').children('tr'), function () {
                        $('#comment-all').next().children('.layui-table-box').children('.layui-table-fixed').children('.layui-table-body').children('table').children('tbody').children('tr[data-index="' + this.dataset.index + '"]').height($(this).height());
                    });
                }
            });
        } else if (data.index == 9) {
            //菜单管理
            no_pass_tableIns = table.render({
                elem: '#comment-analyze-check-no-pass',
                url: setter.api_host + 'comment/commentAnalyze/getCheckList?access_token=' + layui.data(setter.tableName)[setter.request.tokenName] //模拟接口
                ,
                height: view.getTableHeight(90),
                cols: [
                    [
                        {type: 'checkbox', rowspan: 2, fixed: 'left'}, {
                        field: 'content',
                        title: '点评内容',
                        rowspan: 2,
                        width: 700, fixed: 'left'
                    }, {
                        field: '',
                        title: '使用效果',
                        colspan: 3,
                        align: 'center',
                        width: 433,
                    }, {
                        field: '',
                        title: '性价比',
                        align: 'center',
                        width: 450,
                        colspan: 3
                    }, {
                        field: '',
                        title: '宝宝接受度',
                        colspan: 3,
                        align: 'center',
                        width: 403,
                    }, {
                        field: '',
                        title: '外观',
                        colspan: 3,
                        align: 'center',
                        width: 361,
                    }, {
                        field: '',
                        title: '口味怎么样？',
                        colspan: 3,
                        align: 'center',
                        width: 347,
                    }, {
                        field: '',
                        title: '是否有异味？',
                        colspan: 3,
                        align: 'center',
                        width: 376,
                    }, {
                        field: '',
                        title: '安全性',
                        colspan: 3,
                        align: 'center',
                        width: 403,
                    }, {
                        field: 'comment_id',
                        title: '编号',
                        rowspan: 2,
                        width: 100,
                        align: 'center'
                    }, {field: 'create_time', title: '分析时间', rowspan: 2, width: 200, align: 'center'}, {

                        title: '操作',
                        rowspan: 2,
                        width: 150,
                        align: 'center',
                        toolbar: '#btn-comment-check'
                    }
                    ], [{
                        field: 'topic7.k0.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic7_k0_content'
                    }, {
                        field: 'topic7.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic7_k2_content'
                    }, {
                        field: 'topic7.k1.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic7_k1_content'
                    },
                    //     {
                    //     field: 'topic7.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic7_k3_content'
                    // },
                        {
                        field: 'topic1.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k1_content'
                    }, {
                        field: 'topic1.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k2_content'
                    }, {
                        field: 'topic1.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic1_k0_content'
                    }, {
                        field: 'topic2.k0.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic2_k0_content'
                    }, {
                        field: 'topic2.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic2_k2_content'
                    }, {
                        field: 'topic2.k1.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic2_k1_content'
                    },
                    //     {
                    //     field: 'topic2.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic2_k3_content'
                    // },
                        {
                        field: 'topic3.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k1_content'
                    }, {
                        field: 'topic3.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k2_content'
                    }, {
                        field: 'topic3.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic3_k0_content'
                    },
                    //     {
                    //     field: 'topic3.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 80,
                    //     event: 'abnormal',
                    //     templet: '#topic3_k3_content'
                    // },
                        {
                        field: 'topic4.k1.num',
                        title: '正',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k1_content'
                    }, {
                        field: 'topic4.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k2_content'
                    }, {
                        field: 'topic4.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic4_k0_content'
                    },
                    //     {
                    //     field: 'topic4.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 80,
                    //     event: 'abnormal',
                    //     templet: '#topic4_k3_content'
                    // },
                        {
                        field: 'topic5.k1.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic5_k1_content'
                    }, {
                        field: 'topic5.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic5_k2_content'
                    }, {
                        field: 'topic5.k0.num',
                        title: '负',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic5_k0_content'
                    }, {
                        field: 'topic6.k1.num',
                        title: '正',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic6_k1_content'
                    }, {
                        field: 'topic6.k2.num',
                        title: '未提及',
                        align: 'center',
                        width: 80,
                        event: 'abnormal',
                        templet: '#topic6_k2_content'
                    }, {
                        field: 'topic6.k0.num',
                        title: '负',
                        align: 'center',
                        width: 100,
                        event: 'abnormal',
                        templet: '#topic6_k0_content'
                    }
                    // , {
                    //     field: 'topic6.k3.num',
                    //     title: '中',
                    //     align: 'center',
                    //     width: 100,
                    //     event: 'abnormal',
                    //     templet: '#topic6_k3_content'
                    // }
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
                },
                page: true,
                limit: 20,
                limits: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                done: function () {
                    $('td[data-field="topic1"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic1"]').css('padding', 0);
                    $('td[data-field="topic2"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic2"]').css('padding', 0);
                    $('td[data-field="topic3"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic3"]').css('padding', 0);
                    $('td[data-field="topic4"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic4"]').css('padding', 0);
                    $('td[data-field="topic5"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic5"]').css('padding', 0);
                    $('td[data-field="topic6"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic6"]').css('padding', 0);
                    $('td[data-field="topic7"] .layui-table-cell').css('padding', '0');
                    $('td[data-field="topic7"]').css('padding', 0);
                    //回调函数,处理表格选择框所在单元样式问题
                    $.each($('#comment-analyze-yes').next().children('.layui-table-box').children('.layui-table-body').children('table').children('tbody').children('tr'), function () {
                        $('#comment-analyze-yes').next().children('.layui-table-box').children('.layui-table-fixed').children('.layui-table-body').children('table').children('tbody').children('tr[data-index="' + this.dataset.index + '"]').height($(this).height());
                    });
                    handleTopicBackGround();
                },
                where: {
                    is_audit: 4
                }
            });
        }
    });
    //内容过滤词维护按钮点击事件
    form.on('submit(filter-keyword-mange)', function () {
        //获取tab选项参数
        view.request({
            url: 'comment/getFiltrationKeyWord',
            type: 'get',
            auth: true,
            data: {type: $('.layui-tab-title .layui-this')[0].dataset.filter},
            success: function (e) {
                if (e.success) {
                    //清空原有数据
                    $.each($('.filter-word-manage-content-input li'), function (k, v) {
                        $(this).remove();
                    });
                    //循环写入获取到的数据
                    $.each(e.data, function (k, v) {
                        $('.filter-word-manage-content-input').append('<li><input name="filter[' + getRandNum() + ']" value="' + this.word + '" type="text" placeholder="请输入过滤词,按回车键添加新词"><a lay-submit lay-filter="filter_word_num" class="filter-word-input-num" data-id="' + this.id + '">(' + this.num + ')</a><img src="' + setter.static_host + '/images/web/close_1.png' + '" lay-submit lay-filter="close-filter-word-input" class="filter-word-input-close"></li>')
                    });
                    if (e.data.length == 0) {
                        $('.filter-word-manage-content-input').append('<li><input name="filter[' + getRandNum() + ']" value="" type="text" placeholder="请输入过滤词,按回车键添加新词"><img src="' + setter.static_host + '/images/web/close_1.png' + '" lay-submit lay-filter="close-filter-word-input" class="filter-word-input-close"></li>')
                    }
                    asyncFilterWordNum();
                    $('.filter-word-manage').animate({right: '0px'});
                }
            }
        })
    });
    // element.tabChange('comment', 'down')
    let id_flag =0;
    setTimeout(function () {
        $.each($('*[ht-auth]'), function () {
            var id = $(this).attr('ht-id')
            if(id=='72'&&id_flag==0){
                var display =$(this).css('display');
                if(display == 'none'){
                    id_flag =1;
                    console.log('datacheck');
                    element.tabChange('comment', 'datacheck')
                }else{
                    id_flag =1;
                    console.log('down');
                    console.log(typeof product_id);
                    console.log(product_id);
                    if(product_id !=""){
                        element.tabChange('comment', 'yfx')
                    }else{
                        element.tabChange('comment', 'down')
                    }

                }
            }
        })
    },1000);
    //同步过滤词编号
    function asyncFilterWordNum() {
        var num = $('.filter-word-manage-content-input li').length;
        //清空原有编号数字
        $('.filter-word-manage-content-num li').remove();
        for (var i = 0; i < num; i++) {
            $('.filter-word-manage-content-num').append('<li>' + (i + 1) + '</li>');
        }
    }

    $(document).off('keypress').on('keypress', '.filter-word-manage-content-input li input', function (e) {
        if (e.keyCode === 13) {
            $(this).parent().after('<li><input name="filter[' + getRandNum() + ']" type="text" placeholder="请输入过滤词,按回车键添加新词"><img src="' + setter.static_host + '/images/web/close_1.png' + '" lay-submit lay-filter="close-filter-word-input" class="filter-word-input-close"></li>');
            asyncFilterWordNum();
            $(this).parent().next().children('input').focus();
        }
    });
    $(document).on('mouseover', '.filter-word-manage-content-input li', function () {
        $(this).children('.filter-word-input-close').show();
    });
    $(document).on('mouseout', '.filter-word-manage-content-input li', function () {
        $(this).children('.filter-word-input-close').hide();
    });
    form.on('submit(close-filter-word-input)', function () {
        if ($('.filter-word-manage-content-input li').length === 1) {
            $(this).siblings('input').val('');
            return false;
        }
        ;
        $(this).parent().prev().children('input').focus();
        $(this).parent().remove();
        asyncFilterWordNum();
    });
    form.on('submit(closeall-filter-word-input)', function () {
        //询问框
        layer.confirm('确定要清空过滤词吗？', {
            btn: ['确定', '取消'] //按钮
        }, function (e) {
            layer.close(e);
            $.each($('.filter-word-manage-content-input li'), function (k, v) {
                if (k === 0) {
                    $(this).children('input').val('');
                } else {
                    $(this).remove();
                }
            });
            asyncFilterWordNum();
        });

    });
    form.on('submit(filter-word-cancle)', function () {
        $('.filter-word-manage').animate({right: '-400px'});
    });
    form.on('submit(filter-word-save)', function (data) {
        data.field.type = $('.layui-tab-title .layui-this')[0].dataset.filter;
        //询问框
        layer.confirm('点评过滤词判断是一个很费时间的操作,请谨慎操作,确定还保存吗？', {
            btn: ['确定', '取消'] //按钮
        }, function (e) {
            layer.close(e);
            view.request({
                url: 'comment/updateFiltraKeyword',
                type: 'post',
                auth: true,
                tips: true,
                data: data.field,
                success: function (e) {
                    if (e.success) {
                        $('.filter-word-manage').animate({right: '-400px'});
                    }
                }
            });
        });

    });

    function getRandNum() {
        return Math.floor(Math.random() * 10000);
    }

    form.on('submit(comment-list-analyze-more)', function () {
        var checked = table.checkStatus('comment-no-analysis');
        var data = [];
        $.each(checked.data, function () {
            data.push(this.id);
        })
        view.request({
            url: 'comment/analyze',
            type: 'post',
            auth: true,
            data: {ids: data},
            tips: true,
            success: function (e) {
                if (e.success) {
                    list_tableIns.reload();
                }
            }
        })
    });
    form.on('submit(comment-list-analyze-more-more)', function () {
        view.request({
            url: 'comment/analyzeMore',
            type: 'post',
            auth: true,
            tips: true,
            success: function (e) {
                if (e.success) {
                    list_tableIns.reload();
                }
            }
        })
    });

    form.on('submit(topic-span)', function () {
        var tab_id = $('.layui-tab-title .layui-this')[0].dataset.filter;
        if (tab_id == 4 || tab_id == 7) {
            layer.msg('不允许在此选项卡编辑', {icon: 2, time: 2000});
            return false;
        }
        if ($(this).hasClass('topic-span-abnormal')) {
            $(this).removeClass('topic-span-abnormal');
        } else {
            $(this).addClass('topic-span-abnormal');
        }
    });
    //已分析=》分析正确  分析异常
    form.on('submit(save-abnormal)', function () {
        var id = this.dataset.id;
        var commentid = this.dataset.commentid;
        var span_topics = $('.topic-span[data-id="' + id + '"]');
        var abnormal = [];
        $.each(span_topics, function () {
            if ($(this).hasClass('topic-span-abnormal')) {
                abnormal.push({
                    topic_id: this.dataset.topic,
                    topic_num: this.dataset.num
                });
            }
        });
        if (abnormal.length == 0) {
            // layer.msg('该条分析记录没有被标记为异常的数值', {icon: 2, offset: '15px'});
            // return false;
            view.request({
                url: 'comment/saveCorrectCheck',
                type: 'post',
                data: {id: commentid,is_admin:is_admin},
                auth: true,
                tips: true,
                success: function (e) {
                    if (e.success) {
                        table.reload('comment-already');
                    }
                }
            });
        }else{
            view.request({
                url: 'comment/saveAbnormal',
                type: 'post',
                data: {id: id, data: abnormal},
                auth: true,
                tips: true,
                success: function (e) {
                    if (e.success) {
                        table.reload('comment-already');
                    }
                }
            });
        }
    });
    form.on('submit(comment-analyze-allot)', function () {
        //获取选中行
        var checked = table.checkStatus('comment-already');
        var data = [];
        $.each(checked.data, function () {
            data.push(this.id);
        })
        if (data.length == 0) {
            layer.msg('请选择需要分配的点评', {icon: 2, offset: '15px'});
            return false;
        }
        var uid = $('select[name="comment-already-user"]').val();
        if (uid == 0) {
            layrt.msg('请需要需要分配的执行人', {icon: 2, offset: '15px'});
            return false;
        }
        view.request({
            url: 'comment/commentAnalyzeAllot',
            type: 'post',
            auth: true,
            data: {ids: data, uid: uid},
            tips: true,
            success: function (e) {
                if (e.success) {
                    already_tableIns.reload();
                }
            }
        })
    });
    form.on('submit(save-correct)', function () {
        var id = this.dataset.id;
        //发送请求
        view.request({
            url: 'comment/saveCorrect',
            type: 'post',
            data: {id: id},
            auth: true,
            tips: true,
            success: function (e) {
                if (e.success) {
                    abnormal_tableIns.reload();
                }
            }
        });
    });
    form.on('submit(comment-abnormal-analyze-btn)', function () {
        var data = [];
        //发送请求获取需要分析的点评Id数据
        view.request({
            url: 'comment/getAbnormalCommentAnalyzeCommentId',
            type: 'get',
            auth: true,
            async: false,
            success: function (e) {
                if (e.success) {
                    checked = e.data;
                }
            }
        })

        $.each(checked, function () {
            data.push(this.comment_id);
        });

        view.request({
            url: 'comment/analyze',
            type: 'post',
            auth: true,
            data: {ids: data},
            tips: true,
            success: function (e) {
                if (e.success) {
                    abnormal_tableIns.reload();
                }
            }
        })
    });
    //监听工具条
    table.on('tool(comment-analyze-check)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
        if (layEvent === 'correct') { //查看
            var id = data.id;
            var span_topics = $('.topic-span[data-id="' + id + '"]');
            var abnormal = [];
            $.each(span_topics, function () {
                if ($(this).hasClass('topic-span-abnormal')) {
                    abnormal.push({
                        topic_id: this.dataset.topic,
                        topic_num: this.dataset.num
                    });
                }
            });
            if (abnormal.length > 0) {
                layer.msg('该条分析记录有被标记为异常的数值', {icon: 2, offset: '15px'});
                return false;
            }
            //发送请求
            view.request({
                url: 'comment/saveCorrectCheck',
                type: 'post',
                data: {id: data.comment_id},
                auth: true,
                tips: true,
                success: function (e) {
                    if (e.success) {
                        obj.del();
                    }
                }
            });
        } else if (layEvent === 'save') {
            var id = data.id;
            var span_topics = $('.topic-span[data-id="' + id + '"]');
            var abnormal = [];
            $.each(span_topics, function () {
                if ($(this).hasClass('topic-span-abnormal')) {
                    abnormal.push({
                        topic_id: this.dataset.topic,
                        topic_num: this.dataset.num
                    });
                }
            });
            if (abnormal.length == 0) {
                layer.msg('该条分析记录没有被标记为异常的数值', {icon: 2, offset: '15px'});
                return false;
            }
            view.request({
                url: 'comment/saveAbnormalCheck',
                type: 'post',
                data: {id: id, data: abnormal},
                auth: true,
                tips: true,
                success: function (e) {
                    if (e.success) {
                        obj.del();
                    }
                }
            });
        }
    });

    table.on('tool(comment-analyze-check-no-pass)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
        if (layEvent === 'correct') { //查看
            var id = data.id;
            var span_topics = $('.topic-span[data-id="' + id + '"]');
            var abnormal = [];
            $.each(span_topics, function () {
                if ($(this).hasClass('topic-span-abnormal')) {
                    abnormal.push({
                        topic_id: this.dataset.topic,
                        topic_num: this.dataset.num
                    });
                }
            });
            if (abnormal.length > 0) {
                layer.msg('该条分析记录有被标记为异常的数值', {icon: 2, offset: '15px'});
                return false;
            }
            //发送请求
            view.request({
                url: 'comment/saveCorrectCheck',
                type: 'post',
                data: {id: data.comment_id},
                auth: true,
                tips: true,
                success: function (e) {
                    if (e.success) {
                        obj.del();
                    }
                }
            });
        } else if (layEvent === 'save') {
            var id = data.id;
            var span_topics = $('.topic-span[data-id="' + id + '"]');
            var abnormal = [];
            $.each(span_topics, function () {
                if ($(this).hasClass('topic-span-abnormal')) {
                    abnormal.push({
                        topic_id: this.dataset.topic,
                        topic_num: this.dataset.num
                    });
                }
            });
            if (abnormal.length == 0) {
                layer.msg('该条分析记录没有被标记为异常的数值', {icon: 2, offset: '15px'});
                return false;
            }
            view.request({
                url: 'comment/saveAbnormalCheck',
                type: 'post',
                data: {id: id, data: abnormal},
                auth: true,
                tips: true,
                success: function (e) {
                    if (e.success) {
                        obj.del();
                    }
                }
            });
        }
    });

    form.on('submit(comment-analyze-reject)', function () {
        var id = this.dataset.id;

        view.request({
            url: 'comment/commentAnalyze/Reject',
            type: 'post',
            data: {id: id},
            auth: true,
            tips: true,
            success: function (e) {
                if (e.success) {
                    pending_tableIns.reload();
                }
            }
        })
    });

    function merge(res) {
        var data = res.data;
        var mergeIndex = 0; //定位需要添加合并属性的行数
        var mark = 1; //这里涉及到简单的运算，mark是计算每次需要合并的格子数
        var columsName = ['content']; //需要合并的列名称
        var columsIndex = [3]; //需要合并的列指南值
        console.log('jlhbl');
        for (var k = 0; k < columsName.length; k++) { //这里循环所有要合并的列
            var trArr = $('div[lay-id="comment-analyze-abnormal"] .layui-table-fixed>.layui-table-body>.layui-table').find("tr"); //所有行
            for (var i = 1; i < res.data.length; i++) { //这里循环表格当前的数据
                var tdCurArr = trArr.eq(i).find("td").eq(columsIndex[k]); //获取当前行的当前列
                var tdPreArr = trArr.eq(mergeIndex).find("td").eq(columsIndex[k]); //获取相同列的第一列
                if ((data[i - 1][columsName[k]] !="")&&(data[i][columsName[k]] !="")&&(data[i][columsName[k]] === data[i - 1][columsName[k]])) { //后一行的值与前一行的值做比较，相同就需要合并
                    trArr.eq(i).attr("concon",data[i][columsName[k]]);
                    trArr.eq(i-1).attr("concon",data[i-1][columsName[k]]);
                    mark += 1;
                    tdPreArr.each(function () { //相同列的第一列增加rowspan属性
                        $(this).attr("rowspan", mark);
                    });
                    //操作前面两列开始
                    var tdPreArr1 =trArr.eq(mergeIndex).find("td").eq(1)
                    tdPreArr1.each(function () {
                        $(this).attr("rowspan", mark);
                    });
                    tdPreArr1 =trArr.eq(mergeIndex).find("td").eq(2)
                    tdPreArr1.each(function () {
                        $(this).attr("rowspan", mark);
                    });
                    //操作前面两列结束

                    tdCurArr.each(function () { //当前行隐藏
                        $(this).css("display", "none");
                    });
                    //操作前面两列开始
                    var tdCurArr1 =trArr.eq(i).find("td").eq(1)
                    tdCurArr1.each(function () {
                        $(this).css("display", "none");
                    });
                    tdCurArr1 =trArr.eq(i).find("td").eq(2)
                    tdCurArr1.each(function () {
                      $(this).css("display", "none");
                    });
                    //操作前面两列结束
                } else {
                    mergeIndex = i;
                    mark = 1; //一旦前后两行的值不一样了，那么需要合并的格子数mark就需要重新计算
                }
            }
            mergeIndex = 0;
            mark = 1;
        }
    };
    //题目下拉列表绑定事件
    form.on('select(comment-topic)', function (e) {
        var value = e.value;
        //发送请求获取题目的option项列表数据
        view.request({
            url: 'comment/comment/topic/getOptionList',
            type: 'get',
            data: {topic_id: value},
            auth: true,
            success: function (e) {
                if (e.success) {
                    $('.comment-analyze-topic-option').remove();
                    $.each(e.data, function () {
                        $('select[name="comment-topic-option"]').append('<option class="comment-analyze-topic-option" value="' + this.id + '">' + this.title + '</option>')
                    });
                    form.render();
                }
            }
        })
    });
    form.on('submit(comment-analyze-sort)', function (e) {
        var type = this.dataset.type;

        if ($('select[name="comment-topic"]').val() == 0) {
            layer.msg('请选择题型', {icon: 2, offset: '15px'});
            return false;
        }
        if ($('select[name="comment-topic-option"]').val() == null) {
            layer.msg('请选择题目数据类型', {icon: 2, offset: '15px'});
            return false;
        }
        if ($('input[name="comment-topic-num"]').val() == '') {
            layer.msg('请输入一定的分值上限', {icon: 2, offset: '15px'});
            return false;
        }

        if (type == 'desc') {
            $(this).html('倒序>>');
            this.dataset.type = 'asc';
        } else {
            $(this).html('正序>>');
            this.dataset.type = 'desc';
        }

        already_tableIns.reload({
            where: {
                topic: $('select[name="comment-topic"]').val(),
                option: $('select[name="comment-topic-option"]').val(),
                num: $('input[name="comment-topic-num"]').val(),
                type: type
            }
        });
        return false;
    });
    form.on('submit(comment-analyze-pass)', function () {

    });

    function handleTopicBackGround() {
        var topic_span = $('.topic-span');
        $.each(topic_span, function () {
            var topic = this.dataset.topic;
            if (topic % 2 == 0 || topic == 7) {
                $(this).css('background', '#F3F6FB');
                $(this).parent().parent().css('padding', '0');
                $(this).parent().css('height', $(this).parent().parent().parent().height() + 'px');
                $(this).parent().parent().css('border-color', '#F3F6FB');
                $(this).parent().parent().css('border-top', 'none');
                $(this).parent().parent().css('border-bottom', 'none');
                $(this).parent().css('line-height', $(this).parent().parent().parent().height() + 'px');
            }
        });
    }

    form.on('submit(short-comment)', function () {
        list_tableIns.reload({
            where: {
                status: 3
            }
        })
    });
    table.on('tool(comment-analyze-check-pending)', function (obj) {
        var layEvent = obj.event;
        var data = obj.data;
        if (layEvent == 'pass') {
            var id = data.id;
            var span_topics = $('.topic-span[data-id="' + id + '"]');
            var abnormal = [];
            $.each(span_topics, function () {
                if ($(this).hasClass('topic-span-abnormal')) {
                    abnormal.push({
                        topic_id: this.dataset.topic,
                        topic_num: this.dataset.num
                    });
                }
            });
            if (abnormal.length == 0) {
                CommentAnalyzePass(obj.data.id, 1, obj);
            } else {
                CommentAnalyzePass(obj.data.id, 2, obj);
            }
        } else if (layEvent == 'save') {
            var id = data.id;
            var span_topics = $('.topic-span[data-id="' + id + '"]');
            var abnormal = [];
            $.each(span_topics, function () {
                if ($(this).hasClass('topic-span-abnormal')) {
                    abnormal.push({
                        topic_id: this.dataset.topic,
                        topic_num: this.dataset.num
                    });
                }
            });
            if (abnormal.length == 0) {
                layer.msg('该条分析记录没有被标记为异常的数值', {icon: 2, offset: '15px'});
                return false;
            }
            view.request({
                url: 'comment/saveAbnormalCheck',
                type: 'post',
                data: {id: id, data: abnormal},
                auth: true,
                tips: true,
                success: function (e) {
                    if (e.success) {

                    }
                }
            });
        }
    });
    form.on('submit(comment-analyze-check-pending-btn)', function (data) {
        if(typeof form.val('commentFilterForm-dsh').is_handle == 'undefined'){
            pending_tableIns.reload({
                where: {
                    status: data.field.comment_status,
                    comment_id: data.field.comment_id,
                    uid: data.field.comment_already_user,
                    is_handle: '',
                }
            });
        }else{
            pending_tableIns.reload({
                where: {
                    status: data.field.comment_status,
                    comment_id: data.field.comment_id,
                    uid: data.field.comment_already_user,
                    is_handle: form.val('commentFilterForm-dsh').is_handle,
                }
            });
        }
    });

    function CommentAnalyzePass(id, type, obj) {
        view.request({
            url: 'comment/analyzeCheck/pass',
            type: 'post',
            data: {id: id, type: type},
            auth: true,
            tips: true,
            success: function (e) {
                if (e.success) {
                    layer.closeAll();
                    obj.del();
                }
            }
        });
    }

    form.on('submit(comment-del)', function () {
        var id = this.dataset.id;
        var flag = this.dataset.flag;
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            view.request({
                url: 'comment/del',
                type: 'post',
                data: {id: id},
                auth: true,
                tips: true,
                success: function (e) {
                    if (e.success) {
                        layer.close(index);
                        if(flag=='yfx'){
                            already_tableIns.reload();
                        }else{
                            pending_tableIns.reload();
                            list_tableIns.reload();
                        }
                    }
                }
            })
        })
    })

    form.on('submit(export-json-file)', function () {
        window.open(setter.api_host + 'comment/exportsSuccessComment?is_audit=3&status=1&access_token=' + layui.data(setter.tableName)[setter.request.tokenName] + '&page=' + yes_tableIns.config.page.curr);
    });
    form.on('submit(comment-analyze-abnormal-exports-json)', function () {
        window.open(setter.api_host + 'comment/exportsSuccessComment?is_audit=3&status=2&access_token=' + layui.data(setter.tableName)[setter.request.tokenName] + '&page=' + abnormal_tableIns.config.page.curr);
    });
    form.on('submit(comment-abnormal-analyze-rollback)', function () {
        var checked = table.checkStatus('comment-analyze-abnormal').data;
        var data = [];
        //发送请求获取需要分析的点评Id数据
        // view.request({s
        //     url: 'comment/getAbnormalCommentAnalyzeCommentId',
        //     type: 'get',
        //     auth: true,
        //     async: false,
        //     success: function (e) {
        //         if (e.success) {
        //             checked = e.data;
        //         }
        //     }
        // })

        $.each(checked, function () {
            data.push(this.comment_id);
        });

        view.request({
            url: 'comment/abnormal/rollback',
            type: 'post',
            auth: true,
            data: {ids: data},
            tips: true,
            success: function (e) {
                if (e.success) {
                    abnormal_tableIns.reload();
                }
            }
        })
    });
    form.on('submit(comment-yes-analyze-rollback)', function () {
        var checked = table.checkStatus('comment-analyze-yes');
        if (checked.data.length == 0) {
            layer.msg('请选择需要操作回退的分析数据', {icon: 2, offset: '15px'});
            return false;
        }
        var data = [];
        $.each(checked.data, function () {
            data.push(this.comment_id);
        })
        view.request({
            url: 'comment/abnormal/rollback',
            type: 'post',
            auth: true,
            data: {ids: data},
            tips: true,
            success: function (e) {
                if (e.success) {
                    yes_tableIns.reload();
                }
            }
        })
    });
    //切换待审核表中的切换顺序事件
    table.on('sort(comment-analyze-check-pending)', function (obj) {
        table.reload('comment-analyze-check-pending', {
            where: {
                field: obj.field,
                type: obj.type
            }
        });
        return false;
    });
    //待审核选项卡批量通过按钮点击事件
    form.on('submit(comment-analyze-check-pending-pass)', function () {
        var check = table.checkStatus('comment-analyze-check-pending').data;
        var data = [];
        $.each(check, function () {
            data.push(this.id);
        });
        view.request({
            url: 'comment/batchPass',
            type: 'post',
            data: {ids: data},
            auth: true,
            tips: true,
            success: function (e) {
                if (e.success) {
                    pending_tableIns.reload();
                }
            }
        })
    });
    //待审核选项卡批量驳回按钮点击事件
    form.on('submit(comment-analyze-check-pending-reject)', function () {
        var check = table.checkStatus('comment-analyze-check-pending').data;
        var data = [];
        $.each(check, function () {
            data.push(this.id);
        });
        view.request({
            url: 'comment/commentAnalyze/batchReject',
            type: 'post',
            data: {ids: data},
            auth: true,
            tips: true,
            success: function (e) {
                if (e.success) {
                    pending_tableIns.reload();
                }
            }
        })
    });
    //暂时恢复已审核到已分析
    form.on('submit(comment-analyze-check-pending-abc)', function () {
        var check = table.checkStatus('comment-analyze-check-pending').data;
        var data = [];
        $.each(check, function () {
            data.push(this.id);
        });
        view.request({
            url: 'comment/commentAnalyze/batchRejectceshi',
            type: 'post',
            data: {ids: data},
            auth: true,
            tips: true,
            success: function (e) {
                if (e.success) {
                    pending_tableIns.reload();
                }
            }
        })
    });
    //已审核批量删除
    form.on('submit(comment-analyze-check-pending-bdel)', function () {
        var check = table.checkStatus('comment-analyze-check-pending').data;
        var data = [];
        $.each(check, function () {
            data.push(this.id);
        });
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            view.request({
                url: 'comment/commentAnalyze/batchDelComment',
                type: 'post',
                data: {ids: data},
                auth: true,
                tips: true,
                success: function (e) {
                    if (e.success) {
                        layer.close(index);
                        pending_tableIns.reload();
                    }
                }
            })
        })

    });
    //已分析批量删除
    form.on('submit(comment-analyze-allot-bdel)', function () {
        var check = table.checkStatus('comment-already').data;
        var data = [];
        $.each(check, function () {
            data.push(this.id);
        });
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            view.request({
                url: 'comment/commentAnalyze/batchDelComment',
                type: 'post',
                data: {ids: data},
                auth: true,
                tips: true,
                success: function (e) {
                    if (e.success) {
                        layer.close(index);
                        already_tableIns.reload();
                    }
                }
            })

        });

    });
    //分析异常选项卡中通过已选异常按钮点击事件
    form.on('submit(comment-abnormal-analyze-pass)', function () {
        var checked = table.checkStatus('comment-analyze-abnormal').data;
        if (checked.length == 0) {
            layer.msg('请先选择要通过的点评', {icon: 2, offset: '15px'});
            return false;
        }
        var data = [];
        $.each(checked, function () {
            data.push(this.comment_id);
        });
        view.request({
            url: 'comment/passAbnormalMore',
            type: 'post',
            auth: true,
            data: {ids: data},
            tips: true,
            success: function (e) {
                if (e.success) {
                    abnormal_tableIns.reload();
                }
            }
        })
    });
    form.on('submit(comment-all-search)', function (data) {
        tableIns.reload({where: data.field})
    });
    form.on('submit(back-result-list)', function (data) {
        if (data.field.keyword.length === 0) {
            layer.msg('请先进行搜索后在进行操作', {icon: 2, offset: '15px'});
            return false;
        }
        var _this = this;
        view.request({
            url: 'comment/backComment',
            type: 'post',
            auth: true,
            data: {option: _this.dataset.option},
            tips: true,
            success: function (e) {
                if (e.success) {
                    tableIns.reload();
                }
            }
        })
    });
    //下载商品按钮点击事件
    form.on('submit(article-comment-down-btn)', function (e) {
        let that = this;
        layer.open({
            content: $('#comment_down_tips').html(),
            tips: [1, '#ffffff'],
            area: ['500px', '300px'],
            title: false,
            closeBtn: 0,
            shade: [0.8, '#393D49'],
            shadeClose: true,
            success: function () {
                // $('#comment_down_tips_form_count').html('该物品包含' + that.dataset.goodsnum + '个商品,一共有' + that.dataset.commentnum + '条点评,已下载' + that.dataset.remakenum + '条点评<br><div style="font-size:8px;color:red;">每个商品最多可下载1000个,如果商品实际点评数量不足1000个,则只会下载实际存在的点评。如果输入的下载点评数量不为0,则最多只下载输入的数量</div>');
                $('#comment_down_tips_form_count').html('该物品包含' + that.dataset.goodsnum + '个商品,已下载' + that.dataset.remakenum + '条点评<br><div style="font-size:8px;color:red;">每个商品最多可下载1000个,如果商品实际点评数量不足1000个,则只会下载实际存在的点评。如果输入的下载点评数量不为0,则最多只下载输入的数量</div>');
                form.render();
            },
            yes: function (d) {
                view.request({
                    // url: 'comment/articleCommentDown',
                    url: 'comment/down/queue/article',
                    type: 'post',
                    data: {id: that.dataset.id, num: form.val('comment_down_tips_form').num},
                    auth: true,
                    tips: true
                })
            }
        });
    });
    //点评过滤设置
    form.on('submit(comment-filter-set)', function (e) {
        const id = this.dataset.id;
        layer.open({
            title: false,
            content: $('#comment-filter-set-tips').html(),
            closeBtn: 0,
            shade: [0.3, '#000000'],
            shadeClose: true,
            area: ['500px', '450px'],
            btn: ['确定', '恢复默认'],
            yes: (index, layero) => {
                const data = form.val('comment-filter-set-tips');
                data['article'] = id;
                view.request({
                    url: 'comment/Article/CommentFilter/update',
                    type: 'post',
                    auth: true,
                    data: data,
                    tips: true,
                    success: (e) => {
                        if (e.success) {
                            layer.close(index)
                        }
                    }
                })
                return false;
            },
            btn2: (index, layero) => {
                view.request({
                    url: 'comment/Article/CommentFilter/get',
                    type: 'get',
                    auth: true,
                    async: false,
                    data: {article: -1},
                    success: (e) => {
                        if (e.success) {
                            form.val('comment-filter-set-tips', e.data);
                        }
                    }
                })
                return false;
            },
            success: () => {
                view.request({
                    url: 'comment/Article/CommentFilter/get',
                    type: 'get',
                    auth: true,
                    async: false,
                    data: {article: id},
                    success: (e) => {
                        if (e.success) {
                            form.val('comment-filter-set-tips', e.data);
                        }
                    }
                })
            }
        })
    })
    //分析商品按钮点击事件
    form.on('submit(article-commen-analyze-btn)', function () {
        let that = this;
        console.log(that)
        layer.open({
            content: $('#comment_analyze_tips').html(),
            tips: [1, '#ffffff'],
            area: ['500px', '300px'],
            title: false,
            closeBtn: 0,
            shade: [0.8, '#393D49'],
            shadeClose: true,
            success: function () {
                $('#comment_analyze_tips_form_count').html('该物品共有' + that.dataset.remakenum + '条已下载点评,有' + that.dataset.noanalyzecommentnum + '条点评未被分析');
                form.render();
            },
            yes: function (d) {
                let field = form.val('comment_analyze_tips_form');
                field['ids'] = [that.dataset.id];
                view.request({
                    url: 'comment/articleCommentAnalyze',
                    type: 'post',
                    data: field,
                    auth: true,
                    tips: true,
                    success: function (e) {
                        if (e.success) {
                            tableIns.reload();
                            layer.close(d);
                        }
                    }
                });
            }
        });
    })
    form.render();
    //对外暴露的接口
    exports('comment', {});
});
