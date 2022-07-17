<?php


namespace app\admin\controller;

use app\admin\model\CommissionPer;
use app\admin\model\CommissionRecord;
use app\admin\model\Order as OrderModel;
use app\base\Response;
use think\facade\Db;
use think\facade\Request;

class Order extends BaseIndex
{
    /**
     * description 获取列表
     */
    public function getOrderList()
    {
        $start_date = $this->request->param('start_date','','');
        $end_date = $this->request->param('end_date','','');
        $status = $this->request->param('status','','');
        $order_sn = $this->request->param('order_sn','','');

        $page = input('page') ? input('page') : 1;
        $limit = input('limit') ? input('limit') : 20;
	    $where = [];
	    $where[] = ['is_show','=',1];
        if(!empty($status)){
            $where[] = ['status','=',$status];
        }
        if(!empty($order_sn)){
            $where[] = ['order_sn','=',$order_sn];
        }
        if(!empty($start_date)&&!empty($end_date)){
            $where[] = ['create_time','between',[strtotime($start_date),strtotime($end_date)]];
        }
        $result =OrderModel::where($where)->limit(($page - 1) * $limit, $limit)->order('id desc')->select();
        foreach ($result as $k=>$v){
            $v->append(['sure_time','user_info','commission_def','user_phone']);
            $v->nickname =  userTextDecode($v['nickname']);

            $result[$k] = $v;
        }
        $count = OrderModel::where($where)->count();
        $data = [
            'data' => $result,
            'count' => $count,
            'code' => 0,
            'current_page' => $page,
            'max_page' => ceil($count / $limit),
            'sql' => OrderModel::getLastSql()
        ];
        return Response::Okdata($data, 'get data success');

    }

	/**
	 * 修改状态
	 */
	public function edit()
	{
		$id = $this->request->param('id');
		$status = $this->request->param('status');
		$price_eval = $this->request->param('price_eval');
		$is_distribution = $this->request->param('is_distribution');
		$commission = $this->request->param('commission','',0);
		if(empty($status)){
			return Response::Error('请选择');
		}
		if($status==2&&empty($price_eval)){
			return Response::Error('请输入估价');
		}elseif($status==2&&!empty($price_eval)){
			$data['price_eval']=$price_eval;
		}elseif ($status==3){
			$data['com_time']=time();
//			if($is_distribution=='on'){
//				$data['is_distribution']=1;
//			}
			$order = OrderModel::getOne(['id'=>$id])->append(['user_info']);
			if(!empty($order['user_info']['share_pid'])&&$order['user_info']['is_distribution']!=1){
				$data['is_distribution']=1;
			}
			$data['commission']=$commission;
		}
		$data['status']=$status;
		$res = OrderModel::where('id',$id)->update($data);
		if($res){
			return Response::Ok('修改成功');
		} else {
			return Response::Error('修改失败');
		}
	}
	/**
	 * 修改备注
	 */
	public function editBz()
	{
		$id = $this->request->param('id');
		$describe = $this->request->param('describe');
		if(empty($describe)||empty($id)){
			return Response::Error('参数错误');
		}

		$res = OrderModel::where('id',$id)->update(['describe'=>$describe]);
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
		$res = OrderModel::where($data)->delete();
		if($res){
			return Response::Ok('删除成功');
		} else {
			return Response::Error('删除失败');
		}
	}

	/**
	 * description 获取分销订单列表
	 */
	public function getOrderDisList()
	{
		$start_date = $this->request->param('start_date','','');
		$end_date = $this->request->param('end_date','','');
		$is_fp = $this->request->param('is_fp','','');
		$order_sn = $this->request->param('order_sn','','');

		$page = input('page') ? input('page') : 1;
		$limit = input('limit') ? input('limit') : 20;
		$where = [];
		$where[] = ['is_show','=',1];
		$where[] = ['is_distribution','=',1];
		if($is_fp==1){
			$where[] = ['is_fp','=',1];
		}else if($is_fp==2){
			$where[] = ['is_fp','=',0];
		}
		if(!empty($order_sn)){
			$where[] = ['order_sn','=',$order_sn];
		}
		if(!empty($start_date)&&!empty($end_date)){
			$where[] = ['create_time','between',[strtotime($start_date),strtotime($end_date)]];
		}
		$result =OrderModel::where($where)->limit(($page - 1) * $limit, $limit)->order('id desc')->select();
		foreach ($result as $k=>$v){
			$v->append(['sure_time','user_info']);
			$v->nickname =  userTextDecode($v['nickname']);

			$result[$k] = $v;
		}
		$count = OrderModel::where($where)->count();
		$data = [
			'data' => $result,
			'count' => $count,
			'code' => 0,
			'current_page' => $page,
			'max_page' => ceil($count / $limit),
			'sql' => OrderModel::getLastSql()
		];
		return Response::Okdata($data, 'get data success');

	}

