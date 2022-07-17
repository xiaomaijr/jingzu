<?php

namespace app\base\controller;

use htsc\Redis;
use htsc\Request;
use think\facade\Env;

class BaseWxMiniController
{
    /**
     * description 小程序appid
     * @var string
     */
    protected static $APP_ID;
    /**
     * description 小程序appsecret
     * @var string
     */
    protected static $APP_SECRET;
    /**
     * description 小程序access_token
     * @var string
     */
    public $access_token = '';

    protected $token_key = 'mini_access_token';

    public function __construct()
    {
        $this->initialize();
    }

    /**
     * 初始化方法
     */
    protected function initialize()
    {
        //获取小程序配置信息
        self::$APP_ID = Env::get('mini.appid');
        self::$APP_SECRET = Env::get('mini.appsecret');
        //获取小程序的access_token;
        $this->getMiniAccessToken();
    }

    /**
     * description 获取小程序账号的access_token
     */
    protected function getMiniAccessToken()
    {
        $this->access_token = Redis::connect()->get($this->token_key);
        if (empty($this->access_token)) {
            $url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET';
            $url = str_replace(['APPID', 'APPSECRET'], [self::$APP_ID, self::$APP_SECRET], $url);
            $content = Request::http_get($url);
            $content = json_decode($content);
            $this->access_token = $content->access_token;
            Redis::connect()->set($this->token_key, $content->access_token, $content->expires_in - 10);
        }
    }

    public function checkContent($content)
    {
        $url = 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=ACCESS_TOKEN';
        $url = str_replace('ACCESS_TOKEN', $this->access_token, $url);
        $result = Request::http_post($url, json_encode(['content' => $content]));
        $result = json_decode($result);
        return $result->errcode == 0;
    }
}
