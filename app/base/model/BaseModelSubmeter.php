<?php

namespace app\base\model;

use htsc\Redis;

trait BaseModelSubmeter
{
    /**
     * 模型对应的数据看是否使用了分库分表,默认为false,未使用分库分表
     * @var bool
     */
    protected static $is_submeter = false;

    /**
     * 获取翻页信息
     * @param int $page
     * @param int $limit
     * @param string $option
     * @return array
     */
    protected static function getLimit($page, $limit, $option = '', $pk = 'id')
    {
        //判断模型对应的表是否进行了分库分表,保存了操作信息且操作信息不为空
        if (static::$is_submeter && !empty($option)) {
            return [0, 2 * $limit];
        }
        return [($page - 1) * $limit, $limit];
    }

    /**
     * 获取分表筛选条件
     * @param $page
     * @param $option
     * @return array
     */
    protected static function getSubmeterWhere($page, $option = '', $pk = 'id')
    {
        //判断模型对应的表是否进行了分库分表,保存了操作信息且操作信息不为空
        if (static::$is_submeter && !empty($option)) {
            $option_content = Redis::connect()->get($option);
            if (!empty($option_content)) {
                $option_content = static::deCodeOption($option_content);
                //判断是向前翻页还是向后翻页
                if ($page - $option_content['page'] < 0) {
                    return [[$pk, '<', $option_content['min_id']]];
                } else if ($page - $option_content['page'] > 0) {
                    return [[$pk, '>', $option_content['max_id']]];
                } else {
                    return [[$pk, '>', $option_content['max_id']]];
                }
            }
        }
        return [];
    }

    protected static function getPage($page, $option)
    {
        //判断模型对应的表是否进行了分库分表,保存了操作信息且操作信息不为空
        if (static::$is_submeter && !empty($option)) {
            $option_content = Redis::connect()->get($option);
            if (!empty($option_content)) {
                $option_content = static::deCodeOption($option_content);
                //判断是向前翻页还是向后翻页
                $ads = abs($page - $option_content['page']);
                if ($page - $option_content['page'] < 0 && $ads > 2) {
                    return $page - 1;
                } else if ($page - $option_content['page'] > 0 && $ads > 2) {
                    return $page + 1;
                }
            else{
                    return $page;
                }
            }
        }
        return $page;
    }
}