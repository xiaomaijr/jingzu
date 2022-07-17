<?php


namespace app\admin\controller;


use app\Response;
use think\App;
use app\BaseController;
use think\facade\Session;

class BaseIndex extends BaseController
{
    public function __construct(App $app = null)
    {
        parent::__construct($app);
    }
    protected function initialize()
    {
        $admin_info = Session::get(BaseAdmin::$session_key);
        if(empty($admin_info)){
//            return app('json')->fail('权限不足');
//            return Response::create(0, 'json', '权限不足');
//            echo '<script language="javascript">';
//            echo 'parent.location.href='/'';
//            echo '</script>';
//            die;
        }
//        if(!empty($admin_info)&&$admin_info['id']!=1){
//            $role = \app\admin\model\Role::field('id,ruleidss')->find($admin_info['role']);
//            $ruleidss =unserialize($role['ruleidss']);
//            $rulelist = \app\admin\model\Menu::field('id,jump')->where('id','in',$ruleidss)->select()->toArray();
//            $rulelists= array_column($rulelist,'jump');
//
//            $controller = request()->controller();
//            $action = request()->action();
//            $zhao ='/'.$controller.'/'.strtolower($action);
//            if($admin_info['id']!=1&&!in_array(strtolower($zhao),array_map('strtolower',$rulelists))){
//                $data = [
//                    'msg' => '权限不足',
//                    'success' => false,
//                    'status' => 'fail',
//                    'url' => $zhao,
//                    'data' => [],
//                    'errorcode' => 1,
//                    'code' => 1
//                ];
//                echo json_encode($data);
//                die;
//            }
//        }
//        $this->uid = $admin_info['id'];
    }

    public function getCompanyIds(){
	    $admin_info = Session::get(BaseAdmin::$session_key);
	    if(empty($admin_info['company_ids'])){
		    $company_ids = [];
	    }
		$contracts = \app\admin\model\Contract::getAll([['company','in',$company_ids]],'*','',function($data){
			$res_data['ids'] =  $data->isEmpty()?[]:array_unique(array_column($data->toArray(),'id'));
			$res_data['contract_nos'] =  $data->isEmpty()?[]:array_unique(array_column($data->toArray(),'contract_no'));
			return $res_data;
		});
	    $admin_info['contracts_ids'] = $contracts['ids'];
	    $admin_info['contracts_nos'] = $contracts['contract_nos'];
	    Session::set(BaseAdmin::$session_key,$admin_info);
    }
}
