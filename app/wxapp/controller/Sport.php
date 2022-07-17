<?php
namespace app\wxapp\controller;

use app\admin\model\SportImg;
use app\BaseController;
use app\base\Response;
use app\common\model\Sport as Sport_Model;
use app\common\model\SportAppointmentRecord;
use app\common\model\SportColRecord;
use app\common\model\SportComment;
use app\common\model\SportCommentUpRecord;
use app\common\model\SportUpRecord;
use app\wxapp\middleware\Auth;
use app\wxapp\model\Member;
use think\facade\Db;

class Sport extends BaseController
{
	//Sport_Model
    public function getSportList()
    {
	    $list = Sport_Model::getAll([],'*','sort desc',function($data){
		    $data->map(function($item){
			    $item->num = SportComment::getCount(['aid'=>$item->id]);
		    	return $item;
		    });
	    });

	    return Response::Okdata($list, 'get data success');
    }

	//Sport_Model
	public function getSportAll()
	{
		$list = Sport_Model::getAll([],'id,title','sort desc')->toArray();
		$list[] = ['id'=>999,'title'=>'地图点选'];
		return Response::Okdata($list, 'get data success');
	}
	//获取Sport
	public function getSportInfo()
	{
		$uid=Auth::$uid;
		$id = $this->request->param('id');

		$info = Sport_Model::getOne(['id'=>$id],'*');
		$info->num = SportComment::getCount(['aid'=>$id]);
		$info->ss = SportAppointmentRecord::checkExist(['uid'=>$uid,'sport_id'=>$id]);
		$info->is_dzan = Sport_Model::getIsDzan($uid,$id);
		$info->is_collect = Sport_Model::getIsCollect($uid,$id);
		if(SportAppointmentRecord::checkExist(['uid'=>$uid,'sport_id'=>$id])){
			$info->is_yd=1;
		}

		return Response::Okdata($info, 'get data success');
	}

	//获取体育场馆评论
	public function getSportCommentList()
	{
		$uid=Auth::$uid;
		$id = $this->request->param('id');
		$list = SportComment::getList(['aid'=>$id],'*','sort desc','',function($data)use($uid){
			$data->map(function($item)use($uid){
				$item->append(['user_info']);
				$item->is_dzan = Sport_Model::getCommentIsDzan($uid,$item->id);
				return $item;
			});
		});

		return Response::Okdata($list, 'get data success');
	}

	//场馆点赞
	public function givetup(){
		$uid=Auth::$uid;
		$aid=$this->request->param('aid','','intval');//文章id
		if(empty($aid)){
			return Response::Error("点赞失败");
		}
		$res=SportUpRecord::getOne(['uid'=>$uid,'aid'=>$aid],'id,status');
		if(empty($res)){
			$data = ['aid'=>$aid,'uid'=>$uid,'status'=>1];
			$res = SportUpRecord::create($data);
			if(empty($res)){
				return Response::Error("点赞失败");
			}else{
				$num=SportUpRecord::where(['status'=>1,'aid'=>$aid])->count();
				Sport_Model::update(['giveup'=>$num],['id'=>$aid]);
				return Response::Okdata($num,"点赞成功");
			}
		}else{
			if($res['status']){
				$rescs=SportUpRecord::where('id',$res['id'])->update(['status'=>0]);
				if($rescs){
					$num=SportUpRecord::where(['status'=>1,'aid'=>$aid])->count();
					Sport_Model::update(['giveup'=>$num],['id'=>$aid]);
					return Response::Okdata($num,"取消点赞成功");
				}else{
					return Response::Error("取消点赞失败");
				}
			}else{
				$rescs=SportUpRecord::where('id',$res['id'])->update(['status'=>1]);
				if($rescs){
					$num=SportUpRecord::where(['status'=>1,'aid'=>$aid])->count();
					Sport_Model::update(['giveup'=>$num],['id'=>$aid]);
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
		$res=SportCommentUpRecord::getOne(['uid'=>$uid,'aid'=>$aid],'id,status');
		if(empty($res)){
			$data = ['aid'=>$aid,'uid'=>$uid,'status'=>1];
			$res = SportCommentUpRecord::create($data);
			if(empty($res)){
				return Response::Error("点赞失败");
			}else{
				return Response::Okdata([],"点赞成功");
			}
		}else{
			if($res['status']){
				$rescs=SportCommentUpRecord::where('id',$res['id'])->update(['status'=>0]);
				if($rescs){
					return Response::Okdata([],"取消点赞成功");
				}else{
					return Response::Error("取消点赞失败");
				}
			}else{
				$rescs=SportCommentUpRecord::where('id',$res['id'])->update(['status'=>1]);
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
		if(empty($aid)){
			return Response::Error("收藏失败");
		}
		$res=SportColRecord::getOne(['uid'=>$uid,'aid'=>$aid],'id,status');
		if(empty($res)){
			$data = ['aid'=>$aid,'uid'=>$uid,'status'=>1];
			$res = SportColRecord::create($data);
			if(empty($res)){
				return Response::Error("收藏失败");
			}else{
				$num=SportColRecord::where(['status'=>1,'aid'=>$aid])->count();
				Sport_Model::update(['collect'=>$num],['id'=>$aid]);
				return Response::Okdata($num,"收藏成功");
			}
		}else{
			if($res['status']){
				$rescs=SportColRecord::where('id',$res['id'])->update(['status'=>0]);
				if($rescs){
					$num=SportColRecord::where(['status'=>1,'aid'=>$aid])->count();
					Sport_Model::update(['collect'=>$num],['id'=>$aid]);
					return Response::Okdata($num,"取消收藏成功");
				}else{
					return Response::Error("取消收藏失败");
				}
			}else{
				$rescs=SportColRecord::where('id',$res['id'])->update(['status'=>1]);
				if($rescs){
					$num=SportColRecord::where(['status'=>1,'aid'=>$aid])->count();
					Sport_Model::update(['collect'=>$num],['id'=>$aid]);
					return Response::Okdata($num,"收藏成功");
				}else{
					return Response::Error("收藏失败");
				}
			}
		}
	}

	//场馆预定
	public function appointment(){
		$uid=Auth::$uid;
		$sport_id=$this->request->param('activity_id','','intval');
		if(!Sport_Model::checkExist(['id'=>$sport_id])){
			return Response::Error("参数错误");
		}
		$name=$this->request->param('name');
		$phone=$this->request->param('phone');
		$during=$this->request->param('during');
		$remarks=$this->request->param('remarks');

		if(SportAppointmentRecord::checkExist(['uid'=>$uid,'sport_id'=>$sport_id])){
			return Response::Error("已经预定");
		}
		$data['sport_id'] = $sport_id;
		$data['uid'] = $uid;
		$data['name'] = $name;
		$data['phone'] = $phone;
		$data['during'] = $during;
		$data['remarks'] = $remarks;

		$res = SportAppointmentRecord::create($data);
		if(empty($res)){
			return Response::Error("预定失败");
		}else{
			return Response::Okdata([],"预定成功");
		}
	}
	//Sport_img
	public function getSportImgList()
	{
		$sport_id = $this->request->param('id');
		$list = SportImg::getAll(['sport_id'=>$sport_id],'*','sort desc');

		return Response::Okdata($list, 'get data success');
	}
}
