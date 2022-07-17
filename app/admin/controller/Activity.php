<?php


namespace app\admin\controller;

use app\admin\model\Activity as ActivityModel;
use app\admin\model\ActivityData;
use app\base\Response;
use app\common\model\ActivityComment;
use app\admin\model\Member;
use app\common\model\ActivitySignupRecord;
use think\facade\Request;

class Activity extends BaseIndex
{
    public function getActivityList()
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
        $list = ActivityModel::getList($where, '*', ['id'=>'desc']);

        foreach ($list['data'] as $k=>$v){
	        $list['data'][$k]['signup_time']=date('Y-m-d H:i:s',$v['signup_start_time']).' - '.date('Y-m-d H:i:s',$v['signup_end_time']);
	        $list['data'][$k]['activity_time']=date('Y-m-d H:i:s',$v['start_time']).' - '.date('Y-m-d H:i:s',$v['end_time']);
        }
        return Response::Okdata($list, 'get data success');
    }

    //增加活动
    public function add()
    {
        $data = $this->checkForm();
        if (is_string($data)) {
            return Response::Error($data);
        }
        $data['create_time'] = time();
        $res = ActivityModel::insert($data);
        if($res){
            return Response::Ok('增加成功');
        } else {
            return Response::Error('增加失败');
        }
    }
    //活动编辑
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
	    if(!empty($data['url'])){
		    $data['url']=str_replace($url,'',$data['url']);
	    }
        $res = ActivityModel::update($data);
        if($res){
            return Response::Ok('修改成功');
        } else {
            return Response::Error('修改失败');
        }
    }
    //删除活动
    public function del()
    {
        $data['id'] = $this->request->param('id');
        $res = ActivityModel::where($data)->delete();
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
        $data['type'] = $this->request->param('type');
        if(empty($data['type'])){
	        return '请选择';
        }
        $data['image'] = $this->request->param('image');
//	    if (empty($data['image'])) {
//		    return '请上传图片';
//	    }
	    $signup_time = $this->request->param('signup_time');
	    $randtime=explode('- ',$signup_time);
	    if(strtotime($randtime[0])==strtotime($randtime[1])){
		    return '请输入正确的时间';
	    }
	    $data['signup_start_time'] = strtotime($randtime[0]);
	    $data['signup_end_time'] = strtotime($randtime[1]);

	    $activity_time = $this->request->param('activity_time');
	    $randtime=explode('- ',$activity_time);
	    if(strtotime($randtime[0])==strtotime($randtime[1])){
		    return '请输入正确的时间';
	    }
	    $data['start_time'] = strtotime($randtime[0]);
	    $data['end_time'] = strtotime($randtime[1]);
	    $is_signup = $this->request->param('is_signup');
	    $data['is_signup'] = 0;
	    if($is_signup=='on'){
		    $data['is_signup'] = 1;
	    }
	    $data['signup_num'] = $this->request->param('signup_num');
	    $data['content'] = $this->request->param('content','','trim');
        $data['sort'] = $this->request->param('sort','','intval');
	    $data['live_url'] = $this->request->param('live_url');
	    $data['url'] = $this->request->param('url');
	    if(empty($data['live_url'])){
		    return '请输入直播房间号';
	    }
        return $data;
    }
	//培训项目数据
	public function getActivityDataList()
	{
		$pid = $this->request->param('pid');

		$where = [];
		$where[] = [ 'pid', '=', $pid ];
		$list = ActivityData::getList($where, '*', ['sort'=>'desc']);

		foreach ($list['data'] as $k=>$v){

		}
		return Response::Okdata($list, 'get data success');
	}
	//增加培训项目
	public function addData()
	{
		$data = $this->checkFormData();
		if (is_string($data)) {
			return Response::Error($data);
		}
		$data['create_time'] = time();
		$res = ActivityData::create($data);
		if($res){
			return Response::Ok('增加成功');
		} else {
			return Response::Error('增加失败');
		}
	}
	//编辑培训项目
	public function editData()
	{
		$data = $this->checkFormData();
		if (is_string($data)) {
			return Response::Error($data);
		}
		$data['create_time'] = time();
		$data['id'] = $this->request->param('id');
		$url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'];
		if(!empty($data['image'])){
			$data['image']=str_replace($url,'',$data['image']);
		}
		if(!empty($data['url'])){
			$data['url']=str_replace($url,'',$data['url']);
		}
		$res = ActivityData::update($data);
		if($res){
			return Response::Ok('修改成功');
		} else {
			return Response::Error('修改失败');
		}
	}
	//删除培训项目
	public function delData()
	{
		$data['id'] = $this->request->param('id');
		$info = ActivityData::getOne(['id'=>$data['id']],'url');
		$res = ActivityData::where($data)->delete();
		if($res){
			@unlink(trim($info['url'],'/'));
			return Response::Ok('删除成功');
		} else {
			return Response::Error('删除失败');
		}
	}
	//表单
	private function checkFormData()
	{
		$data = [];
		$data['pid'] = $this->request->param('pid');
		$data['type'] = $this->request->param('type');
		$data['url'] = $this->request->param('url');
		$data['content'] = $this->request->param('content','','trim');
		$data['sort'] = $this->request->param('sort','','intval');

		return $data;
	}

	//活动修改精华
	public function setBest()
	{
		$is_best = $this->request->param('is_pop');
		$data['is_pop'] = 0;
		if(!$is_best){
			$data['is_pop'] = 1;
		}
		$data['alter_time'] = time();
		$data['id'] = $this->request->param('id');

		$res = ActivityModel::update($data);
		if($res){
			return Response::Ok('设置成功');
		} else {
			return Response::Error('设置失败');
		}
	}
	//活动报名记录
	public function getActivityRecordList()
	{
		$activity_id = $this->request->param('activity_id');
		$where = [];
		if(!empty($activity_id)) {
			$where[] = [ 'activity_id', '=', $activity_id ];
		}
		$list = ActivitySignupRecord::getList($where, '*', ['id'=>'asc']);
		$url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'];
		foreach ($list['data'] as $k=>$v){
			if (isset($v->filenames) && !empty($v->filenames)) {
				$dimgs = explode(',', json_decode($v->filenames));
				if (count($dimgs)) {
					$detailImages = [];
					foreach ($dimgs as $dv) {
						$detailImages['data'][]['src'] = $url.$dv;
					}
					$list['data'][$k]['detailImages'] = json_encode($detailImages);
				}
			}
		}
		return Response::Okdata($list, 'get data success');
	}
	//删除活动报名记录
	public function delActivityRecord()
	{
		$data['id'] = $this->request->param('id');
		$res = ActivitySignupRecord::where($data)->delete();
		if($res){
			return Response::Ok('删除成功');
		} else {
			return Response::Error('删除失败');
		}
	}

	/**
	 * @return false|string|\think\Response
	 * description 评论列表
	 */
	public function getCommentList()
	{
		$aid = $this->request->param('aid','','intval');
		$where=['aid'=>$aid];
		$list = ActivityComment::getList($where, '*', ['id'=>'desc']);
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
		$res = ActivityComment::where('id',$id)->update($data);
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
		$res = ActivityComment::where('id',$id)->delete();
		if($res){
			return Response::Ok('操作成功');
		}else{
			return Response::Ok('操作失败');
		}
	}
}
