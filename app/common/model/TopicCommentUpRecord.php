<?php


namespace app\common\model;


use app\base\BaseModel;
use think\facade\Request;


class TopicCommentUpRecord extends BaseModel
{
    protected $name = 'topic_comment_up_record';

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

}