	/**
	 * 修改分销订单状态
	 */
	public function editDis()
	{
		$id = $this->request->param('id');
		$is_fp = $this->request->param('is_fp');

		if($is_fp=='on'){
			$data['is_fp']=1;
		}
		$data['alter_time']=time();
		$order = OrderModel::getOne(['id'=>$id])->append(['user_info']);
		// 启动事务
		Db::startTrans();
		try {
			$res = OrderModel::where('id',$id)->update($data);
			if(!$res){
				Db::rollback();
				return Response::Error('修改失败');
			}
			if(!CommissionRecord::checkExist(['order_id'=>$id])){
				$com_res = CommissionRecord::create(['uid'=>$order['user_info']['share_pid'],'order_id'=>$id,'commission'=>$order['commission']]);
				if(!$com_res->id){
					Db::rollback();
					return Response::Error('修改失败');
				}
			}
			// 提交事务
			Db::commit();
			return Response::Ok('修改成功');
		} catch (\Exception $e) {
			// 回滚事务
			Db::rollback();
		}
	}

	/**
	 * 分销比列list
	 */
	public function getPerList()
	{
		//组合查询条件
		$where = [];

		$list = CommissionPer::getList($where, '*', 'id desc', 'id', function ($data) {
//			$data->append(['remark']);
		}, ' id ');

		return Response::Okdata($list, 'get article attr list success');
	}

	/**
	 * description 新增分销比列
	 */
	public function addPer()
	{
		$data = $this->checkForm();
		if (is_string($data)) {
			return Response::Error($data);
		}
		$data['create_time'] = time();
		$result = CommissionPer::insertGetId($data);

		if ($result) {
			return Response::Ok('添加成功');
		} else {
			return Response::Error('添加失败');
		}
	}

	/**
	 * description 修改分销比列
	 */
	public function editPer()
	{
		$id = $this->request->param('id');
		if(empty($id) || !is_numeric($id)){
			return Response::Error('非法访问');
		}
		$data = $this->checkForm();
		if(is_string($data)){
			return Response::Error($data);
		}

		$data['alter_time'] = time();
		$where['id']=$id;
		$result = CommissionPer::where($where)->update($data);
		if($result){
			return Response::Ok('修改成功');
		}else{
			return Response::Error('修改失败');
		}
	}

	/**
	 * 删除分销比列
	 */
	public function delPer()
	{
		$id = $this->request->param('id');
		$result = CommissionPer::del(['id' => $id]);
		if ($result) {
			return Response::Ok('删除成功');
		} else {
			return Response::Error('删除失败');
		}
	}

	/**
	 * @return array|string
	 * description 表单验证分销比列
	 */
	private function checkForm()
	{
		$data = [];
		$data['min'] = $this->request->param('min');
		$data['max'] = $this->request->param('max');

		if($data['min']>$data['max']){
			return '请输入正确的值范围';
		}
		$data['commission'] = $this->request->param('commission');
		return $data;
	}


