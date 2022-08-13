<?php

use think\facade\Route;
use think\facade\Env;
use app\base\Response;
use app\admin\middleware\Auth;

Route::group('', function () {
    Route::post('login', 'admin/login/login');
	Route::get('login/captcha', 'admin/login/captcha');
	Route::get('login/checkTokenVaild', 'admin/login/checkTokenVaild');
    Route::post('checkSuperPassword', 'admin/login/checkSuperPassword');
	Route::get('getUserInfo','admin/login/getUserInfo');
	Route::post('upload','admin/File/upload');
	Route::post('abundantUpload','admin/file/abundantUpload');
	Route::post('layeditUpload','admin/file/layeditUpload');
	Route::get('test','admin/Feedback/send');
	Route::get('test2','admin/Feedback/test2');
	Route::get('WxMessage','admin/WxMessage/show');
	Route::post('uploadBigVideo','admin/file/uploadBigVideo');
    Route::group('', function () {
	    //菜单管理
	    Route::get('getMenuList', 'admin/Menu/getMenuList');
	    Route::post('MenuAdd', 'admin/Menu/add');
	    Route::post('MenuEdit', 'admin/Menu/edit');
	    Route::post('Menudel', 'admin/Menu/del');
	    Route::get('getMenuAll', 'admin/Menu/getMenuAll');
	    Route::get('getPower', 'admin/Menu/getPower');
	    //角色管理
	    Route::get('getRoleList', 'admin/Role/getRoleList');
	    Route::get('getRoleall', 'admin/Role/getRoleall');
	    Route::post('RoleAdd', 'admin/Role/add');
	    Route::post('RoleEdit', 'admin/Role/edit');
	    Route::post('Roledel', 'admin/Role/del');
	    //管理员管理
	    Route::get('getAdminList', 'admin/Admin/getAdminList');
	    Route::post('AdminAdd', 'admin/Admin/add');
	    Route::post('AdminEdit', 'admin/Admin/edit');
	    Route::post('editAdminCompanyIds', 'admin/Admin/editAdminCompanyIds');
	    Route::post('Admindel', 'admin/Admin/del');
	    //banner管理
	    Route::get('getBannerList', 'admin/Banner/getBannerList');
	    Route::get('getJumpList', 'admin/Banner/getJumpList');
	    Route::post('BannerAdd', 'admin/Banner/add');
	    Route::post('BannerEdit', 'admin/Banner/edit');
	    Route::post('Bannerdel', 'admin/Banner/del');
	    //内容管理
	    Route::get('getContentList', 'admin/Content/getContentList');
	    Route::post('ContentAdd', 'admin/Content/add');
	    Route::post('ContentEdit', 'admin/Content/edit');
	    Route::post('Contentdel', 'admin/Content/del');

	    Route::post('ContentBest', 'admin/Content/setBest');

	    Route::get('getContentCommentList', 'admin/Content/getCommentList');
	    Route::post('ContenttoExamComment', 'admin/Content/toExamComment');
	    Route::post('delContentComment', 'admin/Content/delComment');
	    //系统设定
	    Route::post('SystemEdit', 'admin/System/edit');
	    //用户
	    Route::get('getMemberList', 'admin/member/getMemberList');
	    Route::get('getMemberAll', 'admin/member/getMemberAll');
	    Route::post('MemberAdd', 'admin/Member/add');
	    Route::post('Memberedit', 'admin/Member/edit');
	    Route::post('Memberdel', 'admin/Member/del');
	    Route::post('MemberbatchDel', 'admin/Member/batchDel');

	    //活动管理
	    Route::get('getActivityList', 'admin/Activity/getActivityList');
	    Route::get('getActivityRecordList', 'admin/Activity/getActivityRecordList');
	    Route::post('ActivityAdd', 'admin/Activity/add');
	    Route::post('ActivityEdit', 'admin/Activity/edit');
	    Route::post('Activitydel', 'admin/Activity/del');
	    Route::post('delActivityRecord', 'admin/Activity/delActivityRecord');
	    Route::post('activitySetBest', 'admin/Activity/setBest');

	    Route::get('getActivityCommentList', 'admin/Activity/getCommentList');
	    Route::post('ActivitytoExamComment', 'admin/Activity/toExamComment');
	    Route::post('delActivityComment', 'admin/Activity/delComment');
		//培训项目管理
	    Route::get('getActivityDataList', 'admin/Activity/getActivityDataList');
	    Route::post('ActivityDataAdd', 'admin/Activity/addData');
	    Route::post('ActivityDataEdit', 'admin/Activity/editData');
	    Route::post('ActivityDatadel', 'admin/Activity/delData');

	    //体育场地管理
	    Route::get('getSportList', 'admin/Sport/getSportList');
	    Route::get('getSportRecordList', 'admin/Sport/getSportRecordList');
	    Route::post('SportAdd', 'admin/Sport/add');
	    Route::post('SportEdit', 'admin/Sport/edit');
	    Route::post('Sportdel', 'admin/Sport/del');
	    Route::post('delSportRecord', 'admin/Sport/delSportRecord');

	    Route::get('getSportImgList', 'admin/Sport/getSportImgList');
	    Route::post('SportAddImg', 'admin/Sport/addImg');
	    Route::post('SportEditImg', 'admin/Sport/editImg');
	    Route::post('SportdelImg', 'admin/Sport/delImg');

	    Route::get('getSportCommentList', 'admin/Sport/getCommentList');
	    Route::post('SporttoExamComment', 'admin/Sport/toExamComment');
	    Route::post('delSportComment', 'admin/Sport/delComment');

	    Route::get('getTopicAllCommentList', 'admin/Sport/getTopicAllCommentList');

	    //话题管理
	    Route::get('getTopicList', 'admin/Topic/getTopicList');
	    Route::post('TopicAdd', 'admin/Topic/add');
	    Route::post('Topicedit', 'admin/Topic/edit');
	    Route::post('Topicdel', 'admin/Topic/del');
	    Route::post('toexamtop', 'admin/Topic/toexam');
	    Route::post('totoexamBatch', 'admin/Topic/toexamBatch');
	    Route::post('setToptop', 'admin/Topic/setTop');
	    Route::post('setPoptop', 'admin/Topic/setPop');
	    Route::post('upperLowertop', 'admin/Topic/upperLower');
	    Route::get('getTopList', 'admin/Topic/getTopList');
	    Route::get('getTopicTestList', 'admin/Topic/getTopicTestList');
	    //评论
	    Route::get('getTopicCommentList', 'admin/Topic/getTopicCommentList');
	    Route::post('TopictoExamComment', 'admin/Topic/toExamComment');

	    Route::get('getTopicAllCommentList', 'admin/Topic/getTopicAllCommentList');
	    Route::post('setTopicAllCommentStatus', 'admin/Topic/setTopicAllCommentStatus');
	    //删除评论
	    Route::post('delTopicComment', 'admin/Topic/delTopicComment');
	    //反馈管理
	    Route::get('getFeedbackList', 'admin/Feedback/getFeedbackList');
	    Route::post('delFeedback', 'admin/Feedback/del');

    })->middleware([Auth::class]);
	//更新时间
	Route::get('site/time', function () {
		$data = ['time' => date('Y-m-d H:i:s', ceil(Env::get('version.time') / 1000))];
		return Response::Okdata($data);
	});
	//版本
	Route::get('site/version', function () {
		$data = ['version' => 'YM' . date('Ymd', ceil(Env::get('version.time') / 1000))];
		return Response::Okdata($data);
	});

})->allowCrossDomain(['Content-Type' => 'application/json', 'Access-Control-Allow-Headers' => 'access_token']);

