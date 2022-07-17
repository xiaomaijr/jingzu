<?php

namespace app\base\model;

use htsc\Redis;

trait BaseModelOption
{
    /**
     * 操作标识存储的key
     * @var string
     */
    protected static $option = '';

    /**
     * 对操作信息进行编码
     * @param $info
     * @return string
     */
    protected static function enCodeOption($info)
    {
        return json_encode($info, JSON_UNESCAPED_UNICODE);
    }

    /**
     * 对操作信息进行解码
     * @param $content
     * @return mixed
     */
    public static function deCodeOption($content)
    {
        return json_decode($content, true);
    }

    /**
     * 保存操作信息
     * @param $option 标识字符串
     * @param $page 翻页数
     * @param $min_id 最小id
     * @param $max_id 最大id
     * @param $sql sql语句
     * @param $data 额外数据
     */
    public static function saveOptionInfo($option, $page, $min_id, $max_id, $sql, $data = []):void
    {
        $content = [
            'page' => $page,
            'min_id' => $min_id,
            'max_id' => $max_id,
            'sql' => $sql,
            'data' => $data
        ];
        $content = self::enCodeOption($content);
        Redis::connect()->set($option, $content, 259200);
    }
}