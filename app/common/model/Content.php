<?php


namespace app\common\model;


use app\base\BaseModel;
use think\facade\Request;


class Content extends BaseModel
{
    protected $name = 'content';

    public function getStartTimeAttr($value){
        return date('Y-m-d H:i:s',$value);
    }

    public function getEndTimeAttr($value){
        return date('Y-m-d H:i:s',$value);
    }

	public function getImageAttr($value,$data)
	{
		$url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'];
		return empty($data['image'])?'':$url.$data['image'];
	}
	//�Ƿ����
	public static function getIsDzan($user_id,$id)
	{
		if(ContentUpRecord::checkExist(['status'=>1,'uid'=>$user_id,'aid'=>$id])){
			return 1;
		}else{
			return 0;
		}
	}

	//�Ƿ����۵���
	public static function getCommentIsDzan($user_id,$id)
	{
		if(ContentCommentUpRecord::checkExist(['status'=>1,'uid'=>$user_id,'aid'=>$id])){
			return 1;
		}else{
			return 0;
		}
	}

	//�Ƿ��ղ�
	public static function getIsCollect($user_id,$id)
	{
		if(ContentColRecord::checkExist(['status'=>1,'uid'=>$user_id,'aid'=>$id])){
			return 1;
		}else{
			return 0;
		}
	}
}
