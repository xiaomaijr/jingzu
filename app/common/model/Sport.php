<?php


namespace app\common\model;


use app\base\BaseModel;
use app\wxapp\middleware\Auth;
use think\facade\Request;


class Sport extends BaseModel
{
    protected $name = 'sport';

	public function getImageAttr($value,$data)
	{
		$url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'];
		return empty($data['image'])?'':$url.$data['image'];
	}

	public function getCTimeAttr($value,$data)
	{
		return date('Y-m-d',$data['create_time']);
	}

	public function getRecordAttr($value,$data)
	{
		$uid = Auth::$uid;
		$info = SportAppointmentRecord::getOne(['uid'=>$uid,'sport_id'=>$data['id']]);
		return $info;
	}

	//是否点赞
	public static function getIsDzan($user_id,$id)
	{
		if(SportUpRecord::checkExist(['status'=>1,'uid'=>$user_id,'aid'=>$id])){
			return 1;
		}else{
			return 0;
		}
	}

	//是否评论点赞
	public static function getCommentIsDzan($user_id,$id)
	{
		if(SportCommentUpRecord::checkExist(['status'=>1,'uid'=>$user_id,'aid'=>$id])){
			return 1;
		}else{
			return 0;
		}
	}

	//是否收藏
	public static function getIsCollect($user_id,$id)
	{
		if(SportColRecord::checkExist(['status'=>1,'uid'=>$user_id,'aid'=>$id])){
			return 1;
		}else{
			return 0;
		}
	}

}
