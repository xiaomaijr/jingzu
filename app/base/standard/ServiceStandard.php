<?php

namespace app\base\standard;

abstract class ServiceStandard implements taskServiceStandard
{
    /**
     * 相关的id集合
     * @var
     */
    protected $ids;

    /**
     * 队列所需的数据
     * @var
     */
    protected $task_data;

    public function __construct($ids)
    {
        $this->ids = $ids;

        $this->initialize();
    }

    /**
     * 执行添加队列操作
     * @param $task_name
     * @param $fun_name
     * @return int|string
     */
    public function executeAddTask($task_name, $fun_name)
    {
        return task($task_name, $fun_name, $this->task_data);
    }

    protected function initialize()
    {
    }

    protected function handleIds(callable $fun)
    {
        foreach ($this->ids as $item) {
            $fun($item);
        }
    }
}