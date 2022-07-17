<?php

namespace app\wxapp\middleware;

use app\admin\model\Admin;
use app\admin\model\AdminRole;
use app\admin\model\AdminRoleMenu;
use app\admin\model\Menu;
use app\base\Response;
use app\wxapp\model\Member;
use think\facade\Request;

class Auth
{
    public static $uid = 0;

    public function handle($request, \Closure $next)
    {
        //验证访问权限
        $this->checkAuth();
        //获取用户id
        $this->getUserId();
        return $next($request);
    }

    /**
     * description 校验接口访问权限
     */
    private function checkAuth()
    {
        $token =Request::param('token');
        if (empty($token)|| !$this->checkUsetExisit($token)) {
            Response::Error('请先登录')->send();
            die;
        }
    }
	/**
	 * @param $token
	 * @return bool
	 * description 检查判断用户是否存在
	 */
	public function checkUsetExisit($token)
	{
		$where = [
			'token' => $token
		];
		$user_count = Member::getCount($where, 'id');
		if ($user_count != 0) {
			return true;
		}
		return false;
	}

    /**
     * description 获取管理员用户id
     */
    private function getUserId()
    {
        $access_token = Request::param('token');
        $where = [
            'token' => $access_token,
        ];
        $admin_info = Member::where($where)->field('id')->find();
        self::$uid = $admin_info['id'];
    }


}
