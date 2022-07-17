<?php


namespace app\admin\controller;

use app\common\model\Feedback as FeedbackModel;
use app\admin\model\Member;
use app\base\Response;
use think\facade\Request;

class Feedback extends BaseIndex
{
    public function getFeedbackList()
    {
        $where=[];
        $list = FeedbackModel::getList($where, '*', ['sort'=>'desc','id'=>'desc']);
        foreach ($list['data'] as $k=>$v){
//            $list['data'][$k]['name'] = Member::getOne($v['uid'])['username'];
        }
        return Response::Okdata($list, 'get data success');
    }

    //增加内容
    public function add()
    {
        $data = $this->checkForm();
        if (is_string($data)) {
            return Response::Error($data);
        }
        $data['create_time'] = time();
        $res = ContentModel::insert($data);
        if($res){
            return Response::Ok('增加成功');
        } else {
            return Response::Error('增加失败');
        }
    }
    //内容编辑
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
        $res = ContentModel::update($data);
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
        $res = FeedbackModel::where($data)->delete();
        if($res){
            return Response::Ok('删除成功');
        } else {
            return Response::Error('删除失败');
        }
    }
    //表单
    private function checkForm()
    {
        $data = [];
        $data['title'] = $this->request->param('title');
        if (empty($data['title']) || mb_strlen($data['title'], 'UTF8') > 50) {
            return '请输入名称,并且不能超过50个字符';
        }
        $data['type'] = $this->request->param('type','','intval');
        if(empty($data['type'])){
            return '请选择分类';
        }
        $data['image'] = $this->request->param('image');

        $data['description'] = $this->request->param('description');

        $data['content'] = $this->request->param('content');

        $data['sort'] = $this->request->param('sort');
        if (!is_numeric($data['sort']) || $data['sort'] < 0) {
            return '输入的排序只能是大于0的数字';
        }

        return $data;
    }
    //分类列表
    public function getContentTypeList()
    {
        $where=['status'=>0];
        $list = ContentType::getList($where, '*', ['sort'=>'asc','id'=>'asc']);

        return Response::Okdata($list, 'get data success');
    }
    //获取所有分类
    public function gettypeall(){
        $where=['status'=>0];
        $list = ContentType::where($where)->field('id,title')->select();
        return Response::Okdata($list, 'get data success');
    }
    //增加内容
    public function addt()
    {
        $data = $this->checkFormt();
        if (is_string($data)) {
            return Response::Error($data);
        }
        $data['create_time'] = time();
        $res = ContentType::insert($data);
        if($res){
            return Response::Ok('增加成功');
        } else {
            return Response::Error('增加失败');
        }
    }
    //内容编辑
    public function editt()
    {
        $data = $this->checkFormt();
        if (is_string($data)) {
            return Response::Error($data);
        }
        $data['create_time'] = time();
        $data['id'] = $this->request->param('id');

        $res = ContentType::update($data);
        if($res){
            return Response::Ok('修改成功');
        } else {
            return Response::Error('修改失败');
        }
    }
    //删除内容
    public function delt()
    {
        $data['id'] = $this->request->param('id');
        $res = ContentType::where($data)->setField('status',1);
        if($res){
            return Response::Ok('删除成功');
        } else {
            return Response::Error('删除失败');
        }
    }
    //表单
    private function checkFormt()
    {
        $data = [];
        $data['title'] = $this->request->param('title');
        if (empty($data['title']) || mb_strlen($data['title'], 'UTF8') > 50) {
            return '请输入名称,并且不能超过50个字符';
        }
        $data['sort'] = $this->request->param('sort');
        if (!is_numeric($data['sort']) || $data['sort'] < 0) {
            return '输入的排序只能是大于0的数字';
        }
        return $data;
    }

}
