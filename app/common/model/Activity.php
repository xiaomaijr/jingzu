<?php


namespace app\common\model;


use app\base\BaseModel;
use think\facade\Request;


class Activity extends BaseModel
{
    protected $name = 'activity';

    public function getStartTmAttr($value,$data){
        return date('Y-m-d',$data['start_time']);
    }

	public function getIsStartAttr($value,$data){
    	$flag = 0;
    	$now =time();
		if($data['start_time']<$now&&$now<$data['end_time']){
			$flag =1;
		}
		return $flag;
	}

	public function getTypeNameAttr($value,$data){
    	$arr = [1=>'精彩活动',2=>'赛事推荐',3=>'培训项目'];
		return $arr[$data['type']];
	}

	public function getImageAttr($value,$data)
	{
		$url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'];
		return empty($data['image'])?'':$url.$data['image'];
	}
   //is_signup 1已报名 2报名中 3 已结束
	public static function getIsSignup($user_id,$data)
	{
		$now = time();
		if(!empty($user_id)&&ActivitySignupRecord::checkExist(['activity_id'=>$data['id'],'uid'=>$user_id])&&$data['end_time']>$now){
			return 1;
		}elseif ($data['signup_end_time']>$now){
			return 2;
		}else{
			return 3;
		}
	}
	//是否点赞
	public static function getIsDzan($user_id,$id)
	{
		if(ActivityUpRecord::checkExist(['status'=>1,'uid'=>$user_id,'aid'=>$id])){
			return 1;
		}else{
			return 0;
		}
	}

	//是否评论点赞
	public static function getCommentIsDzan($user_id,$id)
	{
		if(ActivityCommentUpRecord::checkExist(['status'=>1,'uid'=>$user_id,'aid'=>$id])){
			return 1;
		}else{
			return 0;
		}
	}

	//是否收藏
	public static function getIsCollect($user_id,$id)
	{
		if(ActivityColRecord::checkExist(['status'=>1,'uid'=>$user_id,'aid'=>$id])){
			return 1;
		}else{
			return 0;
		}
	}

	//data
	public function getContentDataAttr($value,$data)
	{
		$list = ActivityData::getAll(['pid'=>$data['id']],'*','sort desc',function ($data){
			return $data->isEmpty()?[]:$data->map(function ($item){
				$url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'].'/';
				$item->content=str_replace('../',$url,$item->content);
				$item->content = str_replace("<img ", "<img style='max-width:100%;height:auto;'", $item->content);
				return $item;
			});
		});
		return $list;
	}



}
