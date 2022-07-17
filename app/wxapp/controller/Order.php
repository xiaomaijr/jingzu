<?php

namespace app\wxapp\controller;

use app\BaseController;
use app\base\Response;
use app\common\model\MemberAddress;
use app\wxapp\middleware\Auth;
use app\wxapp\model\Member;
use app\common\model\Order as Order_model;
use app\common\model\Brand;
use app\common\model\BrandModel;
use app\common\model\BrandCapacity;
use app\common\model\BrandCondition;
use think\facade\Db;

class Order extends BaseController
{
	//获取订单列表
	public function getOrderList(){
		$uid= Auth::$uid;
		$type = $this->request->param('type');
		$where[] = ['is_show','=',1];
		$where[] = ['uid','=',$uid];
		if($type=='all'){
		}elseif ($type=='dfh'){
			$where[]= ['status','=',1];
			$where[]= ['is_send','=',0];
		}elseif ($type=='dzj'){
			$where[]= ['status','=',1];
			$where[]= ['is_send','=',1];
		}elseif ($type=='dsure'){
			$where[]= ['status','=',2];
		}elseif ($type=='complete'){
			$where[]= ['status','=',3];
		}
		$list = Order_model::getList($where,'*','id desc','',function ($data){
			$data->append(['price','brand_img','model_name','model_param']);
		});
		return Response::Okdata($list, 'get data success');
	}

	//取消订单
	public function canselOrder(){
		$uid= Auth::$uid;
		$id = $this->request->param('id');
		if(!Order_model::checkExist(['status'=>1,'uid'=>$uid,'id'=>$id])){
			return Response::Error('订单不存在');
		}
		$res = Order_model::destroy(['id'=>$id]);
		if($res){
			return Response::Okdata([], 'get data success');
		}else{
			return Response::Error('取消失败');
		}
	}

	//获取分销订单列表
	public function getOrderDisList(){
		$uid= Auth::$uid;
		$is_fp = $this->request->param('is_fp');
		$where[] = ['is_distribution','=',1];
		$where[] = ['is_show','=',1];
		$uids = Member::getAll(['share_pid'=>$uid,'is_distribution'=>0],'id','',function($data){
			return $data->isEmpty()?[]:array_unique(array_column($data->toArray(),'id'));
		});
		$where[] = ['uid','in',$uids];
		if($is_fp){
			$where[]= ['is_fp','=',1];
		}else{
			$where[]= ['is_fp','=',0];
		}
		$list = Order_model::getList($where,'*','id desc','',function ($data){
			$data->append(['price','user_info','model_name','model_param','brand_img']);
		});
		return Response::Okdata($list, 'get data success');
	}

	//获取订单详情
	public function getOrderInfo(){
		$uid= Auth::$uid;
		$id = $this->request->param('id');
		$where = ['id'=>$id];
		$info = Order_model::getOne($where,'*');
		$info->append(['price,user_info','brand_img','model_name','model_param']);
		return Response::Okdata($info, 'get data success');
	}

	//获取每月天数
	public function getMonthDays(){
		$month = $this->request->param('month');
		$time = strtotime(date('Y').'-'.$month);
		$info = get_day($time);
		return Response::Okdata($info, 'get data success');
	}

