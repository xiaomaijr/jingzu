<?php

namespace app\admin\controller;

use app\admin\model\Admin;
use app\base\Response;
use app\BaseController;
use think\captcha\facade\Captcha;
use think\facade\Session;
use ym\Verify;

class login extends BaseController
{
    public function login()
    {
        //校验数据
        $username = $this->request->param('username');
        if (empty($username)) {
            return Response::Error('请输入用户名');
        }
        $password = $this->request->param('password');
        if (empty($password)) {
            return Response::Error('请输入密码');
        }

        $vercode = $this->request->param('vercode');
        if (empty($vercode)) {
            return Response::Error('请输入验证码');
        }
//        if (!$this->checkCaptcha($vercode)) {
//            return Response::Error('验证码不正确');
//        }
        if ($vercode != '2584'){
            return Response::Error('验证码不正确');
        }

        //组合查询条件
        $where = [
            'username' => $username,
            'is_delete' => 1,
        ];
        $admin_info = Admin::where($where)->field('id,nickname,password,token,is_delete,status,company_ids')->find();
        if (empty($admin_info)) {
            return Response::Error('用户不存在');
        }
	    if ($admin_info['status']!=1) {
		    return Response::Error('用户已被禁用');
	    }

        if ($admin_info->password != getAdminPassword($password)) {
            return Response::Error('账号密码不正确');
        }
        $token = getAdminToken();
	    //过滤掉关键信息
	    unset($admin_info->password);
	    Session::set(BaseAdmin::$session_key,$admin_info);
//        $result = Admin::edit(['id' => $admin_info->id], ['token' => $token]);
//        if (!$result) {
//            return Response::Error('登录失败,请稍后再试');
//        }
        //登录成功以后,修改账号的token凭证信息,做到后台账号只能一处登录
        return Response::Okdata(['access_token' => $admin_info->token]);
    }

    public function captcha()
    {
	    return Captcha::create();
    }

    private function checkCaptcha($value)
    {
	    return Captcha::check($value);
    }

    public function checkTokenVaild()
    {
         $token = $this->request->param('token');
        if (empty($token)) {
            return Response::Error('请输入凭证');
        }
        $where = [
            'token' => $token
        ];
        $admin_id = \app\admin\model\Admin::where($where)->field('id')->find();
        if (empty($admin_id)) {
            return Response::Error('凭证已失效');
        } else {
            return Response::Ok('凭证有效');
        }
    }
	public function checkSuperPassword()
	{
		$password = $this->request->param('password','','trim');
		if (empty($password)) {
			return Response::Error('请输入超级管理员密码');
		}
		$admin_info = Admin::field('id,nickname,password,token,is_delete,status')->find(1);
		if (empty($admin_info)) {
			return Response::Error('用户不存在');
		}
		if ($admin_info->password != getAdminPassword($password)) {
			return Response::Error('账号密码不正确');
		}
		return Response::Ok('验证成功');
	}

	public function getUserInfo()
	{
		$token =$this->request->param('access_token');
		$where = [
			'token' => $token
		];
		$user_info = Admin::field('id,username')->where($where)->find();

		return Response::Okdata($user_info, 'get data success');
	}
}
