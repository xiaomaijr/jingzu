<?php

namespace app\base\model;

use app\base\standard\BaseModelQueryStandard;
use think\Collection;
use think\db\Query;
use think\facade\Db;
use think\facade\Env;
use think\Model;

trait BaseModelQuery
{
    use BaseModelQueryStandard;

    //默认情况下getList每次读取的条数
    public static $limit = 20;

    /**
     * @param $where
     * @param $field
     * @param string $order
     * @param string $count_field
     * @param string $callback
     * @return array
     *
     */
    public static function getList($where, $field = '*', $order = 'id desc', $count_field = 'id', $callback = '', $group = '')
    {
        //获取操作标识信息
        $option = empty(input('option')) ? getFileName() : input('option');
        //获取分页数据信息
        $page = (int)input('page', 1);
        //获取查询条数信息
        $limit = input('limit', self::$limit);
        //判断where是否是类变量
        if ($where instanceof Query) {
            //直接使用where来进行下一步筛选
            $model = $where;
        } else {
            //获取实例化当前模型
            $model = static::where($where);
        }
        $model = $model->where(static::getSubmeterWhere($page, $option, $model->getPk()));
        //获取查询结果
        if (!is_float($field)) {
            $model = $model->field($field);
        }
        if (!empty($group)) {
            $model = $model->group($group);
        }
        $sql = $model->fetchSql()->select();
        //获取总条数
        $count = empty(input('count')) ? $model->count() : input('count');
        $result = $model->limit(($page - 1) * $limit, $limit)->order($order)->select();
        $i = 0;
        //截取结果集
        $result = $result->filter(function ($k) use (&$i, $limit) {
            if ($i < $limit) {
                return $k;
            }
            $i++;
        });
        //保存查询参数信息
//        self::saveOptionInfo($option, $page, 0, 0, $sql);
        //回调函数是否为空.不为空则调用回调函数处理数据
        if (is_callable($callback)) {
            $result = static::handle($callback, $result);
        }
        $data = [
            'data' => $result,
            'count' => $count,
            'code' => 0,
            'current_page' => $page,
            'max_page' => ceil($count / $limit),
            'option' => $option,
            'limit' => $limit
        ];
        return $data;
    }

    /**
     * @param $where
     * @param string $field
     * @return int
     * description 获取总条数
     */
    public static function getCount($where, $field = 'id')
    {
        return self::where($where)->count($field);
    }

    /**
     * 获取单条数据
     * @param $where
     * @param string $field
     * @param bool $cache
     * @return array|Model|null
     */
    public static function getOne($where, $field = '*', $cache = false, $order = '')
    {
        return self::where($where)->field($field)->cache($cache, 60)->order($order)->find();
    }

    /**
     * @param $where
     * @return mixed
     * 删除符合条件的数据
     */
    public static function del($where)
    {
        return self::where($where)->delete();
    }

    /**
     * @param $where
     * @param $data
     * @param false $cache
     * @return mixed
     * 修改数据
     */
    public static function edit($where, $data, $cache = false)
    {
        if (is_array($where) && !is_array(reset($where)) && isset($where[(new static())->getPk()])) {
            return self::update(array_merge($data, $where));
        } else {
            return self::update($data, $where);
        }
    }

    /**
     * @param $where
     * @param string $field
     * @param string $order
     * @param string $callback
     * @param bool $cache
     * @return Collection|array
     * 获取全部数据
     */
    public static function getAll($where, $field = '*', $order = 'id desc', $callback = '', $cache = false)
    {
        if ($where instanceof Query) {
            $model = $where;
        } else {
            $model = self::where($where);
        }
        $result = $model->field($field)->order($order)->cache($cache)->select();
        if (is_callable($callback)) {
            return self::handle($callback, $result);
        }
        return $result;
    }

    /**
     * 获取莫一列数据
     * @param $where
     * @param string $field
     * @param false $cache
     * @param string $default
     * @return mixed|string
     */
    public static function getOneField($where, $field = 'id', $cache = false, $default = '')
    {
        $info = self::where($where)->field($field)->cache($cache, 60)->find();
        if (!empty($info)) {
            return $info->getAttr($field);
        } else {
            return empty($default) && $default !== 0 ? '' : $default;
        }
    }

    /**
     * 查询数据的回调函数处理方法
     * @param callable $callback
     * @param Collection $data
     * @return Collection
     */
    protected static function handle(callable $callback, Collection &$data)
    {
        $result = $callback($data);
        return is_null($result) ? $data : $result;
    }

    /**
     * 判断给定条件的数据是否存在
     * @param $where
     * @param string $field
     * @return bool
     */
    public static function checkExist($where, $field = 'id', bool $cache = false):bool
    {
        $info = self::getOne($where, $field, $cache);
        return empty($info) ? false : true;
    }

    /**
     * 获取表自增长数据
     * @return mixed
     */
    public static function getTableAutoIncrement()
    {
        //获取当前表的全名
        $table = self::getTable();
        //先同步统计数据
        Db::query('Analyze table ' . $table);
        $result = Db::query('SELECT auto_increment FROM information_schema.tables where  table_schema="' . Env::get('database.database') . '" and table_name="' . $table . '";');
        return $result[0]['AUTO_INCREMENT'];
    }

    /**
     * 修改表自增长数据
     * @param int $num
     * @return mixed
     */
    public static function alterTableAutoIncrement($num = 1)
    {
        $table = self::getTable();
        $num += self::getTableAutoIncrement();
        $sql = 'alter table ' . $table . ' AUTO_INCREMENT=' . $num . ';';
        $result = Db::query($sql);
        return $result;
    }
}
