/** layuiAdmin.std-v1.0.0 LPPL License By http://www.layui.com/admin/ */
 ;/** 核桃说后台管理-v1.2.1 LPPL License By http://www.layui.com/admin/ */
 ;/** 核桃说后台管理-v1.2.1 LPPL License By http://www.layui.com/admin/ */
 ;/** 核桃说后台管理-v1.2.1 LPPL License By http://www.layui.com/admin/ */
 ;/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.0.16 (2019-09-24)
 */
(function (domGlobals) {
    'use strict';

    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    function Plugin () {
      global.add('contextmenu', function () {
        domGlobals.console.warn('Context menu plugin is now built in to the core editor, please remove it from your editor configuration');
      });
    }

    Plugin();

}(window));
