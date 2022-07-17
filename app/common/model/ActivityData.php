<?php


namespace app\common\model;


use app\base\BaseModel;
use think\facade\Request;


class ActivityData extends BaseModel
{
    protected $name = 'activity_data';


//	public function getUserInfoAttr($value,$data)
//	{
//		$info = Member::getOne(['id'=>$data['uid']],'id,username,image');
//		return $info;
//	}

}
