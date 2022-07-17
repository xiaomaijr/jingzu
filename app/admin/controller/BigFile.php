<?php


namespace app\admin\controller;


use app\Response;

class BigFile{
    private $filepath = './upload/bigfile'; //上传目录
    private $tmpPath = './tmp'; //PHP文件临时目录
    private $blobNum; //第几个文件块
    private $totalBlobNum; //文件块总数
    private $fileName; //文件名
    private $new_file_name; //新文件路径

    public function __construct($tmpPath,$blobNum,$totalBlobNum,$fileName){
        $this->tmpPath = $tmpPath;
        $this->blobNum = $blobNum;
        $this->totalBlobNum = $totalBlobNum;
        $this->fileName = $fileName;

        $this->moveFile();
        $this->fileMerge();
    }

    //判断是否是最后一块，如果是则进行文件合成并且删除文件块
    private function fileMerge(){
        if($this->blobNum == $this->totalBlobNum){
            $blob = '';
	        $this->newFileName();
            for($i=1; $i<= $this->totalBlobNum; $i++){
//                $blob .= file_get_contents($this->filepath.'/'. $this->fileName.'__'.$i);
	            if(!is_dir($this->filepath.'/'. $this->fileName.'__'.$i)){
		            $blob = file_get_contents($this->filepath.'/'. $this->fileName.'__'.$i);
		            file_put_contents($this->new_file_name,$blob,FILE_APPEND);
	            }
            }
//            file_put_contents($this->new_file_name,$blob);
            $this->deleteFileBlob();
        }
    }

    //删除文件块
    private function deleteFileBlob(){
        for($i=1; $i<= $this->totalBlobNum; $i++){
            @unlink($this->filepath.'/'. $this->fileName.'__'.$i);
        }
    }

    //移动文件
    private function moveFile(){
        $this->touchDir();
        $filename = $this->filepath.'/'. $this->fileName.'__'.$this->blobNum;
        move_uploaded_file($this->tmpPath,$filename);
    }

    //API返回数据
    public function apiReturn(){
        $data=array();
        if($this->blobNum == $this->totalBlobNum){
            if(file_exists($this->new_file_name)){
                $data['code'] = 2;
                $data['msg'] = 'success';
                $data['fileName'] = $this->fileName;
                $data['new_file_name'] = '/' .$this->new_file_name;
            }
        }else{
            if(file_exists($this->filepath.'/'. $this->fileName.'__'.$this->blobNum)){
                $data['code'] = 1;
                $data['msg'] = 'waiting for all';
                $data['file_path'] = '';
            }
        }
        header('Content-type: application/json');
        echo json_encode($data);
    }

    //建立上传文件夹
    private function touchDir(){
        if(!file_exists($this->filepath)){
            return mkdir($this->filepath);
        }
    }

    private function newFileName(){
        //构造文件保存路径
        $fiel_dir = 'upload/pdf/' .date('Y-m-d') .'/';
        $file_name = getFileName() .'.' .getExt($this->fileName);
        if(!is_dir($fiel_dir)){
            mkdir($fiel_dir, 0777,true);
        }
        $this->new_file_name = $fiel_dir .$file_name;
    }
}
