<?php


namespace app\common\model;


use app\base\BaseModel;
use think\facade\Request;
use think\facade\Session;

class Member extends BaseModel
{
    protected $name = 'member';

    public function getUsernameAttr($value){
        return userTextDecode($value);
    }

//	public function getImageAttr($value,$data)
//	{
//		$url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'];
//		return empty($data['image'])?'':$url.$data['image'];
//	}

	public function getNumAttr($value,$data)
	{
		return GameData::where(['uid'=>$data['id']])->count();
	}

	public function getPerAttr($value,$data)
	{
		return 1;
	}

	public function getKillNumAttr($value,$data)
	{
		return GameData::where(['uid'=>$data['id']])->sum('kill_num');
	}

}