	//确认订单
	public function confirmorder()
	{
		$uid= Auth::$uid;
		if(request()->isPost()){
//			$receiver=$this->request->param('receiver');
//			$receiver_phone=$this->request->param('receiver_phone');
//			$address=$this->request->param('address');
//			$zfb_name=$this->request->param('zfb_name');
//			$express=$this->request->param('express');
//			$express_num=$this->request->param('express_num');
//			$sm_time=$this->request->param('sm_time');
//			$col_type=$this->request->param('col_type');
//			$type=$this->request->param('type','','intval');

			$purch_id = $this->request->param('purch_id');
			$bx_id = $this->request->param('bx_id');
			$brand_id=$this->request->param('brand_id');
			$model_id=$this->request->param('model_id');
			$capacity_id=$this->request->param('capacity_id');
			$condition_id=$this->request->param('condition_id');
			$photo=$this->request->param('photo');
			$price=$this->request->param('price');
			$num=$this->request->param('num');

			// 启动事务
			Db::startTrans();
			try{
				//生成订单
				$intedata=array();
				$intedata['order_sn']='hs'.$this->build_order_no();
				$intedata['uid']=$uid;
				$intedata['purch_id']=$purch_id;
				$intedata['bx_id']=$bx_id;
				$intedata['brand_id']=$brand_id;
				$intedata['model_id']=$model_id;
				$intedata['capacity_id']=$capacity_id;
				$intedata['condition_id']=$condition_id;
				$intedata['photo']=$photo;

				$intedata['good_name']=$this->getGoodName($brand_id,$model_id,$capacity_id,$condition_id);
				$intedata['price']=$price;
				$intedata['price_eval']=$price;
				$intedata['good_num']=$num;
//				$intedata['receiver']=$receiver;
//				$intedata['receiver_phone']=$receiver_phone;
//				$intedata['address']=$address;
//				$intedata['col_type']=$col_type;
//				$intedata['zfb_name']=$zfb_name;
//				$intedata['express']=$express;
//				$intedata['express_num']=$express_num;

				$intedata['create_time']=time();
				$intedata['status']=1;
				$reso=Order_model::create($intedata);

				if(($reso->id)){
					// 提交事务
					Db::commit();
					return Response::Okdata($reso,"提交成功");
				}else{
					// 回滚事务
					Db::rollback();
					return Response::Error("提交失败");
				}
			} catch (\Exception $e) {
				// 回滚事务
				Db::rollback();
				return Response::Error("提交失败");
			}
		}
	}
	//确认价格
	public function sureOrder()
	{
		$uid= Auth::$uid;
		if(request()->isPost()){
			$id=$this->request->param('id');
			// 启动事务
			Db::startTrans();
			try{
				$intedata['sure_time']=time();
				$intedata['is_sure']=1;
				$reso=Order_model::where(['id'=>$id])->update($intedata);

				if(($reso)){
					// 提交事务
					Db::commit();
					return Response::Okdata($reso,"提交成功");
				}else{
					// 回滚事务
					Db::rollback();
					return Response::Error("提交失败");
				}
			} catch (\Exception $e) {
				// 回滚事务
				Db::rollback();
				return Response::Error("提交失败");
			}
		}
	}
	//获取默认地址
	public function getDefaultAddress(){
		$uid= Auth::$uid;
		$info = MemberAddress::getOne(['uid'=>$uid],'*','',['default'=>'desc','create_time'=>'desc']);
		return Response::Okdata($info, 'get data success');
	}
	//寄送
	public function sendOrder()
	{
		$uid= Auth::$uid;
		if(request()->isPost()){
			$id=$this->request->param('id');
			$receiver=$this->request->param('receiver');
			$receiver_phone=$this->request->param('receiver_phone');
			$address=$this->request->param('address');
			$address_shx=$this->request->param('address_shx');
			$zfb_name=$this->request->param('zfb_name');
			$wx_name=$this->request->param('wx_name');
			$bank_name=$this->request->param('bank_name');
			$bank_num=$this->request->param('bank_num');
			$express=$this->request->param('express');
			$express_num=$this->request->param('express_num');
			$sm_time=$this->request->param('sm_time');
			$col_type=$this->request->param('col_type');
			$type=$this->request->param('type','','intval');

			// 启动事务
			Db::startTrans();
			try{
				//生成订单
				$intedata=array();
				$intedata['type']=$type;
				$intedata['sm_time']=$sm_time;

				$intedata['receiver']=$receiver;
				$intedata['receiver_phone']=$receiver_phone;
				$intedata['address']=$address;
				$intedata['address_shx']=$address_shx;
				$intedata['col_type']=$col_type;
				$intedata['zfb_name']=$zfb_name;
				$intedata['wx_name']=$wx_name;
				$intedata['bank_name']=$bank_name;
				$intedata['bank_num']=$bank_num;
				$intedata['express']=$express;
				$intedata['express_num']=$express_num;

				$intedata['alter_time']=time();
				$intedata['is_send']=1;
				$reso=Order_model::where(['id'=>$id])->update($intedata);

				if(($reso)){
					// 提交事务
					Db::commit();
					return Response::Okdata($reso,"提交成功");
				}else{
					// 回滚事务
					Db::rollback();
					return Response::Error("提交失败");
				}
			} catch (\Exception $e) {
				// 回滚事务
				Db::rollback();
				return Response::Error("提交失败");
			}
		}
	}
	//删除已完成的订单
	public function delOrder()
	{
		$uid= Auth::$uid;
		if(request()->isPost()){
			$id=$this->request->param('id');
			// 启动事务
			Db::startTrans();
			try{
				$intedata['alter_time']=time();
				$intedata['is_show']=0;
				$reso=Order_model::where(['id'=>$id])->update($intedata);
				if(($reso)){
					// 提交事务
					Db::commit();
					return Response::Okdata($reso,"提交成功");
				}else{
					// 回滚事务
					Db::rollback();
					return Response::Error("提交失败");
				}
			} catch (\Exception $e) {
				// 回滚事务
				Db::rollback();
				return Response::Error("提交失败");
			}
		}
	}

	public function getGoodName($brand_id,$model_id,$capacity_id,$condition_id){
		$brand = Brand::getOneField(['id'=>$brand_id],'title');
		$model = BrandModel::getOneField(['id'=>$model_id],'title');
		$capacity = BrandCapacity::getOneField(['id'=>$capacity_id],'title');
		$condition = BrandCondition::getOneField(['id'=>$condition_id],'title');

		return $brand.$model.$capacity.$condition;
	}
	public function build_order_no(){
		return date('Ymd').substr(implode(NULL, array_map('ord', str_split(substr(uniqid(), 7, 13), 1))), 0, 8);
	}
}
