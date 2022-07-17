<?php


namespace app\common\model;


use app\base\BaseModel;
use think\facade\Request;


class Follow extends BaseModel
{
    protected $name = 'follow';

	public function getImageAttr($value,$data)
	{
		$url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'];
		return empty($data['image'])?'':$url.$data['image'];
	}

}
