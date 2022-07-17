<?php
namespace app\wxapp\controller;

use app\BaseController;
use app\base\Response;
use app\common\model\ActivitySignupRecord;
use app\common\model\Content as ContentModel;
use app\common\model\Activity as ActivityModel;
use app\common\model\Follow;
use app\common\model\Sport as SportModel;
use app\wxapp\model\Member;
use app\wxapp\middleware\Auth;

class Index extends BaseController
{
	//搜索
	public function getSearchList()
	{
		$uid = Auth::$uid;
		$title = $this->request->param('title');
		$type = $this->request->param('type');
		if(empty($title)){
			return Response::Okdata([], 'get data success');
		}
		$where1[] =['title','like',"%{$title}%"];
		$list1 = ActivityModel::getAll($where1,'id,title,type','sort desc',function ($data){
			$data->map(function ($item){
				$item->append(['type_name']);
			});
		});
		$where2[] =['title','like',"%{$title}%"];
		$where2[] =['id','not in','1,2,3,4'];
		$list2 = ContentModel::getAll($where2,'id,title','sort desc',function ($data){
			$data->map(function ($item){
				$item->type_name = '体育资讯';
				$item->type = 4;
			});
		});
		$where3[] =['title','like',"%{$title}%"];
		$list3 = SportModel::getAll($where3,'id,title','sort desc',function ($data){
			$data->map(function ($item){
				$item->type_name = '体育场馆';
				$item->type = 5;
			});
		});
		$where4[] =['username','like',"%{$title}%"];
		$where4[] =['uid','=',$uid];
		$list4 = Follow::getAll($where4,'b_uid as id,username as title','sort desc',function ($data){
			$data->map(function ($item){
				$item->type_name = '关注';
				$item->type = 6;
			});
		});
		if($type=='all'){
			$list = array_merge($list1->toArray(),$list2->toArray(),$list3->toArray(),$list4->toArray());
		}elseif ($type=='sports_news'){
			$list = $list2;
		}elseif ($type=='sports'){
			$list = $list3;
		}elseif ($type=='activities'){
			$list = $list1;
		}elseif ($type=='my_fllow'){
			$list = $list4;
		}else{
			$list = [];
		}

		return Response::Okdata($list, 'get data success');
	}


	//获取文章数据
    public function getContentData()
    {
    	$id = $this->request->param('id');
    	$info = ContentModel::getOne(['id'=>$id],'*');
	    $url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'].'/';
	    $info['content']=str_replace('../',$url,$info['content']);
	    $info['content'] = str_replace("<img ", "<img style='max-width:100%;height:auto;'", $info['content']);
	    return Response::Okdata($info, 'get data success');
    }

    //获取首页精彩推荐
	public function getRecommend(){
		$token = $this->request->param('token');
		$user_id = Member::getOneField(['token'=>$token],'id');

		$a_list = ActivityModel::where(['is_pop'=>1])->field('id,image,signup_start_time,signup_end_time,start_time,end_time')
		                      ->order('create_time desc')
		                      ->limit(3)
		                      ->select();
		//is_signup 1已报名 2报名中 3 已结束
		$a_list->map(function($item)use($user_id){
			$item->type=2;
			$item->is_signup = ActivityModel::getIsSignup($user_id,$item);
			$item->append(['start_tm']);
		});
		$list = array_merge([],$a_list->toArray());
		return Response::Okdata($list, 'get data success');
	}


}
