<?php


namespace app\admin\controller;


use think\App;
use app\BaseController;
use think\facade\Session;

class BaseAdmin extends BaseController
{
    protected $uid = 0;
    public static $session_key = 'admin';
    public function __construct(App $app = null)
    {
        parent::__construct($app);
    }

    protected function initialize()
    {
        $admin_info = Session::get(self::$session_key);
        if(empty($admin_info)){
//            return app('json')->fail('权限不足');
//            return Response::create(0, 'json', '权限不足');

            echo '<script language="javascript">';
            echo 'parent.location.href='/';';
            echo '</script>';
            die;
        }
        $this->uid = $admin_info['id'];
    }
}
