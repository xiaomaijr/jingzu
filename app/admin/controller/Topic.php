<?php

namespace app\admin\controller;


use app\admin\model\TopicComment;
use app\base\Response;
use think\App;
use app\admin\model\Topic as Topic_Model;
use app\admin\model\Member;
use app\admin\model\Admin;
use think\facade\Request;
use think\facade\Session;
use think\facade\Cache;

class Topic extends BaseIndex
{
    /**
     * @return false|string|\think\Response
     * description 审核通过的话题列表
     */
    public function getTopicList()
    {
	    $type = $this->request->param('type','','intval');
	    $title = $this->request->param('title','','trim');
	    $where = '1=1';
	    if(!empty($title)){
		    $where .= " and description like '%{$title}%'";
	    }
	    if(!empty($type)){
		    $where .= " and type = {$type}";
	    }
	    $where .= " and status = 0";

        $list = Topic_Model::getList($where, '*', ['status'=>'asc','soft_sort'=>'desc','top'=>'desc','active_sort'=>'desc','release_time'=>'desc','id'=>'desc']);
        foreach ($list['data'] as $k=>$v){
            $releaser = Member::getOne(['id'=>$v['uid']],'id,username');
            $list['data'][$k]['author']=$releaser['username'];
            if($v['is_release']){
                $list['data'][$k]['release_time']=date('Y-m-d H:i:s',$v['release_time']);
            }
        }
        return Response::Okdata($list, 'get data success');
    }
    /**
     * @return false|string|\think\Response
     * description 获取审核通过的话题列表
     */
    public function getTopList(){
        $where="status = 0";
        $list = Topic_Model::field("id,title")->where($where)->order(['id'=>'desc'])->select();
        return Response::Okdata($list, 'get data success');
    }
    /**
     * @return false|string|\think\Response
     * description 待审核的话题列表
     */
    public function getTopicTestList()
    {
        $where="status = 1 ";
        $list = Topic_Model::getList($where, '*', ['status'=>'asc','id'=>'desc']);
        foreach ($list['data'] as $k=>$v){
            if($v['is_system']==1){
                $releaser = Admin::find($v['uid']);
                $list['data'][$k]['releaser']=$releaser['username'];
            }else{
                $releaser = Member::find($v['uid']);
                $list['data'][$k]['releaser']=$releaser['username'];
            }
//	        $list['data'][$k]['flag']=false;
//            if($v['status']=2){
//	            $list['data'][$k]['flag']=true;
//            }
//
        }
        return Response::Okdata($list, 'get data success');
    }
    /**
     * @return false|string|\think\Response
     * description 添加话题
     */
    public function add()
    {
        $data= $this->checkForm();
        if (is_string($data)) {
            return Response::Error($data);
        }
        $now =time();
        $data['status'] = 0;
        $data['is_system'] = 1;
        $data['create_time'] = $now;
        $data['uid'] =Session::get(BaseAdmin::$session_key)['id'];
        $result = Topic_Model::insertGetId($data);

        if ($result) {
            return Response::Ok('添加成功');
        } else {
            return Response::Error('添加失败');
        }
    }

