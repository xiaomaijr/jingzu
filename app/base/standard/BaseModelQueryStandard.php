<?php

namespace app\base\standard;

trait BaseModelQueryStandard
{
    /**
     * 获取列表数据
     * @param $where
     * @param string $field
     * @param string $order
     * @param string $count_field
     * @param string $callback
     * @param string $group
     * @return array
     */
    abstract public static function getList($where, $field = '*', $order = 'id desc', $count_field = 'id', $callback = '', $group = ''): array;

    /**
     * 获取符合条件的数量
     * @param $where
     * @param string $field
     * @return int
     */
    abstract public static function getCount($where, $field = 'id'): int;

    /**
     * 获取符合条件的一条数据
     * @param $where
     * @param string $field
     * @param false $cache
     * @param string $order
     * @return mixed
     */
    abstract public static function getOne($where, $field = '*', $cache = false, $order = '');

    /**
     * 删除一条数据
     * @param $where
     * @return mixed
     */
    abstract public static function del($where);

    /**
     * 修改数据
     * @param $where
     * @param $data
     * @param false $cache
     * @return mixed
     */
    abstract public static function edit($where, $data, $cache = false);

    /**
     * 获取全部数据
     * @param $where
     * @param string $field
     * @param string $order
     * @param string $callback
     * @param bool $cache
     * @return mixed
     */
    abstract public static function getAll($where, $field = '*', $order = 'id desc', $callback = '', $cache = false);

    /**
     * 获取符合条件的一个字段的值
     * @param $where
     * @param string $field
     * @param false $cache
     * @param string $default
     * @return mixed
     */
    abstract public static function getOneField($where, $field = 'id', $cache = false, $default = '');

    /**
     * 判断符合条件的数据是否存在
     * @param $where 查询条件
     * @param string $field 判断的字段
     * @param bool $cache 是否使用缓存
     * @return bool 判断结果
     */
    abstract public static function checkExist($where, $field = 'id', bool $cache = false): bool;
}