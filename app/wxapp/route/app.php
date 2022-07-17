<?php

use think\facade\Route;
use think\facade\Env;
use app\base\Response;
use app\wxapp\middleware\Auth;

Route::group('', function () {
    Route::post('register', 'login/register');
    Route::post('setPhone', 'login/setPhone');
	Route::get('test', 'User/makeEwm');

	Route::get('getContentData', 'Index/getContentData');
	Route::get('getIndexData', 'Index/getRecommend');
	Route::get('getNotify', 'Index/getNotify');
	//banner
	Route::get('getBannerList', 'Banner/getBannerList');
	//Brand
	Route::get('getBrandList', 'Brand/getBrandList');
	Route::get('getBrandModelList', 'Brand/getBrandModelList');
	Route::get('getBrandModelInfo', 'Brand/getBrandModelInfo');
	Route::get('getBrandModelPrice', 'Brand/getBrandModelPrice');
	Route::get('getBrandModelCondition', 'Brand/getBrandModelCondition');
	//content
	Route::get('getContentList', 'Content/getList');
	//Sport
	Route::get('getSportList', 'Sport/getSportList');
	Route::get('getSportAll', 'Sport/getSportAll');
	//Activity
	Route::get('getActivityList', 'Activity/getActivityList');
	Route::get('getActivityPlaybackList', 'Activity/getActivityPlaybackList');


	Route::get('notify', 'WxPay/notify');
	Route::get('getPuaFile', 'Activity/getPuaFile');

    Route::group('', function () {
    	//pay
	    Route::post('wxpay', 'WxPay/wxpay');
	    //Activity
	    Route::get('getActivityInfo', 'Activity/getActivityInfo');
	    Route::get('getActivityCommentList', 'Activity/getActivityCommentList');
	    Route::post('setActivityGivetup', 'Activity/givetup');
	    Route::post('setActivityGivetupComment', 'Activity/givetupComment');
	    Route::post('setActivityCollect', 'Activity/collect');
	    Route::post('setActivitysignUp', 'Activity/signUp');
	    //User
	    Route::post('setApplyFollow', 'User/applyFollow');
	    Route::get('getMyReserve', 'User/getMyReserve');
	    Route::get('getMyReserveInfo', 'User/getMyReserveInfo');
	    Route::get('getMySignUp', 'User/getMySignUp');
	    Route::get('getMyPush', 'User/getMyPush');
	    Route::get('getMyCollection', 'User/getMyCollection');
	    Route::get('getMyFollow', 'User/getMyFollow');
	    Route::post('submitFeedback', 'User/feedback');
	    //Circle
	    Route::get('getCircleList', 'Circle/getCircleList');
	    Route::get('getMyCircleList', 'Circle/getMyCircleList');
	    Route::get('getCircleInfo', 'Circle/getCircleInfo');
	    Route::get('getCircleCommentList', 'Circle/getCircleCommentList');
	    Route::post('submitTopic', 'Circle/submitTopic');
	    Route::post('setTopicGivetup', 'Circle/givetup');
	    Route::post('setTopicGivetupComment', 'Circle/givetupComment');
	    Route::post('setCircleCollect', 'Circle/collect');
	    Route::post('setCircleDel', 'Circle/del');
	    //Content
	    Route::get('getContentInfo', 'Content/getInfo');
	    Route::get('getContentCommentList', 'Content/getContentCommentList');
	    Route::post('setContentGivetup', 'Content/givetup');
	    Route::post('setContentGivetupComment', 'Content/givetupComment');
	    Route::post('setContentCollect', 'Content/collect');
	    //Sport
	    Route::get('getSportInfo', 'Sport/getSportInfo');
	    Route::get('getSportImgList', 'Sport/getSportImgList');
	    Route::post('setSportGivetup', 'Sport/givetup');
	    Route::post('setSportGivetupComment', 'Sport/givetupComment');
	    Route::post('setSportCollect', 'Sport/collect');
	    Route::post('setSportAppointment', 'Sport/appointment');
	    //Comment
	    Route::post('submitComment', 'Comment/submitComment');
	    Route::get('getSportCommentList', 'Sport/getSportCommentList');
	    //Index
	    Route::get('getSearchList', 'Index/getSearchList');

        //user
        Route::get('getUserInfo', 'User/getUserInfo');
        Route::get('getAddressList', 'User/getAddressList');
        Route::get('getMyCommission', 'User/getMyCommission');
        Route::post('setUserAdd', 'User/add');
        Route::post('setUserEdit', 'User/edit');
        Route::post('settUserDel', 'User/del');
        Route::post('applyDistribution', 'User/applyDistribution');

	    Route::get('getUserInfo', 'User/getUserInfo');
	    Route::post('upload', 'File/upload');
	    Route::post('uploadPdf', 'File/uploadPdf');
	    Route::post('uploadMedio', 'File/uploadMedio');
	    Route::post('modPhone', 'User/modPhone');
	    Route::get('getContactInfo', 'User/getContactInfo');

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

