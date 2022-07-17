<?php
namespace app\wxapp\controller;

use app\BaseController;
use app\base\Response;
use app\common\model\Activity as ActivityModel;
use app\common\model\ActivityColRecord;
use app\common\model\ActivitySignupRecord;
use app\common\model\ContentColRecord;
use app\common\model\Feedback as FeedbackModel;
use app\common\model\Sport;
use app\common\model\Content;
use app\common\model\Follow;
use app\common\model\SportAppointmentRecord;
use app\common\model\Topic;
use app\wxapp\middleware\Auth;
use app\wxapp\model\Member;
use Overtrue\Pinyin\Pinyin;


class User extends BaseController
{
	//关注
	public function applyFollow()
	{
		$uid = Auth::$uid;
		$b_uid = $this->request->param('b_uid');

		$res = Follow::getOne(['uid'=>$uid,'b_uid'=>$b_uid],'*');
		if(empty($res)){
			$data['uid'] = $uid;
			$data['b_uid'] = $b_uid;
			$data['username'] = Member::getOneField(['id'=>$b_uid],'username');
			$data['status'] = 1;
			$res = Follow::create($data);
			if($res->id){
				return Response::Okdata([], '关注成功');
			} else {
				return Response::Error('关注失败');
			}
		}else{
			if($res['status']){
				$res = Follow::where(['id'=>$res['id']])->update(['status'=>0]);
				if($res !==false){
					return Response::Okdata([], '取关成功');
				} else {
					return Response::Error('取关失败');
				}
			}else{
				$res = Follow::where(['id'=>$res['id']])->update(['status'=>1]);
				if($res !==false){
					return Response::Okdata([], '关注成功');
				} else {
					return Response::Error('关注失败');
				}
			}
		}


	}

	public function getUserInfo()
	{
		$uid = Auth::$uid;
		$b_uid = $this->request->param('id');
		if(empty($b_uid)){
			$info = Member::getOne(['id'=>$uid],'id,username,image,phone');
		}else{
			$info = Member::getOne(['id'=>$b_uid],'id,username,image,phone');
			$info['is_gz'] = 0;
			if(Follow::checkExist(['uid'=>$uid,'b_uid'=>$b_uid,'status'=>1])){
				$info['is_gz'] = 1;
			}
		}
		return Response::Okdata($info, 'get data success');
	}

