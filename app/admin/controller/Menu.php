<?php


namespace app\admin\controller;

use app\admin\model\Menu as MenuModel;
use app\admin\model\Admin;
use app\admin\model\Role;
use app\base\Response;
use think\facade\Session;

class Menu extends BaseIndex
{
    public function getMenuList()
    {
        $pid = $this->request->param('pid');
        $where=['pid'=>$pid];
        $list = MenuModel::getList($where, '*', ['sort'=>'desc','id'=>'asc']);
        foreach ($list['data'] as $k=>$v){
            if(empty($v['pid'])){
                $list['data'][$k]['parent']='顶级菜单';
            }else{
                $map['id']=$v['pid'];
                $brand=MenuModel::where($map)->field('title')->find();
                $list['data'][$k]['parent']=$brand['title'];
            }
        }
        return Response::Okdata($list, 'get data success');
    }
    public function getMenuAll()
    {
        $access_token = $this->request->param('access_token');

        $admin=Admin::field('id,role,token')->where('token',$access_token)->find();
        if($admin['id']==1){
            $where=['pid'=>0];
            $list = MenuModel::where($where)->field('title,jump,icon,id')->order(['sort'=>'desc','id'=>'asc'])->select();
            foreach ($list as $k=>$v){
                $where=['pid'=>$v['id']];
                $listc = MenuModel::where($where)->field('title,jump,id')->order(['sort'=>'desc','id'=>'asc'])->select();
                $v['list']=$listc;
            }
        }else{
            $roles=Role::field('id,rules')->find($admin['role']);
            $data=unserialize($roles['rules']);
            foreach ($data as $kk=>$vv){
                $list[$kk]['title']=$vv['title'];
                $list[$kk]['icon']=$vv['icon'];
                $list[$kk]['id']=$vv['id'];
                $list[$kk]['list']=$vv['children'];
            }
        }
        return Response::Okdata($list, 'get data success');
    }
    public function getPower()
    {
        $where=['pid'=>0];
        $list = MenuModel::where($where)->field('title,icon,id')->select();
        foreach ($list as $k=>$v){
            $where=['pid'=>$v['id']];
            $listc = MenuModel::where($where)->field('title,jump,id')->select();
            $v['children']=$listc;
            foreach ($listc as $kk=>$vv){
                $where=['pid'=>$vv['id']];
                $listc = MenuModel::where($where)->field('title,jump,id')->select();
                $vv['children']=$listc;
            }
        }
        return Response::Okdata($list, 'get data success');
    }

    //增加品牌
    public function add()
    {
        $data = $this->checkForm();
        if (is_string($data)) {
            return Response::Error($data);
        }
        $data['create_time'] = time();
        $res = MenuModel::insert($data);
        if($res){
            return Response::Ok('增加成功');
        } else {
            return Response::Error('增加失败');
        }
    }
    //增加品牌
    public function edit()
    {
        $data = $this->checkForm();
        if (is_string($data)) {
            return Response::Error($data);
        }
        $data['create_time'] = time();
        $data['id'] = $this->request->param('id');
        $res = MenuModel::update($data);
        if($res){
            return Response::Ok('修改成功');
        } else {
            return Response::Error('修改失败');
        }
    }
    //删除品牌
    public function del()
    {
        $data['id'] = $this->request->param('id');
        $mm = MenuModel::field('id')->where('pid',$data['id'])->find();
        if(!empty($mm)){
            return Response::Error('请先删除子类');
        }
        $res = MenuModel::where($data)->delete();
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
        $data['title'] = $this->request->param('title','','trim');
        if (empty($data['title']) || mb_strlen($data['title'], 'UTF8') > 50) {
            return '请输入名称,并且不能超过50个字符';
        }
        $data['sort'] = $this->request->param('sort','','intval');
        if (!is_numeric($data['sort']) || $data['sort'] < 0) {
            return '输入的排序只能是大于0的数字';
        }
        $data['icon'] = $this->request->param('icon');
        $data['jump'] = $this->request->param('jump','','trim');
        $data['pid'] = $this->request->param('pid',0,'intval');
        $data['level'] = $this->request->param('level',1,'intval');
        return $data;
    }
}
