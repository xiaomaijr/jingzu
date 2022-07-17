<?php
namespace app\wxapp\controller;

use app\BaseController;
use app\base\Response;
use app\common\model\Banner as BannerModel;
use app\wxapp\middleware\Auth;
use app\wxapp\model\Member;


class Banner extends BaseController
{
	//banner
    public function getBannerList()
    {
	    $list = BannerModel::getAll([],'*','sort desc',function($data){
		    $data->map(function($item){
			    $item->imgUrl = $item->image;
		    	return $item;
		    });
	    });

	    return Response::Okdata($list, 'get data success');
    }

}
