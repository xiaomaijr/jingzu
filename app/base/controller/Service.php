<?php

namespace app\base\controller;

use think\App;

class Service extends App
{
    public function getBindService(){
        return $this->bind;
    }
}