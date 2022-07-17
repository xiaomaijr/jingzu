<?php
namespace app\wxapp\controller;

use app\BaseController;
use app\base\Response;
use app\common\model\Content as ContentModel;
use app\common\model\Activity as ActivityModel;

class Index extends BaseController
{
	//搜索
	public function getSearchList()
	{
		$title = $this->request->param('title');
		if(empty($title)){
			return Response::Okdata([], 'get data success');
		}
		$where[] =['title','like',"%{$title}%"];
		$list1 = ActivityModel::getAll($where,'id,title,type','sort desc',function ($data){
			$data->map(function ($item){
				$item->append(['type_name']);
			});
		});
		$where[] =['id','not in','1,2,3,4'];
		$list2 = ContentModel::getAll($where,'id,title','sort desc',function ($data){
			$data->map(function ($item){
				$item->type_name = '体育资讯';
			});
		});
		$list = array_merge($list1->toArray(),$list2->toArray());
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
//    	$c_list = ContentModel::where([])->field('id,image')
//	                      ->order('giveup desc')
//	                      ->limit(1)
//	                      ->select();
//		$c_list->map(function($item){
//			$item->type=1;
//		});
		$a_list = ActivityModel::where([])->field('id,image,activity_time')
		                      ->order('create_time desc')
		                      ->limit(3)
		                      ->select();
		$a_list->map(function($item){
			$item->type=2;
			$item->append(['is_signup']);
		});
		$list = array_merge([],$a_list->toArray());
		return Response::Okdata($list, 'get data success');
	}


}
