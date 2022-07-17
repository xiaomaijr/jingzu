<?php

namespace app\admin\middleware;

use app\admin\model\Admin;
use app\admin\model\AdminRole;
use app\admin\model\AdminRoleMenu;
use app\admin\model\Menu;
use app\base\Response;
use think\facade\Request;

class Auth
{
    public static $uid = 0;

    public static $menu_list_ids;

    public static $role_info = '';

    public function handle($request, \Closure $next)
    {
//        //验证访问权限
        $this->checkAuth();
//        //获取用户id
        $this->getUserId();
//        //获取权限列表
//        $this->getAdminRoleMenu();
        return $next($request);
    }

    /**
     * description 校验接口访问权限
     */
    private function checkAuth()
    {
         $access_token = Request::param('access_token');
        if (empty($access_token)) {
            Response::Error('非法访问')->send();
            die;
        }
    }

    /**
     * description 获取管理员用户id
     */
    private function getUserId()
    {
        $access_token = Request::param('access_token');
        $where = [
            'token' => $access_token,
            'is_delete' => 1,
        ];
        $admin_info = Admin::where($where)->field('id')->find();
        if (empty($admin_info)) {
            Response::Error('非法访问')->send();
            die;
        }
        self::$uid = $admin_info['id'];
    }

    /**
     * description 获取当前账号的权限列表
     */
    private function getAdminRoleMenu()
    {
        //查询用户所属角色
        $admin_role = AdminRole::where(['admin_id'=>self::$uid])->field('level_id')->select()->toArray();
        self::$role_info = $admin_role;
        //如果不属于任何角色则为管理员,拥有全部权限
        $where = [
            'status' => 1,
            'is_show' => 1
        ];
        if(empty($admin_role)){
            $admin_menu_ids = Menu::where($where)->field('id')->select()->toArray();
            $admin_menu_ids = array_column($admin_menu_ids, 'id');
        }else{
            $admin_role_ids = array_column($admin_role, 'level_id');
            //根据角色id查询拥有的权限,多个角色,计算全部权限的合
            $admin_menu_ids = AdminRoleMenu::whereIn('level_id',$admin_role_ids)->field('menu_id')->select()->toArray();
            $admin_menu_ids = array_column($admin_menu_ids,'menu_id');
            $admin_menu_ids = array_unique($admin_menu_ids);
        }
        self::$menu_list_ids = $admin_menu_ids;
    }
}
