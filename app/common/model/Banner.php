<?php


namespace app\common\model;

use app\base\BaseModel;
use think\facade\Request;
use think\facade\Session;
use think\Model;

class Banner extends BaseModel
{
    protected $name = 'banner';

	public function getImageAttr($value,$data)
	{
		$url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'];
		return empty($data['image'])?'':$url.$data['image'];
	}

}
