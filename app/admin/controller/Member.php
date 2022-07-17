<?php


namespace app\admin\controller;

use app\admin\model\Member as MemberModel;
use app\base\Response;
use think\Db;
use think\facade\Request;

class Member extends BaseIndex
{
    /**
     * @return false|string|\think\Response
     * description 获取文档列表
     */
    public function getMemberList()
    {
        $department = $this->request->param('department','','intval');
        $position = $this->request->param('position','','intval');
        $realname = $this->request->param('realname','','trim');
        $email = $this->request->param('email','','trim');

        $page = input('page') ? input('page') : 1;
        $limit = input('limit') ? input('limit') : 20;
        if(!empty($email)||!empty($department)||!empty($position)||!empty($realname)){
	        $where[] = ['status','=',1];
            if(!empty($email)){
	            $where[] = ['email','=',$email];
            }
            if(!empty($department)){
	            $where[] = ['company','=',$department];
            }
            if(!empty($realname)){
	            $where[] = ['realname','like',"$realname%"];
            }

            $result =MemberModel::where($where)->limit(($page - 1) * $limit, $limit)->order('id desc')->select();
            foreach ($result as $k=>$v){
	            $v->append(['company_name']);
	            $v->nickname =  userTextDecode($v['nickname']);
	            $result[$k] = $v;
            }
            $count = MemberModel::where($where)->count();
            $data = [
                'data' => $result,
                'count' => $count,
                'code' => 0,
                'current_page' => $page,
                'max_page' => ceil($count / $limit),
                'sql' => MemberModel::getLastSql()
            ];
            return Response::Okdata($data, 'get data success');
        }else{
            $where=['status'=>1];
            $list = MemberModel::getList($where, '*', ['id'=>'desc']);
            foreach ($list['data'] as $k=>$v){
	            $v->append(['company_name']);
	            $v->nickname =  userTextDecode($v['nickname']);
	            $list['data'][$k] = $v;
            }
            return Response::Okdata($list, 'get data success');
        }
    }

	/**
	 * 增加用户
	 * @return false|string|\think\Response
	 */
	public function add()
	{
		$data = $this->checkForm();
		if (is_string($data)) {
			return Response::Error($data);
		}
		if(MemberModel::checkExist(['phone'=>$data['phone']])){
			return Response::Error('手机号已注册');
		}
		$data['token']=getUserTokens();
		$data['password']=time();
		$data['create_time'] = time();
		$res = MemberModel::insert($data);
		if($res){
			return Response::Ok('增加成功');
		} else {
			return Response::Error('增加失败');
		}
	}
	/**
	 * 增加用户
	 * @return false|string|\think\Response
	 */
	public function edit()
	{
		$data = $this->checkForm();
		if (is_string($data)) {
			return Response::Error($data);
		}
		$id = $this->request->param('id');
		if(MemberModel::checkExist([['id','<>',$id],['phone','=',$data['phone']]])){
			return Response::Error('手机号已注册');
		}
		$data['token']=getUserTokens();
		$data['create_time'] = time();
		$res = MemberModel::where('id',$id)->update($data);
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
		$res = MemberModel::where($data)->delete();
		if($res){
			return Response::Ok('删除成功');
		} else {
			return Response::Error('删除失败');
		}
	}

	//批量删除
	public function batchDel()
	{
		$ids = $this->request->param('ids');
		$res = MemberModel::where([['id','in',$ids]])->delete();
		if($res){
			return Response::Ok('删除成功');
		} else {
			return Response::Error('删除失败');
		}
	}
	//表单品牌商banner
	private function checkForm()
	{
		$data = [];
		$data['realname'] = $this->request->param('realname');
		if (empty($data['realname']) || mb_strlen($data['realname'], 'UTF8') > 50) {
			return '请输入真实姓名,并且不能超过50个字符';
		}

		$data['image'] = $this->request->param('image');
		if (empty($data['image']) || mb_strlen($data['image']) > 150) {
			return '请上传头像图片';
		}
		$url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'];
		$data['image']=str_replace($url,'',$data['image']);

//        $data['email'] = $this->request->param('email');
//		$check ='/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/';
//		if (!preg_match($check, $data['email'])) {
//			return '请输入正确的邮箱！';
//		}
		$data['phone'] = $this->request->param('phone');
		$check = '/^(1(([35789][0-9])|(47)))\d{8}$/';
		if (!preg_match($check, $data['phone'])) {
			return '请输入正确的手机号码';
		}
//		$data['company'] = $this->request->param('company');
		$data['sort'] = $this->request->param('sort','0','intval');
		return $data;
	}

	//获取导出用户数据
	public function getMemberAll()
	{
		$department = $this->request->param('department','','intval');
		$position = $this->request->param('position','','intval');
		$username = $this->request->param('username','','trim');
		$phone = $this->request->param('phone','','trim');

		$where = 'status=1';
		if(!empty($phone)){
			$where .= "and phone = $phone";
		}
		if(!empty($department)){
			$where .= " and companyid = $department";
		}
		if(!empty($position)){
			$where .= " and departmentid = $position";
		}
		if(!empty($username)){
			$where .= " and username like '$username%'";
		}
		$list = MemberModel::field('id,username,nickname,phone,openid,integral,realname')
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
		$data['menu'][]='昵称';
		$data['menu'][]='真实姓名';
		$data['menu'][]='手机号';
		$data['menu'][]='openid';
		$data['menu'][]='积分';
//		$data['menu'][]='部门';
//		$data['menu'][]='职位';
		$i=0;
		foreach ($list as $k=>$v){
			$data['data'][$i][] = $v['id'];
			$data['data'][$i][] = $v['nickname'];
			$data['data'][$i][] = $v['username'];
			$data['data'][$i][] = $v['phone'];
			$data['data'][$i][] = $v['openid'];
			$data['data'][$i][] = $v['integral'];
//			$data['data'][$i][] = $v['departmentname'];
//			$g_name = MemberGroupRelation::getGroupNameV2($v['id']);
//			$data['data'][$i][] = $g_name;
			$i++;
		}
		return Response::Okdata($data, 'get data success');
	}
}
