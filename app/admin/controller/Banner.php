<?php


namespace app\admin\controller;

use app\admin\model\Banner as BannerModel;
use app\admin\model\Content;
use app\admin\model\Sport;
use app\admin\model\Activity;
use app\base\Response;
use think\Db;
use think\facade\Request;
use think\facade\Session;

class Banner extends BaseIndex
{
    public function getBannerList()
    {
	    $where=[];
        $list = BannerModel::getList($where, '*', ['sort'=>'desc','id'=>'desc'],'',function ($data){
	        return $data->map(function($item){
		        $info = Content::getOne(['id'=>$item->jumpid]);
		        if(!empty($info)){
			        $item->jumpname = $info['title'];
		        }
		        return $item;
	        });

        });
        return Response::Okdata($list, 'get data success');
    }

    public function getBannerall(){
        $where=[];
        $list = BannerModel::where($where)->field('id,name')->select();
        return Response::Okdata($list, 'get data success');
    }
    //增加
    public function add()
    {
        $data = $this->checkForm();
        if (is_string($data)) {
            return Response::Error($data);
        }
        $data['create_time'] = time();
        $res = BannerModel::insert($data);
        if($res){
            return Response::Ok('增加成功');
        } else {
            return Response::Error('增加失败');
        }
    }

    //编辑
    public function edit()
    {
        $data = $this->checkForm();
        if (is_string($data)) {
            return Response::Error($data);
        }
        $data['create_time'] = time();
        $data['id'] = $this->request->param('id');
        $url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'];
        $data['image']=str_replace($url,'',$data['image']);
        $res = BannerModel::update($data);
        if($res){
            return Response::Ok('修改成功');
        } else {
            return Response::Error('修改失败');
        }
    }
    //删除
    public function del()
    {
        $data['id'] = $this->request->param('id');
        $res = BannerModel::where($data)->delete();
        if($res){
            return Response::Ok('删除成功');
        } else {
            return Response::Error('删除失败');
        }
    }
    //表单品牌商banner
    private function checkForm()
    {
        $data = [];
        $data['image'] = $this->request->param('image');
        if (empty($data['image']) || mb_strlen($data['image']) > 150) {
            return '请上传图片';
        }
        $data['type'] = $this->request->param('type','','intval');
        $data['jumpid'] = $this->request->param('jumpid','','intval');
        $data['sort'] = $this->request->param('sort');
        return $data;
    }

    public function getJumpList(){
		$type = $this->request->param('type');
		if($type==1){//体育资讯
			$list = Content::getAll([['id','not in',[1,2,3,4]]],'id,title as name');
		}elseif ($type==2){//体育场地
			$list = Sport::getAll([],'id,title as name');
		}elseif ($type==3){//精彩活动
			$list = Activity::getAll(['type'=>1],'id,title as name');
		}elseif ($type==4){//线上赛事
			$list = Activity::getAll(['type'=>2],'id,title as name');
		}elseif ($type==5){//培训课程
			$list = Activity::getAll(['type'=>3],'id,title as name');
		}else{
			$list = [];
		}

	    return Response::Okdata($list, 'get data success');
    }
}
