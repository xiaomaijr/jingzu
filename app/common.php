<?php
// 应用公共文件
//生成管理员账号token
function getAdminToken()
{
	return md5(rand(10000, 99999) . time());
}
//获取管理员账号密码
function getAdminPassword($password)
{
	return strtolower(md5($password . 'ym'));
}
/**
 * 获取新文件名称
 * @return string
 */
function getFileName(): string
{
	return md5(microtime() . rand(100000000, 999999999));
}

/**
把用户输入的文本转义（主要针对特殊符号和emoji表情）
 */
function userTextEncode($str){
	if(!is_string($str))return $str;
	if(!$str || $str=='undefined')return '';

	$text = json_encode($str); //暴露出unicode
	$text = preg_replace_callback("/(\\\u[ed][0-9a-f]{3})/i",function($str){
		return addslashes($str[0]);
	},$text); //将emoji的unicode留下，其他不动，这里的正则比原答案增加了d，因为我发现我很多emoji实际上是\ud开头的，反而暂时没发现有\ue开头。
	return json_decode($text);
}

/**
解码上面的转义
 */
function userTextDecode($str){
	$text = json_encode($str); //暴露出unicode
	$text = preg_replace_callback('/\\\\\\\\/i',function($str){
		return '\\';
	},$text); //将两条斜杠变成一条，其他不动
	return json_decode($text);
}
function getUserTokens()
{
	return md5('king' .time());
}

function phoneVai($phone){
	$phone_rule = '/^1[3456789]\d{9}$/ims';
	if (!preg_match($phone_rule, $phone)) {
		return false;
	}
	return true;
}

/**
 * @param $filename
 * @return mixed
 * description 根据文件名称获取文件的扩展名
 */
function getExt($filename)
{
	$arr = explode('.', $filename);
	return array_pop($arr);
}
/**
 * 写日志
 */
function selfLog($result){

	$path = "./Data/log/";
	if (!is_dir($path)){
		mkdir($path,0777);  // 创建文件夹test,并给777的权限（所有权限）
	}
	$contents = 'error => '.json_encode($result);  // 写入的内容
	$files = $path."error_".date("Ymd").".log";    // 写入的文件
	file_put_contents($files,$contents.PHP_EOL,FILE_APPEND);
}

/**
 * 格式化¥显示
 */
function formatMoney($m){
	$data = array();
	if($m>10000){
		$data['num'] = number_format($m/10000,1);
		$data['unit'] = '万元';
	}else{
		$data['num'] = round($m,2);
		$data['unit'] = '元';
	}
	return $data;
}
/**
 * 获取本月的天
 */
function get_day($time = '', $format='d'){
	$time = $time != '' ? $time : time();
	//获取当前周几
	$week = date('d', $time);
	$date = [];
	for ($i=1; $i<=date('t',$time); $i++){
		$date[] = date($format ,strtotime( '+' . $i-$week .' days', $time)).'日';
	}
	return $date;
}