	//获取导出数据
	public function getOrderAll()
	{
		$department = $this->request->param('department','','intval');
		$position = $this->request->param('position','','intval');
		$username = $this->request->param('username','','trim');
		$phone = $this->request->param('phone','','trim');

		$where = 'is_show=1 and is_distribution = 0';
		if(!empty($phone)){
			$where .= "and phone = $phone";
		}

		$list = OrderModel::field('*')
		                   ->where($where)
		                   ->select();
//		foreach ($list as $k=>$v){
//			$department =\app\model\MemberDp::field('id,title')->get($v['companyid']);
//			$list[$k]['departmentname'] = empty($department)?'':$department['title'];
//			$position =\app\model\MemberDp::field('id,title')->get($v['departmentid']);
//			$list[$k]['positionname'] = empty($position)?'':$position['title'];
//		}
		$data= array();
		$data['menu'][]='id';
		$data['menu'][]='订单号';
		$data['menu'][]='收机类型';
		$data['menu'][]='手机名称';
		$data['menu'][]='数量';
		$data['menu'][]='状态';
		$data['menu'][]='收件人名称';
		$data['menu'][]='收件人手机号';
		$i=0;
		foreach ($list as $k=>$v){
			$data['data'][$i][] = $v['id'];
			$data['data'][$i][] = $v['order_sn'];
			if($v['type']==1){
				$data['data'][$i][] = '快递';
			}elseif ($v['type']==2){
				$data['data'][$i][] = '上门';
			}elseif ($v['type']==3){
				$data['data'][$i][] = '线下';
			}else{
				$data['data'][$i][] = '';
			}
			$data['data'][$i][] = $v['good_name'];
			$data['data'][$i][] = $v['good_num'];
			if($v['status']==1&&!$v['is_send']){
				$data['data'][$i][] = '待发货';
			}elseif($v['status']==1&&$v['is_send']){
				$data['data'][$i][] = '待质检';
			}elseif($v['status']==2){
				$data['data'][$i][] = '待确认';
			}elseif($v['status']==3){
				$data['data'][$i][] = '已完成';
			}
			$data['data'][$i][] = $v['receiver'];
			$data['data'][$i][] = $v['receiver_phone'];
			$i++;
		}
		return Response::Okdata($data, 'get data success');
	}

	//获取导出分销数据
	public function getOrderDisAll()
	{
		$department = $this->request->param('department','','intval');
		$position = $this->request->param('position','','intval');
		$username = $this->request->param('username','','trim');
		$phone = $this->request->param('phone','','trim');

		$where = 'is_show=1 and is_distribution = 1';
		if(!empty($phone)){
			$where .= "and phone = $phone";
		}

		$list = OrderModel::field('*')
		                  ->where($where)
		                  ->select();
//		foreach ($list as $k=>$v){
//			$department =\app\model\MemberDp::field('id,title')->get($v['companyid']);
//			$list[$k]['departmentname'] = empty($department)?'':$department['title'];
//			$position =\app\model\MemberDp::field('id,title')->get($v['departmentid']);
//			$list[$k]['positionname'] = empty($position)?'':$position['title'];
//		}
		$data= array();
		$data['menu'][]='id';
		$data['menu'][]='订单号';
		$data['menu'][]='收机类型';
		$data['menu'][]='手机名称';
		$data['menu'][]='数量';
		$data['menu'][]='状态';
		$data['menu'][]='收件人名称';
		$data['menu'][]='收件人手机号';
		$i=0;
		foreach ($list as $k=>$v){
			$data['data'][$i][] = $v['id'];
			$data['data'][$i][] = $v['order_sn'];
			if($v['type']==1){
				$data['data'][$i][] = '快递';
			}elseif ($v['type']==2){
				$data['data'][$i][] = '上门';
			}elseif ($v['type']==3){
				$data['data'][$i][] = '线下';
			}else{
				$data['data'][$i][] = '';
			}
			$data['data'][$i][] = $v['good_name'];
			$data['data'][$i][] = $v['good_num'];
			if($v['status']==1&&!$v['is_send']){
				$data['data'][$i][] = '待发货';
			}elseif($v['status']==1&&$v['is_send']){
				$data['data'][$i][] = '待质检';
			}elseif($v['status']==2){
				$data['data'][$i][] = '待确认';
			}elseif($v['status']==3){
				$data['data'][$i][] = '已完成';
			}
			$data['data'][$i][] = $v['receiver'];
			$data['data'][$i][] = $v['receiver_phone'];
			$i++;
		}
		return Response::Okdata($data, 'get data success');
	}

}
