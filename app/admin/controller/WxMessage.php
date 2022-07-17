<?php


namespace app\admin\controller;

use app\admin\model\Feedback as FeedbackModel;
use app\admin\model\FeedbackReply;
use app\admin\model\Member;
use app\base\Response;
use ym\Request;

class WxMessage extends BaseIndex
{

	public function show()
	{            selfLog(file_get_contents("php://input"));
		if (!isset($_GET["echostr"])) {
			$this->responseMsg();
		} else {
			$this->valid();
		}
	}

	//验证服务器1
	public function valid()
	{
		$echoStr = $_GET["echostr"];
		if ($this->checkSignature()) {
			echo $echoStr;
			exit;
		}
	}
	//验证服务器2

	/**
	 *这里的链接即时微信公众号后台的基本配置里的服务器配置
	 **/
	private function checkSignature()
	{
		$signature = $_GET["signature"];
		$timestamp = $_GET["timestamp"];
		$nonce = $_GET["nonce"];
		$token = 'SWOUS4sSsjgIwZE4QeQLgKbGeEJ9Tt4L';
		$tmpArr = array($token, $timestamp, $nonce);
		sort($tmpArr, SORT_STRING);
		$tmpStr = implode('', $tmpArr);
		$tmpStr = sha1($tmpStr);
		if ($tmpStr == $signature) {
			return true;
		} else {
			return false;
		}
	}