     //我的预定
	public function getMyReserve(){
		$uid = Auth::$uid;
		$ids  = SportAppointmentRecord::getAll(['uid'=>$uid],'*','',function($data){
			return $data->isEmpty()?[]:array_unique(array_column($data->toArray(),'sport_id'));
		});
		$list = Sport::getList([['id','in',$ids]],'id,title,image,create_time');
		foreach ($list['data'] as $k=>$v){
			$v->append(['record','c_time']);
		}
		return Response::Okdata($list, 'get data success');
	}
	//我的预定信息我的报名
	public function getMyReserveInfo(){
		$uid = Auth::$uid;
		$sport_id = $this->request->param('sport_id');
		$type = $this->request->param('type');
		if($type==1){
			$sport = Sport::getOne(['id'=>$sport_id],'*');
			$sportreserve = SportAppointmentRecord::getOne(['sport_id'=>$sport_id,'uid'=>$uid],'*');
			return Response::Okdata(['sport'=>$sport,'sportreserve'=>$sportreserve], 'get data success');
		}elseif ($type==2){
			$sport = ActivityModel::getOne(['id'=>$sport_id],'*');
			$sportreserve = ActivitySignupRecord::getOne(['activity_id'=>$sport_id,'uid'=>$uid],'*');
			return Response::Okdata(['sport'=>$sport,'sportreserve'=>$sportreserve], 'get data success');
		}else{
			return Response::Okdata([], 'get data success');
		}

	}
     //我的报名
	public function getMySignUp(){
		$uid = Auth::$uid;
		$type=$this->request->param('type');//1精彩活动2线上赛事3培训课程
		$ids  = ActivitySignupRecord::getAll(['uid'=>$uid],'*','',function($data){
			return $data->isEmpty()?[]:array_unique(array_column($data->toArray(),'activity_id'));
		});
		$list = ActivityModel::getList([['id','in',$ids],['type','=',$type]],'id,title,image,create_time');
		return Response::Okdata($list, 'get data success');
	}
     //我的收藏
	public function getMyCollection(){
		$uid = Auth::$uid;
		$type=$this->request->param('type');//1精彩活动2线上赛事3培训课程4资讯
		if(in_array($type,[1,2,3])){
			$ids  = ActivityColRecord::getAll(['uid'=>$uid],'*','',function($data){
				return $data->isEmpty()?[]:array_unique(array_column($data->toArray(),'aid'));
			});
			$list = ActivityModel::getList([['id','in',$ids],['type','=',$type]],'id,title,image,create_time');
			return Response::Okdata($list, 'get data success');
		}else{
			$ids  = ContentColRecord::getAll(['uid'=>$uid],'*','',function($data){
				return $data->isEmpty()?[]:array_unique(array_column($data->toArray(),'aid'));
			});
			$list = Content::getList([['id','in',$ids]],'id,title,image,create_time,source');
			return Response::Okdata($list, 'get data success');
		}
	}
	//我的关注
	public function getMyFollow(){
		$uid = Auth::$uid;
		$ids = Follow::getAll([['uid','=',$uid],['status','=',1]],'id,b_uid','',function($data){
			return $data->isEmpty()?[]:array_unique(array_column($data->toArray(),'b_uid'));
		});
		$pinyin = new Pinyin();
		$list = Member::getAll([['id','in',$ids]],'id,username as text,image as imgUrl','',function ($data)use($pinyin){
			return $data->isEmpty()?[]:$data->map(function ($item)use($pinyin){
				$initials = $pinyin->abbr($item->text);
				if(!empty($initials)){
					$item->initials = substr( $initials, 0, 1 );;
				}else{
					$item->initials = 'A';
				}
				return $item;
			});
		});
		 $res_data = [];

		 foreach ($list as $k=>$v){
			 if(array_key_exists($v['initials'], $res_data)){
				 $res_data[$v['initials']]['children'][]=['id'=>$v['id'],'text'=>userTextDecode($v['text']),'imgUrl'=>$v['imgUrl']];
			 }else{
				 $res_data[$v['initials']]['id']=strtolower($v['initials']);
				 $res_data[$v['initials']]['head']=strtoupper($v['initials']);
				 $res_data[$v['initials']]['children'][]=['id'=>$v['id'],'text'=>userTextDecode($v['text']),'imgUrl'=>$v['imgUrl']];
			 }
		 }
		ksort($res_data);
		$res_data = array_values($res_data);
		return Response::Okdata($res_data, 'get data success');
	}
     //我的发布
	public function getMyPush(){
		$uid = Auth::$uid;

		$list = Topic::getList(['uid'=>$uid],'*','sort desc','',function($data)use ($uid){
			$data->map(function($item)use ($uid){
				$item->append(['user_info','contents']);
				$item->is_dzan = Topic::getIsDzan($uid,$item->id);
				return $item;
			});
		});
		return Response::Okdata($list, 'get data success');
	}
	public function makeEwm(){
//		$user = Member::find(9)['username'];
//		$pinyin = new Pinyin();
//		var_dump($user);
//		var_dump($pinyin->abbr('雪碧不加冰'));
		$a = ['/upload/zp/389182b4356ea1ca063c4ccd51d958fe.jpeg'];
		var_dump(json_encode($a));
	}
	//意见反馈提交
	public function feedback(){
		$name = $this->request->param('name'.'','trim');
		$phone = $this->request->param('phone'.'','trim');
		$email = $this->request->param('email'.'','trim');
		$content = $this->request->param('content'.'','trim');
		if(empty($email)||empty($content)||empty($name)||empty($phone)){
			return Response::Error('请填写完整信息');
		}
		$data = array();
		$data['name'] = $name;
		$data['phone'] = $phone;
		$data['email'] =$email;
		$data['content'] =$content;
		$data['create_time'] = time();
		$res = FeedbackModel::create($data);
		if($res){
			return Response::Ok("增加成功");
		}else{
			return Response::Error('增加失败');
		}
	}
}
