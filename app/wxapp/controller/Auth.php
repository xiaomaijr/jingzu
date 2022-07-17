<?php

namespace app\wxapp\controller;

use app\BaseController;
use app\base\Response;
use app\common\model\AccountConf;
use wx\WXBizDataCrypt;
use ym\Request;

class Auth
{
    protected $APP_ID = '';
    protected $APP_SECRET = '';

     public function initialize()
     {
        $res = AccountConf::getOne(['id'=>1],'*');
        $this->APP_ID=$res['appid'];
        $this->APP_SECRET=$res['appsecret'];
     }

    /**
     * @param $code
     * @return mixed
     * description 获取用户的openid
     */
    public function getUserOpenId($code)
    {
        $url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' . $this->APP_ID . '&secret=' . $this->APP_SECRET . '&js_code=' . $code . '&grant_type=authorization_code';
        $request = Request::http_get($url);
        $content = json_decode($request);
        if (isset($content->errcode)) {
            Response::Error('获取账户信息失败,请联系管理员')->send();
            die;
        }
        return $content->openid;
    }
	/**
	 * @param $code
	 * @return mixed
	 * description 获取用户的openid+sessionKey
	 */
    public function getSessionKey($code){
	    $res = AccountConf::getOne(['id'=>1],'*');
	    $this->APP_ID=$res['appid'];
	    $this->APP_SECRET=$res['appsecret'];
        $appid=$this->APP_ID;
        $secret=$this->APP_SECRET;
        $url ="https://api.weixin.qq.com/sns/jscode2session?appid={$appid}&secret={$secret}&js_code={$code}&grant_type=authorization_code';";
        $res = request::http_get($url);
        $res = json_decode($res);
        return $res;
    }

    public function encry($sessionKey,$encryptedData,$iv){

        $appid = $this->APP_ID;

        $pc =new WXBizDataCrypt($appid, $sessionKey);
	    $data='';
        $errCode = $pc->decryptData($encryptedData, $iv, $data );
        if ($errCode == 0) {
            $data=json_decode($data);
//	        selfLog($data);
            return $data ;
        } else {
            $info['err']='请求失败';
            $info['status']=0;
            $info['data']=$errCode;
            return $info;
        }
    }
	//获取accesstoken
	public function getAccessToken()
	{
		$conf = AccountConf::getOne(['id'=>1],'*');
		$appid = $conf['appid'];
		$AppSecret = $conf['appsecret'];
		if(empty($conf['access_token'])||strtotime($conf['create_time'])+7100<time()){
			$url= "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$appid&secret=$AppSecret";
			$res= request::http_get($url);
			$jdres= json_decode($res);
			if(!isset($jdres->errcode)){
				$access_token= json_decode($res)->access_token;
				$data=array();
				$data['access_token']=$access_token;
				$data['alter_time']=time();
				$data['create_time']=time();
				AccountConf::where('id',1)->update($data);
				return $access_token;
			}else{//错误

			}
		}else{
			$access_token=$conf['access_token'];
			return $access_token;
		}
	}

	/**
	 * @param $code
	 * @return mixed
	 * description 获取用户的手机号
	 */
	public function getUserPhone($code){
		$ACCESS_TOKEN = $this->getAccessToken();
		$url ="https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=$ACCESS_TOKEN";
		$header = array(
			'Content-type: application/json;',
			'Accept: application/json;',
		);
		$res = request::http_post($url,json_encode(['code'=>$code]),'',$header);
		$res = json_decode($res);
		return $res;
	}
}
