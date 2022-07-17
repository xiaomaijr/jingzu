<?php


namespace app\common\model;


use app\base\BaseModel;
use think\facade\Request;
use think\facade\Session;

class MemberAddress extends BaseModel
{
    protected $name = 'member_address';

    public function getUsernameAttr($value){
        return userTextDecode($value);
    }
}
