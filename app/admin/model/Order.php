<?php


namespace app\admin\model;


use app\common\model\Order as Order_Common_Model;
use think\facade\Request;
use think\facade\Session;

class Order extends Order_Common_Model
{

//	public function getCompanyNameAttr($value,$data)
//	{
//		$info = MemberDp::getOne(['id'=>$data['company']]);
//		$name = empty($info)?'':$info['title'];
//		return $name;
//	}


}
