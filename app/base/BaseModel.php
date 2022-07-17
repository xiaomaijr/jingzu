<?php

namespace app\base;

use app\base\model\BaseModelObserve;
use app\base\model\BaseModelQuery;
use app\base\model\BaseModelOption;
use app\base\model\BaseModelSubmeter;
use think\Model;

class BaseModel extends Model
{
    use BaseModelOption, BaseModelSubmeter, BaseModelQuery, BaseModelObserve;

    protected $name = '';

    /**
     * @var bool
     */
    protected $autoWriteTimestamp = true;

    protected $createTime = 'create_time';

    protected $updateTime = 'alter_time';

    /**
     * @var bool
     * description 是否写入日志
     */
    protected static $openWriteLog = false;

    /**
     * @var string
     * description 日志分组
     */
    protected static $logClass = '';

    /**
     * @var int
     * description 日志中记录的操作人id
     */
    protected static $logUid = 0;

    /**
     * @var int
     * description 日志中记录的队列id
     */
    protected static $logTaskId = 0;

    /**
     * @var int
     * description 插入的操作日志的id
     */
    protected static $logId = 0;

    /**
     * @var array
     * description 日志的操作类型
     */
    protected static $logType = [1 => '修改', 2 => '添加', 3 => '删除'];

    /**
     * @var bool
     * description 是否使用缓存,默认为true
     */
    protected static $cached = true;

    /**
     * 操作信息存储的key
     * @var string
     */
    protected static $option_info_key_postfix = '_info';

    /**
     * 操作信息存储的有效期,默认为1小时
     * @var string
     */
    protected static $option_info_key_expires = 3600;

    public function __construct($data = [])
    {
        parent::__construct($data);
    }

    /** 查询事件设置,记录到日志表中 **/
    public static function onBeforeInsert(Model $model)
    {

    }

    public static function onBeforeUpdate(Model $model)
    {

    }

    public static function onBeforeDelete(Model $model)
    {

    }

    public static function onAfterInsert(Model $model)
    {

    }

    public static function onAfterUpdate(Model $model)
    {
    }

    public static function onAfterDelete(Model $model)
    {
    }


    /**
     * @param Model $model
     * @param int $type
     * description 记录操作日志到日志表中
     */
    protected static function writeLog(Model $model, int $type)
    {
        if (static::$openWriteLog) {
            if ($type == 2) {
                $primary_id = 0;
                $original = [];
            } else {
                $primary_id = $model->id;
                //查询原始数据
                $result = self::where('id', '=', $model->id)->field('*')->find();

                if (empty($result)) {
                    $original = [];
                } else {
                    $original = $result->getOrigin();
                }
            }
//
            //计算更新后的完整数据
            $later = $model->getData();
            $later = array_merge($original, $later);
            $model->name;

            $data = [
                'origin' => json_encode($original, JSON_UNESCAPED_UNICODE),
                'data' => json_encode($later, JSON_UNESCAPED_UNICODE),
                'task_id' => static::$logTaskId,
                'uid' => static::$logUid,
                'create_time' => time(),
                'class' => static::$logClass,
                'name' => $model->name,
                'type' => $type,
                'primary_id' => $primary_id
            ];

            static::$logId = Log::insertGetId($data);

        }

    }

    /**
     * @param $class
     * description 设置写入日志的分组
     */
    public static function setWriteLogClass($class)
    {
        static::$logClass = $class;
    }

    /**
     * @param $uid
     * description 设置写入日志的操作用户id
     */
    public static function setWriteLogUid($uid)
    {
        static::$logUid = $uid;
    }

    public static function setWriteLogTaskId($taskId)
    {
        static::$logTaskId = $taskId;
    }
}