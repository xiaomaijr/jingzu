<?php

namespace app\base;

use think\Validate;

class BaseValidate extends Validate
{
    /**
     * @param $data
     * @param string $callback
     * @param string $scene
     * @return array
     * 获取验证后的数据
     */
    public static function getData($data, $callback = '', $scene = '')
    {
        $_this = new static;
        $a =  [];
        $a = &$a;
        if (!empty($scene)) {
            $field = $_this->scene[$scene];
        } else {
            $field = array_keys($_this->rule);
        }

        foreach ($field as $v) {
            @$a[$v] = $data[$v];
        }

        if (is_callable($callback)) {
            $b = $callback($a, input());
            if (!is_null($b)) {
                $a = $b;
            }
        }

        return $a;
    }
}