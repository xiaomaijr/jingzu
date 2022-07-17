<?php


namespace app\admin\controller;


use app\base\Response;

class File extends BaseIndex
{
    public function upload()
    {
        if($_FILES['file']['error'] != 0){
            return Response::Error('上传失败');
        }
        //构造文件保存路径
        $fiel_dir = 'upload/admin/' .date('Y-m-d') .'/';
        $file_name = getFileName() .'.' .getExt($_FILES['file']['name']);
        if(!is_dir($fiel_dir)){
            mkdir($fiel_dir, 0777,true);
        }
        $new_file_name = $fiel_dir .$file_name;
        if(move_uploaded_file($_FILES['file']['tmp_name'],$new_file_name)){
            return Response::Okdata(['url'=>'/' .$new_file_name,'host'=>$this->request->root(true)],'上传成功');
        }else{
            return Response::Error('上传失败');
        }
    }

    public function abundantUpload()
    {
        $file = $_FILES['edit'];
        if (empty($file) || $file['error'] != 0) {
            return Response::Error('上传失败');
        }

        //验证图片大小,不能超过2mb
        if ($file['size'] > 5 * 1024 * 1024) {
            return Response::Error('图像不能超过5Mb');
        }

        //检查判断要保存文件的文件夹是否存在
        //构建要保存的文件夹完整路径
        $file_dir = 'image/' . date('Y-m-d') . '/';
        if (!is_dir($file_dir)) {
            mkdir($file_dir, 0777, true);
        }

        $save_file = $file_dir . getFileName() . '.' . getExt($file['name']);
//        $site = \app\model\System::where(['id' => 1])->field('site')->find()['site'];

        //移动文件到指定位置
        if (move_uploaded_file($file['tmp_name'], $save_file)) {
//            return Response::Okdata([['id' => rtrim($site, '/') . '/' . $save_file]], '上传成功', '', 0);
            return Response::Okdata([['id' =>'/' . $save_file]], '上传成功', '', 0);
        } else {
            return Response::Error('上传失败');
        }
    }

	public function layeditUpload()
	{
		$file = $_FILES['file'];
		if (empty($file) || $file['error'] != 0) {
			return Response::Error('上传失败');
		}

		//验证图片大小,不能超过2mb
		if ($file['size'] > 5 * 1024 * 1024) {
			return Response::Error('图像不能超过5Mb');
		}

		//检查判断要保存文件的文件夹是否存在
		//构建要保存的文件夹完整路径
		$file_dir = 'image/' . date('Y-m-d') . '/';
		if (!is_dir($file_dir)) {
			mkdir($file_dir, 0777, true);
		}

		$save_file = $file_dir . getFileName() . '.' . getExt($file['name']);
//        $site = \app\model\System::where(['id' => 1])->field('site')->find()['site'];

		//移动文件到指定位置
		if (move_uploaded_file($file['tmp_name'], $save_file)) {
			return Response::Okdata(['src' =>'/' . $save_file], '上传成功', '', 0);
		} else {
			return Response::Error('上传失败');
		}
	}

    public static function stringWriteFile($string,$file_ext)
    {
        //构建要保存的文件夹完整路径
        $file_dir = 'upload/' . date('Y-m-d') . '/';
        if (!is_dir($file_dir)) {
            mkdir($file_dir, 0777, true);
        }

        $save_file = $file_dir . getFileName() . '.' . $file_ext;

        $open=fopen($save_file,"a" );
        fwrite($open,$string);
        fclose($open);
        return $save_file;
    }

    public function uploadword()
    {
        if($_FILES['file']['error'] != 0){
            return Response::Error('上传失败');
        }
        //构造文件保存路径
        $fiel_dir = 'upload/word/' .date('Y-m-d') .'/';
        $file_name = getFileName() .'.' .getExt($_FILES['file']['name']);
        if(!is_dir($fiel_dir)){
            mkdir($fiel_dir, 0777,true);
        }
        $new_file_name = $fiel_dir .$file_name;
        if(move_uploaded_file($_FILES['file']['tmp_name'],$new_file_name)){
            return Response::Okdata(['url'=>'/' .$new_file_name,'host'=>$this->request->root(true)],'上传成功');
        }else{
            return Response::Error('上传失败');
        }
    }
    public function uploadpdf()
    {
//        ini_set("display_errors", "On");
//        error_reporting(E_ALL | E_STRICT);
        $file = $_FILES['file'];
        if($_FILES['file']['error'] != 0){
            return Response::Errordata($_FILES['file'],'上传失败');
        }
        //验证大小,不能超过10MB
        if ($file['size'] > 10 * 1024 * 1024) {
            return Response::Error('pdf不能超过10Mb');
        }
        //构造文件保存路径
        $fiel_dir = 'upload/pdf/' .date('Y-m-d') .'/';
        $file_name = getFileName() .'.' .getExt($_FILES['file']['name']);
        if(!is_dir($fiel_dir)){
            mkdir($fiel_dir, 0777,true);
        }
        $new_file_name = $fiel_dir .$file_name;
        if(move_uploaded_file($_FILES['file']['tmp_name'],$new_file_name)){
            return Response::Okdata(['url'=>'/' .$new_file_name,'host'=>$this->request->root(true),'name'=>$_FILES['file']['name']],'pdf上传成功');
        }else{
            return Response::Errordata('','上传失败');
        }
    }
	public function uploadBigVideo()
	{
		//实例化并获取系统变量传参
		$upload = new BigFile($_FILES['file']['tmp_name'],$_POST['blob_num'],$_POST['total_blob_num'],$_POST['file_name']);
		//调用方法，返回结果
		$upload->apiReturn();
	}
}
