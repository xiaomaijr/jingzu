<?php


namespace app\admin\controller;

use app\admin\model\Role as RoleModel;
use app\base\Response;

class Role extends BaseIndex
{
    public function getRoleList()
    {
        $where=[];
        $list = RoleModel::getList($where, '*', ['sort'=>'asc','id'=>'asc']);
        foreach ($list['data'] as $k=>$v){
            $list['data'][$k]['ruleids']=json_encode(unserialize($v['ruleids']));
        }
        return Response::Okdata($list, 'get data success');
    }

    public function getRoleall(){
        $where=[];
        $list = RoleModel::where($where)->field('id,name')->select();
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
        $res = RoleModel::insert($data);
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
        $res = RoleModel::update($data);
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
        $res = RoleModel::where($data)->delete();
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
        $data['name'] = $this->request->param('name');
        if (empty($data['name']) || mb_strlen($data['name'], 'UTF8') > 50) {
            return '请输入名称,并且不能超过50个字符';
        }
        $qx=$this->request->param('qx');
        $data['rules'] = serialize($qx);
//        $ids = array_column($qx, 'id');
        $idss =[];
        $ids = [];
        foreach ($qx as $k=>$v){
            if(count($v['children'])){
                $ids=array_merge($ids,array_column($v['children'], 'id'));
                if(isset($v['children'])&&count($v['children'])){
                    foreach ($v['children'] as $kk=>$vv){
                        if(isset($vv['children'])&&count($vv['children'])){
                            $idss=array_merge($idss,array_column($vv['children'], 'id'));
                        }
                    }
                }
            }
        }

        $data['ruleids']=serialize($ids);
        $data['ruleidss']=serialize($idss);
        $data['description'] = $this->request->param('description');
        $data['sort'] = $this->request->param('sort');
//        if (!is_numeric($data['sort']) || $data['sort'] < 0) {
//            return '输入的排序只能是大于0的数字';
//        }
        return $data;
    }
}
