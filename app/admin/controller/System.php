<?php


namespace app\admin\controller;

use app\admin\model\Systerm as SystemModel;
use app\admin\model\SystermCondition;
use app\base\Response;
use think\facade\Request;

class System extends BaseIndex
{
	//返利列表
    public function getSystemList()
    {
        $id= $this->request->param('id',1,'intval');
//        $where="id <> 10";
        $where[]=['id','in',[1,2,3]];
        $list = SystemModel::getList($where, '*', ['sort'=>'asc','id'=>'asc'],'id',function($data){
        	return $data->map(function($item){
        		if($item->id==4){
			        $item->num = date('Y-m-d',$item->num);
		        }
		        return $item;
	        });
        });

        return Response::Okdata($list, 'get data success');
    }
    //返利编辑
    public function edit()
    {
        $data = $this->request->param();
        if (is_string($data)) {
            return Response::Error($data);
        }
        $data['alter_time'] = time();
        $data['id'] = $this->request->param('id');
        if($data['id']==4){
	        $data['num'] = strtotime($data['num']);
        }
        $res = SystemModel::update($data);
        if($res){
            return Response::Ok('修改成功');
        } else {
            return Response::Error('修改失败');
        }
    }
	//条件列表
	public function getSystemConditionList()
	{
		$id= $this->request->param('id',1,'intval');
//        $where="id <> 10";
		$where="";
		$list = SystermCondition::getList($where, '*', ['sort'=>'asc','id'=>'asc'],'id',function($data){
			return $data->map(function($item){
				$item['sub_date'] = date('Y-m-d',$item['sub_date']);
				$item['pay_date'] = date('Y-m-d',$item['pay_date']);
				$item['re_date'] = date('Y-m-d',$item['re_date']);
				return $item;
			});
		});

		return Response::Okdata($list, 'get data success');
	}
	//条件编辑
	public function editCondition()
	{
		$data = $this->request->param();
		if (is_string($data)) {
			return Response::Error($data);
		}
		$data['alter_time'] = time();
		$data['sub_date'] = strtotime($data['sub_date']);
		$data['pay_date'] = strtotime($data['pay_date']);
		$data['re_date'] = isset($data['re_date'])?strtotime($data['re_date']):'';
		$data['id'] = $this->request->param('id');
		$res = SystermCondition::update($data);
		if($res){
			return Response::Ok('修改成功');
		} else {
			return Response::Error('修改失败');
		}
	}


}