    public function edit(){

        $id = $this->request->param('id');
        if(empty($id) || !is_numeric($id)){
            return Response::Error('非法访问');
        }
        $data = $this->checkForm();
        if(is_string($data)){
            return Response::Error($data);
        }

        $now =time();
        $data['status'] = 1;
        $data['is_system'] = 1;
        $data['is_release'] = 0;
        $data['alter_time'] = $now;
        //过滤掉活动封面中域名部分
        $where['id']=$id;
        $result = Topic_Model::where($where)->update($data);
        if($result !==false){
            return Response::Ok('修改成功');
        }else{
            return Response::Error('修改失败');
        }
    }
    /**
     * @return false|string|\think\Response
     * @throws \think\Exception
     * @throws \think\exception\PDOException
     * description 删除活动
     */
    public function del()
    {
        $id = $this->request->param('id');
        if (empty($id) || !is_numeric($id)) {
            return Response::Error('非法访问');
        }
        $where = [
            'id' => $id
        ];
        $result = Topic_Model::where($where)->delete();
        if ($result) {
            MemberGoPopNewsRecord::where(['aid'=>$id,'flag'=>2])->delete();
            MemberCollection::cancelCollection(2,$id);
            TopicComment::clearCommentRecord(2,$id);
            return Response::Ok('删除成功');
        } else {
            return Response::Error('删除失败');
        }
    }
    /**
     * @return array|string
     * description 表单验证
     */
    private function checkForm()
    {
        $data = [];
	    $data['type'] = $this->request->param('type','','intval');
	    if (empty($data['type']) ) {
		    return '请选择分类';
	    }
        $data['label_id'] = $this->request->param('label_id','','intval');
        if (empty($data['label_id']) ) {
            return '请选择标签';
        }
        $data['content'] =  trim($this->request->param('content'),'&');
        $data['description'] = $this->request->param('description','','trim');
        if (empty($data['description']) || mb_strlen($data['description'], 'UTF8') > 200) {
            return '请输入简介,并且不能超过200个字符';
        }
        $data['richcontent'] = $this->request->param('richcontent','','trim');
        if (empty($data['richcontent'])) {
            return '请填写内容';
        }
        $data['sort'] = $this->request->param('sort','','intval');
        $top = $this->request->param('top');
        if($top=='on'){
            $data['top']=1;
        }else{
            $data['top']=0;
        }
        return $data;
    }
    /**
     * @return false|string|\think\Response
     * description 评论列表
     */
    public function getTopicCommentList()
    {
        $aid = $this->request->param('aid','','intval');
        $where=['aid'=>$aid];
        $list = TopicComment::getList($where, '*', ['id'=>'desc']);
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
	//官方评论
	public function replyByAdmin(){
		$id = $this->request->param('id','','intval');
		$pid = $this->request->param('pid','0','intval');
		$description = $this->request->param('description','','trim');

		$info  = Topic_Model::get($id);
		if(empty($info)){
			return Response::Error('参数错误');
		}
		$now =time();
		$data = array();
		$data['aid'] =$id;
		$data['uid'] =0;
		$data['pid'] =$pid;
		$data['description'] =$description;
		$data['status'] =0;//0审核通过1审核中2审核不通过
		$data['inte_status'] =0;//0审核通过1审核中2审核不通过1
		$data['create_time'] =$now;
		$res = TopicComment::insertGetId($data);
		if($res){
			return Response::Ok('回复成功');
		}else{
			return Response::Error('回复失败');
		}
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
        $res = TopicComment::where('id',$id)->update($data);
        if($res !== false){
	        $info = TopicComment::get($id);
	        if(!$status){
		        Topic_Model::where(['id'=>$info['aid']])->update(['release_time'=>$now,'alter_time'=>$now]);
	        }else{

	        }
            return Response::Ok('审核成功');
        }else{
            return Response::Error('审核失败');
        }
    }
    /**
     * 热门知识
     */
    public function setPop()
    {
        $id = $this->request->param('id','','intval');

        $info = Topic_Model::get($id);
        if(empty($info)){
            return Response::Error('没有此文章');
        }
        if($info['is_pop']){
            $result = Topic_Model::where('id',$id)->setField('is_pop',0);
            if ($result) {
                MemberGoPopNewsRecord::where(['aid'=>$id,'flag'=>2])->setField('status',0);
                Cache::rm('popnews');
                return Response::Ok('取消热门成功');
            } else {
                return Response::Error('取消热门失败');
            }
        }else{
            $result = Topic_Model::where('id',$id)->setField('is_pop',1);
            if ($result) {
                $res = MemberGoPopNewsRecord::where(['aid'=>$id,'flag'=>2])->find();
                if(empty($res)){
                    $data =array();
                    $data['aid']=$id;
                    $data['flag']=2;
                    $data['status']=1;
                    $data['create_time']=time();
                    MemberGoPopNewsRecord::create($data);
                }else{
                    MemberGoPopNewsRecord::where('id',$res['id'])->setField('status',1);
                }
                Cache::rm('popnews');
                return Response::Ok('热门成功');
            } else {
                return Response::Error('热门失败');
            }
        }

    }
    /**
     * 置顶
     */
    public function setTop()
    {
        $id = $this->request->param('id','','intval');

        $info = Topic_Model::get($id);
        if(empty($info)){
            return Response::Error('没有此文章');
        }
        if($info['top']){
            $result = Topic_Model::where('id',$id)->setField('top',0);
            if ($result) {
                return Response::Ok('取消置顶成功');
            } else {
                return Response::Error('取消置顶失败');
            }
        }else{
            $result = Topic_Model::where('id',$id)->setField('top',1);
            if ($result) {
                $now =time();
                $mjpdr = TopicBestRecord::field('*')->where('aid',$id)->find();
                if(empty($mjpdr)){
                    $info = Topic_Model::field('id,uid,is_system')->get($id);
                    $integral1 = MemberInteRecord::getIntegral(14);
                    if(!empty($integral1)&&!$info['is_system']){
                        //加积分记录  要判断评论每天3次
                        $condition1=array();
                        $condition1['uid']=$info['uid'];
                        $condition1['num']=$integral1;
                        $condition1['mold']=1;
                        $condition1['type']=14;
                        $condition1['create_time']=$now;
                        $condition2 =[];
                        $res = MemberInteRecord::mInteRecord(14,$info['uid'],$integral1,$condition1,$condition2);
                    }
                    $data= array();
                    $data['aid'] =$id;
                    $data['create_time'] =$now;
                    TopicBestRecord::create($data);
                }
                return Response::Ok('置顶成功');
            } else {
                return Response::Error('置顶失败');
            }
        }
    }
    /**
     * 审核话题
     */
    public function  toexam(){
        $id = $this->request->param('id');
        $status = $this->request->param('status','','intval');
        $reason = $this->request->param('reason','','trim');
        if($status==2&&empty($reason)){
            return Response::Error('请输入审核不通过原因');
        }
	    $info = Topic_Model::find($id);
        if(empty($info)){
            return Response::Error('没有此话题');
        }
	    $now = time();
        $data = array();
        $data['status'] =$status;
        $data['exam_time'] =$now;
        $data['reason'] =$reason;
        $res = Topic_Model::where('id',$id)->update($data);
        if($res !== false){
        	if($status==0){
		        $data = array();
		        $data['is_release'] =1;
		        $data['release_time'] =$now;
		        $resup = Topic_Model::where('id','in',$id)->update($data);
		        if($resup){
//			        MemberInteRecordOriga::mInteRecordOriga(4,$id,$now);
		        }
	        }else{
//		        MessageSend::sendFailToExam($reason,2,$id,$info['uid']);
	        }
            return Response::Ok('审核成功');
        }else{
            return Response::Error('审核失败');
        }
    }
	/**
	 * 批量审核话题
	 */
	public function  toexamBatch(){
		$ids = $this->request->param('ids');
		$status = $this->request->param('status','','intval');
		if(!is_array($ids)||count($ids)<1){
			return Response::Error('请选择你要操作的列');
		}
		$now = time();
		$data = array();
		$data['status'] =$status;
		$data['exam_time'] =$now;
		$res = Topic_Model::where('id','in',$ids)->update($data);
		if($res !== false){
			if($status==0){
				$data = array();
				$data['is_release'] =1;
				$data['release_time'] =$now;
				$resup = Topic_Model::where('id','in',$ids)->update($data);
				if($resup){
//					MemberInteRecordOriga::mInteRecordOriga(4,$ids,$now);
				}
			}
			return Response::Ok('审核成功');
		}else{
			return Response::Error('审核失败');
		}
	}
    /**
     * 上下架
     */
    public function  upperLower(){
        $ids = $this->request->param('ids');
        $status = $this->request->param('status','','intval');
        if(!is_array($ids)||count($ids)<1){
            return Response::Error('请选择你要操作的列');
        }
        $data = array();
	    $now = time();
        $data['is_release'] =$status;
        if($status==1){
            $data['release_time'] =$now;
        }
        $res = Topic_Model::where('id','in',$ids)->update($data);
        if($res !== false){
            if($status){
//	            MemberInteRecordOriga::mInteRecordOriga(4,$ids,$now);
                return Response::Ok('上架成功');
            }else{
//	            MemberCollection::cancelCollection(2,$ids);
                return Response::Ok('下架成功');
            }
        }else{
            if($status){
                return Response::Error('上架失败');
            }else{
                return Response::Ok('下架失败');
            }
        }
    }
	/**
	 * 获取所有评论
	 */
	public function getTopicAllCommentList()
	{
		$where="status = 1";
		$list = TopicComment::getList($where, '*', ['id'=>'desc']);
		foreach ($list['data'] as $k=>$v){
			$list['data'][$k]['username']=\app\model\Member::field('id,username')->get($v['uid'])['username'];
			$list['data'][$k]['title']=$v->profile->description;
		}
		return Response::Okdata($list, 'get data success');
	}
	/**
	 * 批量审核评论状态
	 */
	public function setTopicAllCommentStatus(){
		$ids = $this->request->param('ids');
		$status = $this->request->param('status','','intval');
		if(!is_array($ids)||count($ids)<1){
			return Response::Error('请选择你要操作的列');
		}
		$data = array();
		$now = time();
		$data['status'] =$status;
		$data['exam_time'] =$now;
		$res = TopicComment::where('id','in',$ids)->update($data);
		if($res !== false){
			if(!$status){
				foreach ($ids as $v){
					$info = TopicComment::get($v);
					//1钜点通 2社区  3市场动态  4第八区 5热门消息
					ArticleComment::afterAuditCommentAddIntergral(2,$info['uid'],$info['aid'],$v);

					Topic_Model::where(['id'=>$info['aid']])->update(['release_time'=>$now,'alter_time'=>$now]);
				}
			}
			return Response::Ok('操作成功');
		}else{
			return Response::Ok('操作失败');
		}
	}
	/**
	 * @return false|string|\think\Response
	 * description 审核通过的话题列表
	 */
	public function getTopicPic()
	{
		$id = $this->request->param('id','','intval');
		if(empty($id)){
			return Response::Okdata([], 'get data success');
		}
		$where=['id'=>$id];
		$list = \app\model\Content::getList($where, '*', ['sort'=>'asc','id'=>'asc']);

//        foreach ($list['data'] as $k=>$v){
//            $list['data'][$k]['image']=Request::root(true) .$v['image'];
//            $map['id']=$v['brand_id'];
//            $brand=\app\model\Brand::where($map)->field('name')->find();
//            $list['data'][$k]['bid']=$list['data'][$k]['brand_id'];
//            $list['data'][$k]['brand_id']=$brand['name'];
//            $list['data'][$k]['start_time']=date('Y-m-d',$v['start_time']);
//        }
		return Response::Okdata($list, 'get data success');
	}
	/**
	 * @return false|string|\think\Response
	 * description 审核通过的话题列表
	 */
	public function editPic(){

		$id = $this->request->param('id');
		$logo = $this->request->param('logo','','trim');
		if(empty($logo)){
			return Response::Error('请上传图片');
		}
		$now =time();
		$data['logo'] = $logo;
		$data['alter_time'] = $now;
		//过滤掉活动封面中域名部分
		$where['id']=$id;
		$result = \app\model\Content::where($where)->update($data);
		if($result !==false){
			return Response::Ok('修改成功');
		}else{
			return Response::Error('修改失败');
		}
	}
	/**
	 * 管理员删除评论
	 */
	public function delTopicComment(){
		$id = $this->request->param('id');
		$res = TopicComment::where('id',$id)->delete();
		if($res){

			return Response::Ok('操作成功');
		}else{
			return Response::Ok('操作失败');
		}
	}
}
