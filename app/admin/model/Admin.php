<?php

namespace app\admin\model;

use app\base\BaseModel;
use think\db\exception\DbException;

class Admin extends BaseModel
{
    protected $name = 'admin';


    public static function editPassword($where, $password)
    {
        //修改密码的时候自动更新新账号的token凭证
        $data = [
            'password' => getAdminPassword($password),
            'alter_time' => time(),
            'token' => getAdminToken()
        ];
        return self::where($where)->update($data);
    }

    /**
     * 获取角色名称
     * @param $value
     * @param $data
     * @return string
     */
    public function getRoleNameAttr($value, $data)
    {
        $role_id = AdminRole::getOneField(['admin_id' => $data['id']], 'level_id');
        return empty($role_id) ? '超级管理员' : AdminLevel::getOneField(['level' => $role_id], 'name');
    }
}
