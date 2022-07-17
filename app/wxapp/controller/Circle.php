<?php
namespace app\wxapp\controller;

use app\BaseController;
use app\base\Response;
use app\common\model\Follow;
use app\common\model\Sport as Sport_Model;
use app\common\model\SportColRecord;
use app\common\model\SportComment;
use app\common\model\SportUpRecord;
use app\common\model\Topic;
use app\common\model\TopicColRecord;
use app\common\model\TopicComment;
use app\common\model\TopicCommentUpRecord;
use app\common\model\TopicUpRecord;
use app\wxapp\middleware\Auth;
use app\wxapp\model\Member;
use think\facade\Db;

class Circle extends BaseController
{
	//发布话题
	public function submitTopic()
	{
		$uid=Auth::$uid;

		$title=$this->request->param('title','','trim');
		$description=$this->request->param('description','','trim');
		$content=$this->request->param('content','','trim');
		$address=$this->request->param('address','','trim');
		$video=$this->request->param('video','','trim');
		$sport_id=$this->request->param('sport_id','','intval');
		$now = time();

		$data=array();
		$data['uid']=$uid;
		$data['title']=$title;
		$data['description']=userTextEncode($description);
		$data['content']=json_encode($content);
		$data['video']=$video;
		$data['address']=$address;
		$data['sport_id']=$sport_id;
		$data['status'] =1;//0审核通过1审核中2审核不通过
		$data['create_time']=$now;
		$res=Topic::create($data);
		if($res->id){
			return Response::Okdata(1,"发布成功");
		}else{
			return Response::Error("发布失败");
		}
	}
	//Circle
    public function getCircleList()
    {
	    $uid=Auth::$uid;
	    $list = Topic::getList(['status'=>0,'is_release'=>1],'*','id desc','',function($data)use($uid){
		    $data->map(function($item)use($uid){
			    $item->append(['user_info','c_time','contents']);
			    $item->is_dzan = Topic::getIsDzan($uid,$item->id);
		    	return $item;
		    });
	    });

	    return Response::Okdata($list, 'get data success');
    }
	//我的动态Circle
	public function getMyCircleList()
	{
		$uid=Auth::$uid;
		$Buid=$this->request->param('id');;
		$list = Topic::getList(['status'=>0,'is_release'=>1,'uid'=>$Buid],'*','id desc','',function($data)use($uid){
			$data->map(function($item)use($uid){
				$item->append(['user_info','c_time','contents']);
				$item->is_dzan = Topic::getIsDzan($uid,$item->id);
				return $item;
			});
		});

		return Response::Okdata($list, 'get data success');
	}
	//Circle
	public function getCircleInfo()
	{
		$id = $this->request->param('id');
		$uid=Auth::$uid;
		$info = Topic::getOne(['id'=>$id],'*')->append(['user_info']);
		if(Follow::checkExist(['uid'=>$uid,'b_uid'=>$info['uid'],'status'=>1])){
			$info->is_follow = 1;
		}else{
			$info->is_follow = 0;
		}
		$info->giveup = TopicUpRecord::getCount(['aid'=>$id,'status'=>1]);
		$info->num = TopicComment::getCount(['aid'=>$id]);
		$info->is_dzan = Topic::getIsDzan($uid,$id);
		$info->is_collect = Topic::getIsCollect($uid,$id);
		$info->append(['contents','user_info']);
		return Response::Okdata($info, 'get data success');
	}

	//获取Circle评论
	public function getCircleCommentList()
	{
		$id = $this->request->param('id');
		$list = TopicComment::getList(['aid'=>$id],'*','sort desc','',function($data){
			$data->map(function($item){
				$uid=Auth::$uid;
				$item->append(['user_info']);
				$item->is_dzan = Topic::getCommentIsDzan($uid,$item->id);
				return $item;
			});
		});

		return Response::Okdata($list, 'get data success');
	}

