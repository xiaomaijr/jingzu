<?php

namespace app\common\middleware;

use app\common\model\BrowseLog;
use think\Request;
use think\facade\Db;

class BrowsingHistory
{
    public function handle(Request $request, \Closure $next)
    {

        return $next($request);
    }
}
