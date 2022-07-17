<?php

namespace app\wxapp\controller;

use app\BaseController;
use app\base\Response;
use app\common\model\Company;
use app\common\model\ContractPhone;
use app\wxapp\controller\Auth;
use app\wxapp\model\Member;

class Login extends BaseController
{
	//注册绑定
    public function register()
    {
    	$code = $this->request->param('code');
//    	$phone = $this->request->param('phone');
//    	$realname = $this->request->param('realname');
    	$share_id = $this->request->param('share_id','','intval');
        $encrypted_data = $this->request->param('encrypted_data');
        $iv = $this->request->param('iv');
        if (empty($code)) {
            return Response::Error('请获取账户code信息');
        }
//	    $phone_rule = '/^1[3456789]\d{9}$/ims';
//	    if (!preg_match($phone_rule, $phone)) {
//		    return Response::Error('手机号格式不正确');
//	    }
        //获取账户openid信息
        $auth = new Auth();
        $sessionKeyopenid = $auth->getSessionKey($code);
//        var_dump($sessionKeyopenid);
        $sessionKey = $sessionKeyopenid->session_key;
//        $user_info = $auth->encry($sessionKey,urldecode($encrypted_data),$iv);var_dump($user_info);
//        if(is_array($user_info)&&isset($user_info['status'])&&!$user_info['status']){
//	        return Response::Errordata($user_info,$sessionKey);
//        }

        $openid=$sessionKeyopenid->openid;
        $user1=Member::getOne(['openid'=>$openid],'*');
//	    $info = Member::getOne(['phone'=>$phone],'*');
//	    if(!empty($user1)&&$user1['phone']!=$phone){
//		    return Response::Error('微信已绑定');
//	    }
//	    if(!empty($info)&&$info['openid']!=$openid){
//		    return Response::Error('手机号已绑定');
//	    }
	    $user_info = $this->request->param('user_info');
	    $user_info=json_decode($user_info);
        if(!empty($user1)){
	        $data=array();
	        $data['username'] = userTextEncode($user_info->nickName);
	        $data['nickname'] = userTextEncode($user_info->nickName);
	        $data['realname'] = userTextEncode($user_info->nickName);
	        $data['openid'] = $openid;
	        $data['image'] = $user_info->avatarUrl;
	        $memid = Member::where(['id'=>$user1['id']])->update($data);
	        return Response::Okdata(['token'=>$user1['token'],'user_id'=>$user1['id'],'openid'=>$user1['openid'],'phone'=>$user1['phone'],'sessionKey'=>$sessionKey], '绑定成功');
        }else{//没注册
            $data=array();
            $data['username'] = userTextEncode($user_info->nickName);
            $data['nickname'] = userTextEncode($user_info->nickName);
            $data['realname'] = userTextEncode($user_info->nickName);
            $data['openid'] = $openid;
            $data['image'] = $user_info->avatarUrl;
            $data['password'] = time();
            $data['token'] = strtolower(md5(rand(10000, 99999) . 'hs'));
            $data['status'] = 1;//账号状态，1-审核通过,2-审核中,3-审核不通过
            $data['share_pid'] = $this->getShareId($share_id);//获取分享人id
            $memid = Member::create($data);
            if($memid->id){
	            $user1 =Member::getOne(['id'=>$memid->id],'*');
	            $contract = $user1->contract;
	            $contract['signing_date'] = date('Y-m-d',$contract['signing_date']);
	            return Response::Okdata(['token'=>$user1['token'],'user_id'=>$memid->id,'openid'=>$openid,'phone'=>'','sessionKey'=>$sessionKey], '绑定成功');

            }else{
                return Response::Error('注册失败.请联系管理员');
            }
        }
    }
	//获取用户信息的修改手机号
	public function setPhone(){
		$code = $this->request->param('code');
		$user_id = $this->request->param('user_id','','intval');

		$auth = new Auth();
		$user_info = $auth->getUserPhone($code);
		if($user_info->errmsg=='ok'){
			$phone = $user_info->phone_info->phoneNumber;
			$user1=Member::getOne(['phone'=>$phone],'*');
			if(empty($user1)){
				$data=array();
				$data['phone'] = $phone;
				$memid = Member::where(['id'=>$user_id])->update($data);
				if($memid!==false){
					$user1 =Member::getOne(['id'=>$user_id],'*');
					return Response::Okdata(['token'=>$user1['token'],'user_id'=>$user_id,'phone'=>$phone], '登录成功');
				}else{
					return Response::Error('注册失败.请联系管理员');
				}
			}else{
				return Response::Okdata(['token'=>$user1['token'],'user_id'=>$user1['id'],'phone'=>$user1['phone']], '登录成功');
			}

		}else{
			return Response::Error('获取失败2');
		}


	}
    //没有获取用户信息的修改手机号
	public function setPhoneNoUserInfo(){
		$code = $this->request->param('code');
		$share_id = $this->request->param('share_id','','intval');

		$auth = new Auth();
        $user_info = $auth->getUserPhone($code);
        if($user_info->errmsg=='ok'){
			$phone = $user_info->phone_info->phoneNumber;
	        $user1=Member::getOne(['phone'=>$phone],'*');
	        if(empty($user1)){
		        $data=array();
		        $data['username'] = '微信用户';
		        $data['nickname'] = '微信用户';
		        $data['realname'] = '微信用户';
		        $data['openid'] = 'openid';
		        $data['password'] = time();
		        $data['token'] = strtolower(md5(rand(10000, 99999) . 'hs'));
		        $data['status'] = 1;//账号状态，1-审核通过,2-审核中,3-审核不通过
		        $data['share_pid'] = $this->getShareId($share_id);//获取分享人id
		        $data['phone'] = $phone;
		        $memid = Member::create($data);
		        if($memid->id){
			        $user1 =Member::getOne(['id'=>$memid->id],'*');
			        $contract = $user1->contract;
			        $contract['signing_date'] = date('Y-m-d',$contract['signing_date']);
			        return Response::Okdata(['token'=>$user1['token'],'user_id'=>$memid->id,'phone'=>$phone], '登录成功');
		        }else{
			        return Response::Error('注册失败.请联系管理员');
		        }
	        }else{
		        return Response::Okdata(['token'=>$user1['token'],'user_id'=>$user1['id'],'phone'=>$user1['phone']], '登录成功');
	        }

        }else{
	        return Response::Error('获取失败2');
        }


	}

	public function getShareId($share_id){
    	$info = Member::getOne(['id'=>$share_id],'id,is_distribution');
		if(!empty($info)&&$info['is_distribution']){
			return $share_id;
		}
		return 0;
	}

}
