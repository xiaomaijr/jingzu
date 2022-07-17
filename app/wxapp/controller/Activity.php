<?php
namespace app\wxapp\controller;

use app\BaseController;
use app\base\Response;
use app\common\model\Activity as ActivityModel;
use app\common\model\ActivityColRecord;
use app\common\model\ActivityComment;
use app\common\model\ActivityCommentUpRecord;
use app\common\model\ActivitySignupRecord;
use app\common\model\ActivityUpRecord;
use app\common\model\Follow;
use app\wxapp\middleware\Auth;
use app\wxapp\model\Member;


class Activity extends BaseController
{
	//Activity
    public function getActivityList()
    {
	    $type=$this->request->param('type');//1精彩活动2线上赛事3培训课程4报名的培训课程5不报名培训课程
	    $now =time();
	    $where = [];
	    $where[] = ['end_time','>=',$now];
	    if(!empty($type)&&($type==1||$type==2)){
		    $where[] = ['type','=',$type];
	    }
	    if($type==4){
		    $where[] = ['type','=',3];
		    $where[] = ['is_signup','=',1];
	    }elseif ($type==5){
		    $where[] = ['type','=',3];
		    $where[] = ['is_signup','=',0];
	    }else{

	    }
	    $list = ActivityModel::getList($where,'*','sort desc','',function($data){
		    $data->map(function($item){
			    $item->append(['is_start']);
		    	return $item;
		    });
	    });

	    return Response::Okdata($list, ActivityModel::getlastsql());
    }

	//Activity
	public function getActivityPlaybackList()
	{
		$type=$this->request->param('type');//1精彩活动2线上赛事3培训课程
		$now =time();
		$list = ActivityModel::getList([['type','=',$type],['end_time','<',$now]],'*','sort desc','',function($data){
			$data->map(function($item){
				return $item;
			});
		});

		return Response::Okdata($list, 'get data success');
	}
	//获取Activity --1精彩活动2线上赛事3培训课程
	public function getActivityInfo()
	{
		$uid=Auth::$uid;
		$id = $this->request->param('id');
//		$type=$this->request->param('type');//1精彩活动2线上赛事3培训课程

		$info = ActivityModel::getOne(['id'=>$id],'*');
		if($info['type']==3){
			$url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'].'/image/';
			$info['content']=str_replace('/image',$url,$info['content']);
		}else{
			$url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'].'/';
			$info['content']=str_replace('../',$url,$info['content']);
		}

		$info['content'] = str_replace("<img ", "<img style='max-width:100%;height:auto;'", $info['content']);
		$info->num = ActivityComment::getCount(['aid'=>$id]);
		$info->is_signupsignup = $info->is_signup;
		$info->is_signup = ActivityModel::getIsSignup($uid,$info);
		$info->recommend = ActivityModel::field('*')->where([['id','<>',$id],['type','=',$info['type']]])->limit(2)->order('create_time desc')->select();
		$info->is_dzan = ActivityModel::getIsDzan($uid,$id);
		$info->is_collect = ActivityModel::getIsCollect($uid,$id);
		$info->append(['is_start','start_tm','content_data']);
		return Response::Okdata($info, 'get data success');
	}

