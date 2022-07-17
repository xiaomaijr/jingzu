<?php

namespace app\admin\controller;

use app\admin\model\Admin as adminModel;
use app\base\Response;
use think\facade\Request;

class Admin extends BaseIndex
{
    public function getAdminList()
    {
        $where=[];
        $list = adminModel::getList($where, '*', ['sort'=>'asc','id'=>'asc']);

//        foreach ($list['data'] as $k=>$v){
//            $list['data'][$k]['name']=Member::field('username')->get($v['agent_id'])['username'];
//        }
        return Response::Okdata($list, 'get data success');
    }

    public function change()
    {
        $data = $this->checkFormp();
        if(is_string($data)){
            return Response::Error($data);
        }
        $data['alter_time'] =time();
        $where = [
            'id' => 1
        ];
        $result = adminModel::where($where)->update($data);
        if($result){
            return Response::Ok('修改成功');
        }else{
            return Response::Error('修改失败');
        }
    }
    //增加
    public function add()
    {
        $data = $this->checkForm();
        if (is_string($data)) {
            return Response::Error($data);
        }
        $admim=adminModel::where('username',$data['username'])->find();
        if(!empty($admim)){
            return Response::Error('用户名重复');
        }
        $data['create_time'] = time();
        $res = adminModel::create($data);
        $aid=$res->id;
        if($res->id){
            $arr=array();
            $arr['token']=getUserTokens($aid);
            adminModel::where('id',$aid)->update($arr);
            return Response::Ok("增加管理员成功");
        } else {
            return Response::Error('增加管理员失败');
        }
    }
    //修改管理员
    public function edit()
    {
        $data = $this->checkForm();
        if (is_string($data)) {
            return Response::Error($data);
        }
	    $primary_password = $this->request->param('primary_password','','trim');
        $data['create_time'] = time();
        $data['id'] = $this->request->param('id');
        $info = adminModel::getOne(['id'=>$data['id']]);
        if($info['password'] != getAdminPassword($primary_password)){
	        return Response::Error('原密码错误');
        }

        $admim=adminModel::where('username',$data['username'])
            ->where('id','<>',$data['id'])->find();
        if(!empty($admim)){
            return Response::Error($data['id']);
        }
//        $url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'];
//        $data['image']=str_replace($url,'',$data['image']);

        $res = adminModel::update($data);
        if($res){
            return Response::Ok('修改管理员成功');
        } else {
            return Response::Error('修改管理员失败');
        }
    }
    //删除品牌
    public function del()
    {
        $data['id'] = $this->request->param('id');
        $res = adminModel::where($data)->delete();
        if($res){
            return Response::Ok('删除管理员成功');
        } else {
            return Response::Error('删除管理员失败');
        }
    }
    //表单
    private function checkForm()
    {
        $data = [];
        $data['username'] = $this->request->param('username');
        if (empty($data['username']) || mb_strlen($data['username'], 'UTF8') > 50) {
            return '请输入昵称,并且不能超过50个字符';
        }

//        $data['image'] = $this->request->param('image');
//        if (empty($data['image']) || mb_strlen($data['image']) > 150) {
//            return '请上传头像图片';
//        }
	    $id = $this->request->param('id');
        $data['role'] = $this->request->param('role');
        if ($id!=1&&empty($data['role'])) {
            return '请选择角色';
        }
        $data['email'] = $this->request->param('email');
        $data['phone'] = $this->request->param('phone');
        $check = '/^(1(([35789][0-9])|(47)))\d{8}$/';
//        if (!preg_match($check, $data['phone'])) {
//            return '请输入正确的手机号码';
//        }
        $data['sort'] = $this->request->param('sort',0,'intval');
        $data['status'] = $this->request->param('status',1);
        $data['password'] = $this->request->param('password','','trim');
        if(empty($data['password'])){
            return '请输入登录密码';
        }
        if (!preg_match('/^[_0-9a-z]{6,16}$/i',$data['password']))
        {
            return '密码必须是6-16位数字或字母组成';
        }
        $data['password'] = getAdminPassword($data['password']);

        $data['brand_id'] = $this->request->param('brand_id');
        $data['agent_id'] = $this->request->param('agent_id');
        return $data;
    }
    /**
     * @return array|string
     * description 表单验证
     */
    public function checkFormp()
    {
        $data = [];

        $data['password'] = $this->request->param('password');
        if(empty($data['password']) || mb_strlen($data['password'],'UTF8')<6|| mb_strlen($data['password'],'UTF8')>10){
            return '请输入密码,密码必须大于6个字符小于10个字符';
        }
        if(preg_match('/[\x{4e00}-\x{9fa5}]/u', $data['password'])>0){
            return '密码不能是汉字';
        }
        $data['password'] = getAdminPwd($this->request->param('password'));
        return $data;
    }

    public function editAdminCompanyIds(){
	    $data['id'] = $this->request->param('id');
	    $data['company_ids'] = $this->request->param('company_ids');
	    $data['alter_time'] = time();
	    $res = adminModel::update($data);
	    if($res){
		    return Response::Ok('修改成功');
	    } else {
		    return Response::Error('修改失败');
	    }
    }

}
