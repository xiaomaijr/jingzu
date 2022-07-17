<?php

namespace app\base\model;

trait BaseModelObserve
{
    /**
     * 观察者对象列表数据(方法1)
     * @var
     */
    protected $server = [];

    /**
     * 观察者对象列表(方法2)
     * @var array
     */
    protected static $observer = [];

    /**
     * 添加观察者
     * @param $observer
     */
    protected function addServer($key, $observer)
    {
        $this->server[$key] = $observer;
    }

    /**
     * 移除观察者
     * @param $key
     */
    protected function removeServer($key)
    {
        unset($this->server[$key]);
    }

    /**
     * 执行观察者对应的接口操作
     * @param $fun_name
     * @param $parameter
     * @return bool
     */
    public function server($fun_name, $parameter)
    {
        foreach ($this->server as $key => $value) {
            if (!$value->$fun_name(...$parameter)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 观察者自定义执行函数
     * @param callable $callback
     * @param bool $is_return
     */
    protected static function handleObserver(callable $callback, bool $is_return = false)
    {
        foreach (static::$observer as $item) {
            if ($is_return) {
                return $callback($item);
            } else {
                $callback($item);
            }
        }
    }
}