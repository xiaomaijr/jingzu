<?php
namespace app\wxapp\controller;

use app\BaseController;
use app\base\Response;
use app\wxapp\model\Member;
use app\wxapp\middleware\Auth;
use think\facade\Db;

class WxPay extends BaseController
{
	//构造函数
	public function _initialize(){
		//php 判断http还是https
		$this->http_type = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')) ? 'https://' : 'http://';
//		vendor('WeiXinpay.wxpay');

	}
	//***************************
	//  微信支付 接口
	//***************************
	public function wxpay(){
		require_once "WeiXinpay/WxPay.php";
		$uid=Auth::$uid;

		$openid = Member::getOneField(['id'=>$uid],'openid');
		$mchId='1622257304';
		$url = 'https://jingzu.weimobile.cc/wxapp/notify';
		//②、统一下单
		$input = new \WxPayUnifiedOrder();
		//设置商品或支付单简要描述
		$input->SetBody("商品购买_123");
		$input->SetAttach("商品购买_123");
		//使用第一个订单
		$input->SetOut_trade_no(time());
		$total_fee= 1;
		$input->SetTotal_fee($total_fee);
		$input->SetTime_start(date("YmdHis"));
		$input->SetTime_expire(date("YmdHis", time() + 3600));
		$input->SetGoods_tag("商品购买_123");
		//异步支付回调接口
		$input->SetNotify_url($url);
		$input->SetTrade_type("JSAPI");
		$input->SetOpenid($openid);
		$input->SetMch_id($mchId);//设置商户号
		$input->SetAppid('wx89ddf511c728f2b4');//公众账号ID
		$input->SetSpbill_create_ip($_SERVER['REMOTE_ADDR']);//终端ip
		$input->SetNonce_str(self::getNonceStr());//随机字符串
		$this->SetSign($input);//生成签名

		$order = \WxPayApi::unifiedOrder($input);
//		var_dump($order);die;
		$arr = array();
		$arr['appId']     = $order['appid'];
		$arr['nonceStr']  = $order['nonce_str'];
		$arr['package']   = "prepay_id=".$order['prepay_id'];
		$arr['signType']  = "MD5";
		$arr['timeStamp'] = (string)time();
//        \Think\Log::record(json_encode($arr));
		$str = $this->ToUrlParams($arr);

		$jmstr = $str."&key=haerbinlongweitongxinhaerbin2019";
		$arr['paySign'] = strtoupper(MD5($jmstr));
		echo json_encode(array('status'=>1,'arr'=>$arr,'order_sn'=>'123456'));
		exit();
	}
	/**
	 * 设置签名，详见签名生成算法
	 * @param string $value
	 **/
	public function SetSign($input)
	{
		$sign = $this->MakeSign($input);
		$input->values['sign'] = $sign;
		return $sign;
	}
	/**
	 * 生成签名
	 * @return 签名，本函数不覆盖sign成员变量，如要设置签名需要调用SetSign方法赋值
	 */
	public function MakeSign($input)
	{
		//签名步骤一：按字典序排序参数
		ksort($input->values);
		$string = $this->ToUrlParamss($input);
		//签名步骤二：在string后加入KEY
//		$string = $string . "&key=haerbinlongweitongxinhaerbin2019";
		//修改开始
		$mckey='haerbinlongweitongxinhaerbin2019';
		$string = $string . "&key=".$mckey;
		//修改结束
		//签名步骤三：MD5加密
		$string = md5($string);
		//签名步骤四：所有字符转为大写
		$result = strtoupper($string);
		return $result;
	}
	/**
	 * 格式化参数格式化成url参数
	 */
	public function ToUrlParamss($input)
	{
		$buff = "";
		foreach ($input->values as $k => $v)
		{
			if($k != "sign" && $v != "" && !is_array($v)){
				$buff .= $k . "=" . $v . "&";
			}
		}

		$buff = trim($buff, "&");
		return $buff;
	}
	//构建字符串
	private function ToUrlParams($urlObj)
	{
		$buff = "";
		foreach ($urlObj as $k => $v)
		{
			if($k != "sign"){
				$buff .= $k . "=" . $v . "&";
			}
		}
		$buff = trim($buff, "&");
		return $buff;
	}

	/**
	 *
	 * 产生随机字符串，不长于32位
	 * @param int $length
	 * @return 产生的随机字符串
	 */
	public static function getNonceStr($length = 32)
	{
		$chars = "abcdefghijklmnopqrstuvwxyz0123456789";
		$str ="";
		for ( $i = 0; $i < $length; $i++ )  {
			$str .= substr($chars, mt_rand(0, strlen($chars)-1), 1);
		}
		return $str;
	}
	//***************************
	//  支付回调 接口
	//***************************
	public function notify(){
		/*$notify = new \PayNotifyCallBack();
		$notify->Handle(false);*/

		$res_xml = file_get_contents("php://input");
		// file_put_contents('1.txt',$res_xml);
		libxml_disable_entity_loader(true);
		$ret = json_decode(json_encode(simplexml_load_string($res_xml,'simpleXMLElement',LIBXML_NOCDATA)),true);
		$path = "./Data/log/";
		if (!is_dir($path)){
			mkdir($path,0777);  // 创建文件夹test,并给777的权限（所有权限）
		}
		$content = date("Y-m-d H:i:s").'=>'.json_encode($ret);  // 写入的内容
		$file = $path."weixin_".date("Ymd").".log";    // 写入的文件
		file_put_contents($file,$content,FILE_APPEND);  // 最简单的快速的以追加的方式写入写入方法，

		$data = array();
		$data['order_sn'] = $ret['out_trade_no'];
		$data['pay_type'] = 'weixin';
		$data['trade_no'] = $ret['transaction_id'];
		$data['total_fee'] = $ret['total_fee'];

		if (1) {
			$xml = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg>";
			$xml.="</xml>";
			echo $xml;
//             \Think\Log::record('订单处理完成');
		}else{
			$contents = 'error => '.json_encode($result);  // 写入的内容
			$files = $path."error_".date("Ymd").".log";    // 写入的文件
			file_put_contents($files,$contents,FILE_APPEND);  // 最简单的快速的以追加的方式写入写入方法，
			echo 'fail';
		}
	}
	public function pay_status($result){

		$uid=$result['data']['uuid'];
		if($result['data']['pay_status']==0){
			$status=array('pay_status'=>1);
			$res=M('user')->where("id=".$uid)->save($status);
			if($res===false){
				$result['con']='pay_status';
				\Think\Log::record(json_encode($result));
				echo json_encode(array('status'=>0,'err'=>'状态修改失败'));
			}
		}
	}
}
