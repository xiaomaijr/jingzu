<?php

namespace app\wxapp\controller;

use app\BaseController;
use app\wxapp\middleware\Auth;
use app\base\Response;
use think\App;

class File extends BaseController
{
    public function __construct(App $app = null)
    {
        parent::__construct($app);
        //调用验证请求参数,防止在未注册或者未登陆状态下恶意上传文件
//        $this->checkSign();
    }

    /**
     * description 检查请求签名
     */
    private function checkSign()
    {
        $timestamp = $this->request->param('timestamp');
        $nonce = $this->request->param('nonce');
        $sign = $this->request->param('sign');
        if($sign != md5($timestamp .$nonce .'bkgy')){
            Response::Error('非法的文件上传')->send();die;
        }
    }

    public function upload()
    {
	    $uid = Auth::$uid;

        if($_FILES['file']['error'] != 0){
            return Response::Error('上传失败');
        }
        //构造文件保存路径
        $fiel_dir = 'upload/zp/';
        $file_name = getFileName() .'.' .getExt($_FILES['file']['name']);
        if(!is_dir($fiel_dir)){
           mkdir($fiel_dir, 0777,true);
        }
        $new_file_name = $fiel_dir .$file_name;
        if(move_uploaded_file($_FILES['file']['tmp_name'],$new_file_name)){
            return Response::Okdata(['url'=>'/' .$new_file_name,'host'=>$this->request->root(true),'filename'=>$file_name],'上传成功');
        }else{
            return Response::Error('上传失败');
        }
    }

	public function uploadPdf()
	{
		$uid = Auth::$uid;

		if($_FILES['file']['error'] != 0){
			return Response::Error('上传失败');
		}
		//构造文件保存路径
		$fiel_dir = 'upload/pdf/';
		$file_name = getFileName() .'.' .getExt($_FILES['file']['name']);
		if(!is_dir($fiel_dir)){
			mkdir($fiel_dir, 0777,true);
		}
		$new_file_name = $fiel_dir .$file_name;
		if(move_uploaded_file($_FILES['file']['tmp_name'],$new_file_name)){
			return Response::Okdata(['url'=>'/' .$new_file_name,'host'=>$this->request->root(true),'filename'=>$file_name],'上传成功');
		}else{
			return Response::Error('上传失败');
		}
	}

	public function uploadMedio()
	{
		$uid = Auth::$uid;

		if($_FILES['file']['error'] != 0){
			return Response::Error('上传失败');
		}
		//构造文件保存路径
		$fiel_dir = 'upload/medio/';
		$file_name = getFileName() .'.' .getExt($_FILES['file']['name']);
		if(!is_dir($fiel_dir)){
			mkdir($fiel_dir, 0777,true);
		}
		$new_file_name = $fiel_dir .$file_name;
		if(move_uploaded_file($_FILES['file']['tmp_name'],$new_file_name)){
			return Response::Okdata(['url'=>'/' .$new_file_name,'host'=>$this->request->root(true),'filename'=>$file_name],'上传成功');
		}else{
			return Response::Error('上传失败');
		}
	}

    public static function getFileName($type,$uid){
    	$now=date('YmdHis');
    	$sui = uniqid();
		if($type==0){
			$filename= $uid.'_'.$now.$sui.'_我的照片';
		}elseif ($type==1){
			$filename= $uid.'_'.$now.$sui.'_我的简历';
		}elseif ($type==2){
			$filename= $uid.'_'.$now.$sui.'_我的证书';
		}else{
			$filename= getFileName();
		}

		return $filename;
    }
}
