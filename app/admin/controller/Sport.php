<?php


namespace app\admin\controller;

use app\admin\model\Sport as SportModel;
use app\admin\model\SportImg;
use app\admin\model\Member;
use app\base\Response;
use app\common\model\SportAppointmentRecord;
use app\common\model\SportComment;
use htsc\Request;

class Sport extends BaseIndex
{
    public function getSportList()
    {
	    $title = $this->request->param('title');
	    $type = $this->request->param('type');
	    $where = [];
	    if(!empty($title)){
		    $where[]=['title','like','%'.$title.'%'];
	    }
	    if(!empty($type)) {
		    $where[] = [ 'type', '=', $type ];
	    }
        $list = SportModel::getList($where, '*', ['id'=>'asc']);

        foreach ($list['data'] as $k=>$v){

        }
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
        $res = SportModel::insert($data);
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
        if(!empty($data['image'])){
            $data['image']=str_replace($url,'',$data['image']);
        }
	    if(!empty($data['logo'])){
		    $data['logo']=str_replace($url,'',$data['logo']);
	    }
        $res = SportModel::update($data);
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
        $res = SportModel::where($data)->delete();
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
        $data['logo'] = $this->request->param('logo');
        $data['image'] = $this->request->param('image');
//	    if (empty($data['image'])) {
//		    return '请上传图片';
//	    }
	    $data['parameter1'] = $this->request->param('parameter1');
	    if($data['parameter1']>5){
		    return '评分范围是1-5';
	    }
	    $data['parameter2'] = $this->request->param('parameter2');
	    $data['parameter3'] = $this->request->param('parameter3');
	    $data['address'] = $this->request->param('address','','trim');
	    $res=self::getjw($data['address']);
	    $res=json_decode($res);
	    if(isset($res->status)&&($res->status==0)){
		    $data['lng'] = $res->result->location->lng;
		    $data['lat'] = $res->result->location->lat;
	    }else{
		    return '请输入正确的地址';
	    }
	    $data['photo'] = $this->request->param('photo');
	    $data['do_time'] = $this->request->param('do_time');

	    $data['content'] = $this->request->param('content','','trim');
        $data['sort'] = $this->request->param('sort','','intval');
        return $data;
    }
	/**
	 * @return false|string|\think\Response
	 * description 评论列表
	 */
	public function getCommentList()
	{
		$aid = $this->request->param('aid','','intval');
		$where=['aid'=>$aid];
		$list = SportComment::getList($where, '*', ['id'=>'desc']);
		foreach ($list['data'] as $k=>$v){
			if(empty($v['uid'])){
				$list['data'][$k]['username']='管理员';
			}else{
				$list['data'][$k]['username']=Member::field('id,username')->find($v['uid'])['username'];
			}
//            $list['data'][$k]['title']=$v->profile->description;
		}
		return Response::Okdata($list, 'get data success');
	}
	//审核评论
	public function toExamComment(){

		$id = $this->request->param('id');
		$status = $this->request->param('status','','trim');
		$reason = $this->request->param('reason','','trim');
		if($status !='on'&&empty($reason)){
			return Response::Error('请输入审核不通过原因');
		}elseif ($status !='on'&&!empty($reason)){
			$status=2;
		}else{
			$status=0;
		}
		$now= time();
		$data = array();
		$data['status'] =$status;
		$data['exam_time'] =$now;
		$data['reason'] =$reason;
		$res = SportComment::where('id',$id)->update($data);
		if($res !== false){
			return Response::Ok('审核成功');
		}else{
			return Response::Error('审核失败');
		}
	}
	/**
	 * 管理员删除评论
	 */
	public function delComment(){
		$id = $this->request->param('id');
		$res = SportComment::where('id',$id)->delete();
		if($res){
			return Response::Ok('操作成功');
		}else{
			return Response::Ok('操作失败');
		}
	}
    //活动提交记录
	public function getSportRecordList()
	{
		$sport_id = $this->request->param('sport_id');
		$where = [];
		if(!empty($sport_id)) {
			$where[] = [ 'sport_id', '=', $sport_id ];
		}
		$list = SportAppointmentRecord::getList($where, '*', ['id'=>'asc']);

		foreach ($list['data'] as $k=>$v){

		}
		return Response::Okdata($list, 'get data success');
	}
	//删除活动提交记录
	public function delSportRecord()
	{
		$data['id'] = $this->request->param('id');
		$res = SportAppointmentRecord::where($data)->delete();
		if($res){
			return Response::Ok('删除成功');
		} else {
			return Response::Error('删除失败');
		}
	}

	//获取经纬度
	public static function getjw($address){
//        $address='北京市海淀区彩和坊路海淀西大街74号';
		$key='QOFBZ-7J3Y6-5XES4-E6E4I-FYLTH-5AFLH';
		$url="https://apis.map.qq.com/ws/geocoder/v1/?address=$address&key=$key";
		$res=Request::http_get($url);
		return $res;
//        $res=json_decode($res);
//        dump($res);
//        dump($res->status);
//        dump($res->result->location->lng);
//        dump($res->result->location->lat);
	}
	//活动图片记录
	public function getSportImgList()
	{
		$sport_id = $this->request->param('sport_id');
		$where = [];
		if(!empty($sport_id)) {
			$where[] = [ 'sport_id', '=', $sport_id ];
		}
		$list = SportImg::getList($where, '*', ['id'=>'asc']);

		foreach ($list['data'] as $k=>$v){

		}
		return Response::Okdata($list, 'get data success');
	}
	//增加
	public function addImg()
	{
		$data = $this->checkFormImg();
		if (is_string($data)) {
			return Response::Error($data);
		}
		$data['create_time'] = time();
		$res = SportImg::insert($data);
		if($res){
			return Response::Ok('增加成功');
		} else {
			return Response::Error('增加失败');
		}
	}
	//编辑
	public function editImg()
	{
		$data = $this->checkFormImg();
		if (is_string($data)) {
			return Response::Error($data);
		}
		$data['create_time'] = time();
		$data['id'] = $this->request->param('id');
		$url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'];
		if(!empty($data['image'])){
			$data['image']=str_replace($url,'',$data['image']);
		}
		$res = SportImg::update($data);
		if($res){
			return Response::Ok('修改成功');
		} else {
			return Response::Error('修改失败');
		}
	}
	//删除
	public function delImg()
	{
		$data['id'] = $this->request->param('id');
		$info = SportImg::getOne(['id'=>$data['id']]);
		$res = SportImg::where($data)->delete();
		if($res){
			@unlink(trim($info['image'],'/'));
			return Response::Ok('删除成功');
		} else {
			return Response::Error('删除失败');
		}
	}
	//表单
	private function checkFormImg()
	{
		$data = [];
		$data['sport_id'] = $this->request->param('sport_id','','intval');
		$data['image'] = $this->request->param('image');
//	    if (empty($data['image'])) {
//		    return '请上传图片';
//	    }

		$data['sort'] = $this->request->param('sort','','intval');
		return $data;
	}

}