	//点赞
	public function givetup(){
		$uid=Auth::$uid;
		$aid=$this->request->param('aid','','intval');//文章id
		if(empty($aid)){
			return Response::Error("点赞失败");
		}
		$res=TopicUpRecord::getOne(['uid'=>$uid,'aid'=>$aid],'id,status');
		if(empty($res)){
			$data = ['aid'=>$aid,'uid'=>$uid,'status'=>1];
			$res = TopicUpRecord::create($data);
			if(empty($res)){
				return Response::Error("点赞失败");
			}else{
				$num=TopicUpRecord::where(['status'=>1,'aid'=>$aid])->count();
				Topic::update(['giveup'=>$num],['id'=>$aid]);
				return Response::Okdata($num,"点赞成功");
			}
		}else{
			if($res['status']){
				$rescs=TopicUpRecord::where('id',$res['id'])->update(['status'=>0]);
				if($rescs){
					$num=TopicUpRecord::where(['status'=>1,'aid'=>$aid])->count();
					Topic::update(['giveup'=>$num],['id'=>$aid]);
					return Response::Okdata($num,"取消点赞成功");
				}else{
					return Response::Error("取消点赞失败");
				}
			}else{
				$rescs=TopicUpRecord::where('id',$res['id'])->update(['status'=>1]);
				if($rescs){
					$num=TopicUpRecord::where(['status'=>1,'aid'=>$aid])->count();
					Topic::update(['giveup'=>$num],['id'=>$aid]);
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
		$res=TopicCommentUpRecord::getOne(['uid'=>$uid,'aid'=>$aid],'id,status');
		if(empty($res)){
			$data = ['aid'=>$aid,'uid'=>$uid,'status'=>1];
			$res = TopicCommentUpRecord::create($data);
			if(empty($res)){
				return Response::Error("点赞失败");
			}else{
				return Response::Okdata([],"点赞成功");
			}
		}else{
			if($res['status']){
				$rescs=TopicCommentUpRecord::where('id',$res['id'])->update(['status'=>0]);
				if($rescs){
					return Response::Okdata([],"取消点赞成功");
				}else{
					return Response::Error("取消点赞失败");
				}
			}else{
				$rescs=TopicCommentUpRecord::where('id',$res['id'])->update(['status'=>1]);
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
		$res=TopicColRecord::getOne(['uid'=>$uid,'aid'=>$aid],'id,status');
		if(empty($res)){
			$data = ['aid'=>$aid,'uid'=>$uid,'status'=>1];
			$res = TopicColRecord::create($data);
			if(empty($res)){
				return Response::Error("收藏失败");
			}else{
				$num=TopicColRecord::where(['status'=>1,'aid'=>$aid])->count();
				Topic::update(['collect'=>$num],['id'=>$aid]);
				return Response::Okdata($num,"收藏成功");
			}
		}else{
			if($res['status']){
				$rescs=TopicColRecord::where('id',$res['id'])->update(['status'=>0]);
				if($rescs){
					$num=TopicColRecord::where(['status'=>1,'aid'=>$aid])->count();
					Topic::update(['collect'=>$num],['id'=>$aid]);
					return Response::Okdata($num,"取消收藏成功");
				}else{
					return Response::Error("取消收藏失败");
				}
			}else{
				$rescs=TopicColRecord::where('id',$res['id'])->update(['status'=>1]);
				if($rescs){
					$num=TopicColRecord::where(['status'=>1,'aid'=>$aid])->count();
					Topic::update(['collect'=>$num],['id'=>$aid]);
					return Response::Okdata($num,"收藏成功");
				}else{
					return Response::Error("收藏失败");
				}
			}
		}
	}
	//删除
	public function del(){
		$id = $this->request->param('id');
		if (empty($id) || !is_numeric($id)) {
			return Response::Error('非法访问');
		}
		$where = [
			'id' => $id
		];
		$result = Topic::where($where)->delete();
		if ($result) {
			TopicComment::where(['aid'=>$id])->delete();
			return Response::Ok('删除成功');
		} else {
			return Response::Error('删除失败');
		}
	}
}