	public function responseMsg()//执行接收器方法
	{
//        $postStr = $GLOBALS["HTTP_RAW_POST_DATA"];
		$postStr = file_get_contents("php://input");
		if (!empty($postStr)) {
			/* libxml_disable_entity_loader is to prevent XML eXternal Entity Injection,
			  the best way is to check the validity of xml by yourself */
			libxml_disable_entity_loader(true);//安全防御的
			//通过simplexml进行xml解析
			//simplexml_load_string() 函数把 XML 字符串载入对象中
			$postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
            selfLog($postObj);
			//接受微信的手机端
			$fromUsername = $postObj->FromUserName;
			//微信公众平台
			$toUsername = $postObj->ToUserName;
			//接受用户发送的关键词
			$keyword = trim($postObj->Content);
			//1.接受用户消息类型
			$msgType = trim($postObj->MsgType);
			//时间戳
			$time = time();
			//文本发送模板
			$textTpl = "<xml>
              <ToUserName><![CDATA[%s]]></ToUserName>
              <FromUserName><![CDATA[%s]]></FromUserName>
              <CreateTime>%s</CreateTime>
              <MsgType><![CDATA[%s]]></MsgType>
              <Content><![CDATA[%s]]></Content>
              <FuncFlag>0</FuncFlag>
              </xml>";
			//图文发送模板
			# 消息模板-整体
			$template = <<<XML
<xml>
<ToUserName><![CDATA[%s]]></ToUserName>
<FromUserName><![CDATA[%s]]></FromUserName>
<CreateTime>%s</CreateTime>
<MsgType><![CDATA[news]]></MsgType>
<ArticleCount>%s</ArticleCount>
<Articles>
%s
</Articles>
</xml>
XML;
# 消息模板-具体文章
			$item = <<<XML
<item>
<Title><![CDATA[%s]]></Title> 
<Description><![CDATA[%s]]></Description>
<PicUrl><![CDATA[%s]]></PicUrl>
<Url><![CDATA[%s]]></Url>
</item>
XML;
			selfLog([$msgType]);
			//如果用户发送的是文本类型文件,执行以下
			if ($msgType == 'text') {
				if (!empty($keyword)) {
					$msgType = "text";
					$contentStr = "欢迎关注钜Fighting";
					$resultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, $msgType, $contentStr);
					echo $resultStr;
				}
			}

			if ($msgType == "event") {
				$result = $this->receiveEvent($postObj);
				echo $result;
			}
		} else {
			echo "";
			exit;
		}

	}

	//关注和取关再试试
	private function receiveEvent($object)
	{
		selfLog([$object->EventKey]);
		$content = "";
		switch ($object->EventKey) {
			case "keyword":
				$content = "<a href='http://www.baidu.com/'>百度一下</a>";
				break;
			case "微官网":
				$openid =$object->FromUserName;
				$content = "<a href='https://shouchuang.weimobile.cc/home/register?openid=$openid'>点击进入【钜大问到】知识共享平台</a>";
				break;
			default:
				$content =$object->EventKey;
				break;
		}
		$result = $this->transmitText($object, $content);
		return $result;
	}

	private function transmitText($object, $content)
	{
		$textTpl = "<xml> 
       <ToUserName><![CDATA[%s]]></ToUserName> 
       <FromUserName><![CDATA[%s]]></FromUserName> 
       <CreateTime>%s</CreateTime> 
       <MsgType><![CDATA[text]]></MsgType> 
       <Content><![CDATA[%s]]></Content> 
       <FuncFlag>0</FuncFlag> 
       </xml>";
		//sprintf() 函数把格式化的字符串写入变量中。
		$result = sprintf($textTpl, $object->FromUserName, $object->ToUserName, time(), $content);
		return $result;
	}

	//生成自定义目录
	public function menuSet()
	{
		$result = httpRequest([
			'url' => sprintf('https://api.weixin.qq.com/cgi-bin/menu/create?access_token=%s', \app\admin\controller\DiyImageText::getAccessToken()),
			'type' => 'post',
			'data' => <<<JSON
{
 "button":[
 {  
      "type":"click",
      "name":"特价",
      "key":"PROMOTE"
  },
  {  
      "type":"view",
      "name":"官网",
      "url":"http://www.baidu.com"
  },
  {
       "name":"菜单",
       "sub_button":[
       {    
           "type":"view",
           "name":"搜索",
           "url":"http://www.soso.com/"
        },
        {
           "type":"click",
           "name":"赞一下我们",
           "key":"V1001_GOOD"
        }]
   }]
}
JSON
			,
			'dataType' => 'json',

		]);
		dump($result);
	}

	public function uploadNews()
	{
		$articles = <<<JSON
{
   "articles": [
         {
            "thumb_media_id":"dphsWSfNO1xbQFgBCOGxKOeEfDbo4gnYiMiVyCd_g2rgYZ4P2NL2dEOP7HlP7hU-",
            "author":"吴江攀",
            "title":"laravel支持微信开发",
            "content_source_url":"http://www.hellokang.net/category/oop/",
            "content":"content",
            "digest":"OOP支持",
            "show_cover_pic":1
         }
   ]
}
JSON;
		$result = httpRequest([
			'type' => 'post',
			'url' => sprintf('https://api.weixin.qq.com/cgi-bin/media/uploadnews?access_token=%s', \app\admin\controller\DiyImageText::getAccessToken()),
			'data' => $articles,
			'dataType' => 'json',
		]);
		dump($result);
	}

	public function http_curl($url, $type = 'get', $res = 'json', $arr = '')
	{
		//1.初始化curl
		$ch = curl_init();
		//2.设置curl参数
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		if ($type == 'post') {
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $arr);
		}
		//采集
		$output = curl_exec($ch);
		//关闭
		curl_close($ch);
		if ($res == 'json') {
			return json_decode($output, true);
		}
	}

	public function getWxAccessToken()
	{
		//请求URL
		if ($_SESSION['access_token'] && $_SESSION['expire_time'] > time()) {
			//access_token没有过期
			return $_SESSION['access_token'];
		} else {
			//access_token不存在或者已经过期
			$conf = Db::table('sc_account_conf')->get(1);
			$appid = $conf['appid'];
			$appsecret = $conf['appsecret'];
			$url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={$appid}&secret={$appsecret}";
			$res = $this->http_curl($url, 'get', 'json');
			$access_token = $res['access_token'];
			//将access_token存到session中
			$_SESSION['access_token'] = $access_token;
			$_SESSION['expire_time'] = time() + 7000;
			return $access_token;
		}
	}
}
