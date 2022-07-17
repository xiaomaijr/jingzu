<?php


namespace app\admin\controller;

use app\admin\model\Content as ContentModel;
use app\admin\model\Member;
use app\base\Response;
use app\common\model\ContentComment;
use think\facade\Request;

class Content extends BaseIndex
{
    public function getContentList()
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
        $list = ContentModel::getList($where, '*', ['id'=>'asc']);

        foreach ($list['data'] as $k=>$v){
            if($v['id']==4){
	            $jso = json_decode($v['content'],true);
	            $list['data'][$k]['phone'] = $jso['phone'];
	            $list['data'][$k]['address'] = $jso['address'];
	            $list['data'][$k]['longitude'] = $jso['longitude'];
	            $list['data'][$k]['latitude'] = $jso['latitude'];
            }
        }
        return Response::Okdata($list, 'get data success');
    }

    //增加文章
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
    //文章编辑
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
        $res = ContentModel::update($data);
        if($res){
            return Response::Ok('修改成功');
        } else {
            return Response::Error('修改失败');
        }
    }
    //删除文章
    public function del()
    {
        $data['id'] = $this->request->param('id');
        $res = ContentModel::where($data)->delete();
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
        $data['image'] = $this->request->param('image');
//	    if (empty($data['image'])) {
//		    return '请上传图片';
//	    }
	    $id = $this->request->param('id');
	    if($id == 4){
		    $phone = $this->request->param('phone');
		    $address = $this->request->param('address');
		    $longitude = $this->request->param('longitude');
		    $latitude = $this->request->param('latitude');
		    $data['content'] = json_encode(['phone'=>$phone,'address'=>$address,'longitude'=>$longitude,'latitude'=>$latitude]);
	    }else{
		    $data['content'] = $this->request->param('content','','trim');
	    }

        $data['source'] = $this->request->param('source','','trim');
        $data['sort'] = $this->request->param('sort','','intval');
	    $data['jump_type'] = $this->request->param('jump_type');
	    $data['url'] = $this->request->param('url');
	    if($data['jump_type']==1&&empty($data['content'])){
		    return '请输入详情';
	    }elseif ($data['jump_type']==2&&empty($data['url'])){
		    return '请输入跳转链接';
	    }else{

	    }
        return $data;
    }

	//文章修改精华
	public function setBest()
	{
		$is_best = $this->request->param('is_best');
		$data['is_best'] = 0;
		if($is_best){
			$data['is_best'] = 1;
		}
		$data['alter_time'] = time();
		$data['id'] = $this->request->param('id');

		$res = ContentModel::update($data);
		if($res){
			return Response::Ok('设置精华成功');
		} else {
			return Response::Error('设置精华失败');
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
		$list = ContentComment::getList($where, '*', ['id'=>'desc']);
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
		$res = ContentComment::where('id',$id)->update($data);
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
		$res = ContentComment::where('id',$id)->delete();
		if($res){
			return Response::Ok('操作成功');
		}else{
			return Response::Ok('操作失败');
		}
	}
}
