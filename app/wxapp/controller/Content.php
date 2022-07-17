<?php
namespace app\wxapp\controller;

use app\BaseController;
use app\base\Response;
use app\common\model\Content as ContentModel;
use app\common\model\ContentColRecord;
use app\common\model\ContentComment;
use app\common\model\ContentCommentUpRecord;
use app\common\model\ContentUpRecord;
use app\wxapp\middleware\Auth;
use app\wxapp\model\Member;


class Content extends BaseController
{
    //获取文章列表
	public function getList(){
    	$flag = $this->request->param('flag','','intval');
    	$where[] = ['is_show','=',1];
    	$where[] = ['id','not in',[1,2,3,4]];
    	$list =	 ContentModel::getList($where,'*','click desc');

		return Response::Okdata($list, 'get data success');
	}
	//详情
    public function getInfo(){
	    $uid=Auth::$uid;
	    $id = $this->request->param('id');
    	$info = ContentModel::getOne(['id'=>$id]);
    	if(empty($info)){
		    return Response::Okdata([], 'get data success');
	    }
//	    ContentModel::where(['id'=>$id])->inc('click')->update();
	    if($id==4){
		    $info['content'] = json_decode($info['content'],true);
	    }
	    $url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'].'/';
	    $info['content']=str_replace('../',$url,$info['content']);
	    $info['content'] = str_replace("<img ", "<img style='max-width:100%;height:auto;'", $info['content']);
	    $info['num'] = ContentComment::getCount(['aid'=>$id]);
	    $info->is_dzan = ContentModel::getIsDzan($uid,$id);
	    $info->is_collect = ContentModel::getIsCollect($uid,$id);
	    return Response::Okdata($info, 'get data success');
    }
	//获取体育场馆评论
	public function getContentCommentList()
	{
		$id = $this->request->param('id');
		$list = ContentComment::getList(['aid'=>$id],'*','sort desc','',function($data){
			$data->map(function($item){
				$uid=Auth::$uid;
				$item->append(['user_info']);
				$item->is_dzan = ContentModel::getCommentIsDzan($uid,$item->id);
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
		$res=ContentUpRecord::getOne(['uid'=>$uid,'aid'=>$aid],'id,status');
		if(empty($res)){
			$data = ['aid'=>$aid,'uid'=>$uid,'status'=>1];
			$res = ContentUpRecord::create($data);
			if(empty($res)){
				return Response::Error("点赞失败");
			}else{
				$num=ContentUpRecord::where(['status'=>1,'aid'=>$aid])->count();
				ContentModel::update(['giveup'=>$num],['id'=>$aid]);
				return Response::Okdata($num,"点赞成功");
			}
		}else{
			if($res['status']){
				$rescs=ContentUpRecord::where('id',$res['id'])->update(['status'=>0]);
				if($rescs){
					$num=ContentUpRecord::where(['status'=>1,'aid'=>$aid])->count();
					ContentModel::update(['giveup'=>$num],['id'=>$aid]);
					return Response::Okdata($num,"取消点赞成功");
				}else{
					return Response::Error("取消点赞失败");
				}
			}else{
				$rescs=ContentUpRecord::where('id',$res['id'])->update(['status'=>1]);
				if($rescs){
					$num=ContentUpRecord::where(['status'=>1,'aid'=>$aid])->count();
					ContentModel::update(['giveup'=>$num],['id'=>$aid]);
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
		$res=ContentCommentUpRecord::getOne(['uid'=>$uid,'aid'=>$aid],'id,status');
		if(empty($res)){
			$data = ['aid'=>$aid,'uid'=>$uid,'status'=>1];
			$res = ContentCommentUpRecord::create($data);
			if(empty($res)){
				return Response::Error("点赞失败");
			}else{
				return Response::Okdata([],"点赞成功");
			}
		}else{
			if($res['status']){
				$rescs=ContentCommentUpRecord::where('id',$res['id'])->update(['status'=>0]);
				if($rescs){
					return Response::Okdata([],"取消点赞成功");
				}else{
					return Response::Error("取消点赞失败");
				}
			}else{
				$rescs=ContentCommentUpRecord::where('id',$res['id'])->update(['status'=>1]);
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
		$res=ContentColRecord::getOne(['uid'=>$uid,'aid'=>$aid],'id,status');
		if(empty($res)){
			$data = ['aid'=>$aid,'uid'=>$uid];
			$res = ContentColRecord::create($data);
			if(empty($res)){
				return Response::Error("收藏失败");
			}else{
				$num=ContentColRecord::where(['status'=>1,'aid'=>$aid])->count();
				ContentModel::update(['collect'=>$num],['id'=>$aid]);
				return Response::Okdata($num,"收藏成功");
			}
		}else{
			if($res['status']){
				$rescs=ContentColRecord::where('id',$res['id'])->update(['status'=>0]);
				if($rescs){
					$num=ContentColRecord::where(['status'=>1,'aid'=>$aid])->count();
					ContentModel::update(['collect'=>$num],['id'=>$aid]);
					return Response::Okdata($num,"取消收藏成功");
				}else{
					return Response::Error("取消收藏失败");
				}
			}else{
				$rescs=ContentColRecord::where('id',$res['id'])->update(['status'=>1]);
				if($rescs){
					$num=ContentColRecord::where(['status'=>1,'aid'=>$aid])->count();
					ContentModel::update(['collect'=>$num],['id'=>$aid]);
					return Response::Okdata($num,"收藏成功");
				}else{
					return Response::Error("收藏失败");
				}
			}
		}
	}
   }
