<?php
namespace app\wxapp\controller;

use app\BaseController;
use app\base\Response;
use app\common\model\AccountConf;
use app\common\model\ActivityComment;
use app\common\model\CommissionRecord;
use app\common\model\ContentComment;
use app\common\model\Distributor;
use app\common\model\MemberAddress;
use app\common\model\Order as Order_model;
use app\common\model\SportComment;
use app\common\model\TopicComment;
use app\wxapp\middleware\Auth;
use app\wxapp\model\Member;


class Comment extends BaseController
{

	//发布评论
	public function submitComment()
	{
		$uid = Auth::$uid;
		$type = $this->request->param('type');
		$data['aid'] = $this->request->param('aid');
		$data['description'] = $this->request->param('description');
		$data['status'] = 1;

		$data['create_time'] = time();
		$data['uid'] = $uid;
		if($type==1){//体育场馆
			$res = SportComment::create($data);
		}elseif ($type==2){//体育资讯
			$res = ContentComment::create($data);
		}elseif ($type==3){//圈子评论
			$res = TopicComment::create($data);
		}elseif ($type==4){//活动评论
			$res = ActivityComment::create($data);
		}
		if($res->id){
			return Response::Okdata([], '提交成功');
		} else {
			return Response::Error('提交失败');
		}
	}

	public function makeEwm($uid){
		$conf = AccountConf::getOne(['id'=>1]);
		$file_path1 = 'upload/qrcode/'.time().rand(10000,9999999).'.png';
		if(!is_dir('upload/qrcode')){
			mkdir("upload/qrcode");
		}
		$url="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={$conf['appid']}&secret={$conf['appsecret']}";
		$data=json_decode(file_get_contents($url),true);
		// $path="pages/product/detail?pro_id=$pid&u_id=".$uid;
		// $path="pages/register/register";
		$path="pages/index/index?share_id=".$uid;
		$width=350;
		$post_data='{"path":"'.$path.'","width":'.$width.'}';
		$code_url="https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=".$data['access_token'];
		$result=$this->api_notice_increment($code_url,$post_data);

		file_put_contents($file_path1,$result);
		return $file_path1;
	}

	public function api_notice_increment($url, $data){
		$ch = curl_init();
		$header = "Accept-Charset: utf-8";
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
//		curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 5.01; Windows NT 5.0)');
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_AUTOREFERER, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$tmpInfo = curl_exec($ch);
		if (curl_errno($ch)) {
			return false;
		}else{
			return $tmpInfo;
		}
	}

	//获取我的佣金
	public function getMyCommission()
	{
		$uid = Auth::$uid;
//		$where=['uid'=>$uid];
//		$list = CommissionRecord::getList($where, '*', ['sort'=>'asc','id'=>'asc']);

		$uids = Member::getAll(['share_pid'=>$uid,'is_distribution'=>0],'id','',function($data){
			return $data->isEmpty()?[]:array_unique(array_column($data->toArray(),'id'));
		});
		$where[] = ['is_distribution','=',1];
		$where[] = ['is_show','=',1];
		$where[]= ['is_fp','=',0];
		$where[] = ['uid','in',$uids];
		$list = Order_model::getList($where,'id,commission,create_time','id desc','',function ($data){
//			$data->append(['price','user_info','model_name','model_param','brand_img']);
		});
		$wjs = Order_model::where($where)->sum('commission');

		$list['zj'] = CommissionRecord::where(['uid'=>$uid])->sum('commission')+$wjs;
		$list['wjs'] = $wjs;
		return Response::Okdata($list, 'get data success');
	}

	//获取地址
	public function getAddressList()
	{
		$uid = Auth::$uid;
		$where=['uid'=>$uid];
		$list = MemberAddress::getList($where, '*', ['sort'=>'asc','id'=>'asc']);

		foreach ($list['data'] as $k=>$v){

		}
		return Response::Okdata($list, 'get data success');
	}
	//增加地址
	public function add()
	{
		$uid = Auth::$uid;
		$id = $this->request->param('id');
		$data = $this->checkForm();
		if (is_string($data)) {
			return Response::Error($data);
		}
		if(empty($id)){
			$data['create_time'] = time();
			$data['uid'] = $uid;
			$res = MemberAddress::create($data);
			if($res->id){
				return Response::Okdata([], '增加成功');
			} else {
				return Response::Error('增加失败');
			}
		}else{
			$data['alter_time'] = time();
			$data['id'] = $id;

			$res = MemberAddress::update($data);
			if($res){
				return Response::Ok('修改用户成功');
			} else {
				return Response::Error('修改用户失败');
			}
		}

	}
	//修改地址
	public function edit()
	{
		$data = $this->checkForm();
		if (is_string($data)) {
			return Response::Error($data);
		}
		$data['alter_time'] = time();
		$data['id'] = $this->request->param('id');

		$res = MemberAddress::update($data);
		if($res){
			return Response::Ok('修改用户成功');
		} else {
			return Response::Error('修改用户失败');
		}
	}
	//删除地址
	public function del()
	{
		$data['id'] = $this->request->param('id');
		$res = MemberAddress::where($data)->delete();
		if($res){
			return Response::Ok('删除用户成功');
		} else {
			return Response::Error('删除用户失败');
		}
	}
	//表单
	private function checkForm()
	{
		$data = [];
		$data['name'] = $this->request->param('name');
		if (empty($data['name']) || mb_strlen($data['name'], 'UTF8') > 50) {
			return '请输入昵称,并且不能超过50个字符';
		}
		$data['phone'] = $this->request->param('phone');
		$check = '/^(1(([35789][0-9])|(47)))\d{8}$/';
		if (!preg_match($check, $data['phone'])) {
			return '请输入正确的手机号码';
		}
		$default = $this->request->param('default');
		$data['default'] =0;
		if($default == 'true'){
			$data['default'] =1;
		}
		$data['address_shx'] = $this->request->param('address_shx');
		$data['address'] = $this->request->param('address');
		$data['province_id'] = $this->request->param('province_id','','0');
		$data['city_id'] = $this->request->param('city_id','','0');
		$data['area_id'] = $this->request->param('area_id','','0');
		return $data;
	}


}
