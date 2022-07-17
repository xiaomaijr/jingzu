<?php


namespace app\common\model;


use app\base\BaseModel;
use think\facade\Request;


class Topic extends BaseModel
{
    protected $name = 'topic';

	public function getImageAttr($value,$data)
	{
		$url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'];
		return empty($data['image'])?'':$url.$data['image'];
	}

	public function getUserInfoAttr($value,$data)
	{
		$info = Member::getOne(['id'=>$data['uid']],'id,username,image');
		return $info;
	}

	public function getCTimeAttr($value,$data)
	{
		return date('Y-m-d',$data['create_time']);
	}

	public function getContentsAttr($value,$data)
	{
		return explode(',',json_decode($data['content'],true));
	}

	//是否点赞
	public static function getIsDzan($user_id,$id)
	{
		if(TopicUpRecord::checkExist(['status'=>1,'uid'=>$user_id,'aid'=>$id])){
			return 1;
		}else{
			return 0;
		}
	}
	//是否评论点赞
	public static function getCommentIsDzan($user_id,$id)
	{
		if(TopicCommentUpRecord::checkExist(['status'=>1,'uid'=>$user_id,'aid'=>$id])){
			return 1;
		}else{
			return 0;
		}
	}
	//是否收藏
	public static function getIsCollect($user_id,$id)
	{
		if(TopicColRecord::checkExist(['status'=>1,'uid'=>$user_id,'aid'=>$id])){
			return 1;
		}else{
			return 0;
		}
	}

}
