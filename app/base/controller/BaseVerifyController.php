<?php

namespace app\base\controller;

trait BaseVerifyController
{
    protected string $phone_rule = '/^1[3456789]\d{9}$/ims';
	protected string $password_rule = '/(?=.*[a-z])(?=.*\d)(?=.*[#@!~%^&*])[a-z\d#@!~%^&*_.]{8,20}/i';
}
