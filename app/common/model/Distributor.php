<?php


namespace app\common\model;


use app\base\BaseModel;
use think\facade\Request;
use think\facade\Session;

class Distributor extends BaseModel
{
    protected $name = 'distributor';

	public function getUserAttr($value,$data)
	{
		$info=Member::getOne(['id'=>$data['uid']]);
		return $info;
	}


}
