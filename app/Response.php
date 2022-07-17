<?php

namespace app;
use think\Response as Think_Response;

class Response
{
    //返回的消息类型。默认为ajax类型
    protected static $msgType = 'ajax';

    public static function Ok($msg = null, $url = null, $code = 0)
    {
        $data = [
            'msg' => $msg,
            'success' => true,
            'status' => 'success',
            'url' => $url,
            'errorcode' => 0,
            'code' => $code
        ];
        return self::returnMsg($data);
    }

    public static function Error($msg = null, $url = null, $code = 1)
    {
        $data = [
            'msg' => $msg,
            'success' => false,
            'status' => 'fail',
            'url' => $url,
            'errorcode' => $code,
            'code' => $code
        ];
        return self::returnMsg($data);
    }

    public static function Okdata($data = null, $msg = '', $url = '', $code = 0)
    {
        $data = [
            'msg' => $msg,
            'url' => $url,
            'success' => true,
            'status' => 'success',
            'data' => $data,
            'code' => $code
        ];
        return self::returnMsg($data);
    }

    public static function Errordata($data = null, $msg = '', $url = '', $code = 1)
    {
        $data = [
            'msg' => $msg,
            'url' => $url,
            'success' => false,
            'status' => 'fail',
            'data' => $data,
            'code' => $code
        ];
        return self::returnMsg($data);
    }
    public static function Okpic($data = null, $msg = '', $url = '', $code = 0)
    {
        $data = [
            'code' => $code,
            'msg' => $msg,
            'title' => "JSON请求的相册",
            'id' => 1,
            'success' => true,
            'start' => 0,
            'status' => 'success',
            'data' => $data

        ];
        return self::returnMsg($data);
    }
    /**
     * @param $data
     * @return false|string
     * Description ajax格式消息返回
     */
    public static function getAjaxReturn($data)
    {
        return json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    /**
     * @param $data
     * @return string
     * Description xml格式消息返回
     */
    public static function getXmlReturn($data)
    {
        $xml = "<xml>";
        foreach ($data as $key => $val) {
            if (is_numeric($val)) {
                $xml .= "<" . $key . ">" . $val . "</" . $key . ">";
            } else {
                $xml .= "<" . $key . "><![CDATA[" . $val . "]]></" . $key . ">";
            }
        }
        $xml .= "</xml>";
        return $xml;
    }

    /**
     * @param $type
     * Description 设置消息返回类型
     */
    public static function setMsgType($type)
    {
        self::$msgType = $type;
        return (new self);
    }

    /**
     * @param $data
     * @return false|string
     * Description 返回消息信息
     */
	protected static function returnMsg($data)
	{
		if (self::$msgType == 'ajax') {
			return Think_Response::create(self::getAjaxReturn($data),'application/json',200)->contentType('application/json');
		} else if (self::$msgType == 'xml') {
			return Think_Response::create(self::getXmlReturn($data),'',200)->contentType('application/xml');
		} else {
			return Think_Response::create(self::getAjaxReturn($data),'',200)->contentType('application/json');
		}
	}
}