	//获取活动评论
	public function getActivityCommentList()
	{
		$id = $this->request->param('id');
//		$type=$this->request->param('type');//1精彩活动2线上赛事3培训课程

		$list = ActivityComment::getList(['aid'=>$id],'*','sort desc','',function($data){
			$data->map(function($item){
				$uid=Auth::$uid;
				$item->append(['user_info']);
				if(Follow::checkExist(['uid'=>$uid,'b_uid'=>$item->uid,'status'=>1])){
					$item->is_follow = 1;
				}else{
					$item->is_follow = 0;
				}
				$item->is_dzan = ActivityModel::getCommentIsDzan($uid,$item->id);
				return $item;
			});
		});

		return Response::Okdata($list, 'get data success');
	}
	//活动报名
	public function signUp(){
		$uid=Auth::$uid;
		$activity_id=$this->request->param('activity_id','','intval');//活动id
		$name=$this->request->param('name');
		$phone=$this->request->param('phone');
		$card=$this->request->param('card');
		$age=$this->request->param('age');
		$address=$this->request->param('address');
		$remarks=$this->request->param('remarks');
		$filenames=$this->request->param('filenames');
		$pdf_filename=$this->request->param('pdf_filename');

		$info  = ActivityModel::getOne(['id'=>$activity_id],'*');

		if(empty($info)||$info['signup_end_time']<=time()){
			return Response::Error("不在报名时间");
		}
		if(ActivitySignupRecord::checkExist(['uid'=>$uid,'activity_id'=>$activity_id])){
			return Response::Error("已经报名");
		}
		$data['activity_id'] = $activity_id;
		$data['uid'] = $uid;
		$data['name'] = $name;
		$data['phone'] = $phone;
		$data['card'] = $card;
		$data['age'] = $age;
		$data['remarks'] = $remarks;
		$data['address'] = $address;
		$data['filenames'] = json_encode($filenames);
		$data['pdf_filename'] = $pdf_filename;

		$res = ActivitySignupRecord::create($data);
		if(empty($res)){
			return Response::Error("报名失败");
		}else{
			return Response::Okdata([],"报名成功");
		}
	}
	//点赞
	public function givetup(){
		$uid=Auth::$uid;
		$aid=$this->request->param('aid','','intval');//文章id
//		$type=$this->request->param('type');//1精彩活动2线上赛事3培训课程

		if(empty($aid)){
			return Response::Error("点赞失败");
		}
		$res=ActivityUpRecord::getOne(['uid'=>$uid,'aid'=>$aid],'id,status');
		if(empty($res)){
			$data = ['aid'=>$aid,'uid'=>$uid,'status'=>1];
			$res = ActivityUpRecord::create($data);
			if(empty($res)){
				return Response::Error("点赞失败");
			}else{
				$num=ActivityUpRecord::where(['status'=>1,'aid'=>$aid])->count();
				ActivityModel::update(['giveup'=>$num],['id'=>$aid]);
				return Response::Okdata($num,"点赞成功");
			}
		}else{
			if($res['status']){
				$rescs=ActivityUpRecord::where('id',$res['id'])->update(['status'=>0]);
				if($rescs){
					$num=ActivityUpRecord::where(['status'=>1,'aid'=>$aid])->count();
					ActivityModel::update(['giveup'=>$num],['id'=>$aid]);
					return Response::Okdata($num,"取消点赞成功");
				}else{
					return Response::Error("取消点赞失败");
				}
			}else{
				$rescs=ActivityUpRecord::where('id',$res['id'])->update(['status'=>1]);
				if($rescs){
					$num=ActivityUpRecord::where(['status'=>1,'aid'=>$aid])->count();
					ActivityModel::update(['giveup'=>$num],['id'=>$aid]);
					return Response::Okdata($num,"点赞成功");
				}else{
					return Response::Error("点赞失败");
				}
			}
		}
	}

	//评论点赞
	public function givetupComment(){
		$uid=Auth::$uid;
		$aid=$this->request->param('aid','','intval');//评论id
		if(empty($aid)){
			return Response::Error("点赞失败");
		}
		$res=ActivityCommentUpRecord::getOne(['uid'=>$uid,'aid'=>$aid],'id,status');
		if(empty($res)){
			$data = ['aid'=>$aid,'uid'=>$uid,'status'=>1];
			$res = ActivityCommentUpRecord::create($data);
			if(empty($res)){
				return Response::Error("点赞失败");
			}else{
				return Response::Okdata([],"点赞成功");
			}
		}else{
			if($res['status']){
				$rescs=ActivityCommentUpRecord::where('id',$res['id'])->update(['status'=>0]);
				if($rescs){
					return Response::Okdata([],"取消点赞成功");
				}else{
					return Response::Error("取消点赞失败");
				}
			}else{
				$rescs=ActivityCommentUpRecord::where('id',$res['id'])->update(['status'=>1]);
				if($rescs){
					return Response::Okdata([],"点赞成功");
				}else{
					return Response::Error("点赞失败");
				}
			}
		}
	}
	//收藏
	public function collect(){
		$uid=Auth::$uid;
		$aid=$this->request->param('aid','','intval');//文章id
//		$type=$this->request->param('type');//1精彩活动2线上赛事3培训课程
		if(empty($aid)){
			return Response::Error("收藏失败");
		}
		$res=ActivityColRecord::getOne(['uid'=>$uid,'aid'=>$aid],'id,status');
		if(empty($res)){
			$data = ['aid'=>$aid,'uid'=>$uid,'status'=>1];
			$res = ActivityColRecord::create($data);
			if(empty($res)){
				return Response::Error("收藏失败");
			}else{
				$num=ActivityColRecord::where(['status'=>1,'aid'=>$aid])->count();
				ActivityModel::update(['collect'=>$num],['id'=>$aid]);
				return Response::Okdata($num,"收藏成功");
			}
		}else{
			if($res['status']){
				$rescs=ActivityColRecord::where('id',$res['id'])->update(['status'=>0]);
				if($rescs){
					$num=ActivityColRecord::where(['status'=>1,'aid'=>$aid])->count();
					ActivityModel::update(['collect'=>$num],['id'=>$aid]);
					return Response::Okdata($num,"取消收藏成功");
				}else{
					return Response::Error("取消收藏失败");
				}
			}else{
				$rescs=ActivityColRecord::where('id',$res['id'])->update(['status'=>1]);
				if($rescs){
					$num=ActivityColRecord::where(['status'=>1,'aid'=>$aid])->count();
					ActivityModel::update(['collect'=>$num],['id'=>$aid]);
					return Response::Okdata($num,"收藏成功");
				}else{
					return Response::Error("收藏失败");
				}
			}
		}
	}

	//获取省市县区文件
	public function getPuaFile(){
		$file = 'static/ssqj/pcas-code.json';
		$res = file_get_contents($file);
		$res = json_decode($res,true);
		return Response::Okdata($res, 'get data success');
	}
}
