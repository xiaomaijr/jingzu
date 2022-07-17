<?php
namespace app\wxapp\controller;

use app\BaseController;
use app\base\Response;
use app\common\model\Brand as Brand_Model;
use app\common\model\BrandCondition;
use app\common\model\BrandModel;
use app\common\model\Offer;
use app\wxapp\middleware\Auth;
use app\wxapp\model\Member;
use think\facade\Db;

class Brand extends BaseController
{
	//Brand
    public function getBrandList()
    {
	    $list = Brand_Model::getAll([],'*','sort desc',function($data){
		    $data->map(function($item){
//			    $item->imgUrl = $item->image;
		    	return $item;
		    });
	    });

	    return Response::Okdata($list, 'get data success');
    }
	//获取品牌型号
	public function getBrandModelList()
	{
		$list = Brand_Model::getAll([],'id,title','sort desc',function($data){
			$data->map(function($item){
//			    $item->child = BrandModel::getAll(['pid'=>$item->id],'id,title');
				$id =$item->id;
			    $item->child = Db::query("SELECT id,title FROM rec_brand_model where pid=$id ORDER BY title+0 DESC");
				return $item;
			});
		});

		return Response::Okdata($list, 'get data success');
	}

	//获取型号选项
	public function getBrandModelInfo()
	{
		$id = $this->request->param('id');

		$info = BrandModel::getOne(['id'=>$id],'id,pid,title')
		                  ->append(['brand_name','brand_capacity','brand_network','brand_condition','brand_purch','brand_bx']);

		return Response::Okdata($info, 'get data success');
	}

	//获取价格
	public function getBrandModelPrice()
	{
		$purch_id = $this->request->param('purch_id');
//		$bx_id = $this->request->param('bx_id');
		$model_id = $this->request->param('model_id');
		$brand_id = $this->request->param('brand_id');
		$capacity_id = $this->request->param('capacity_id','',0);
		$condition_id = $this->request->param('condition_id','',0);
		if(empty($capacity_id)||empty($condition_id)){
			return Response::Okdata([], 'get data success');
		}
		$info = Offer::getOne([
			'purch_id'=>$purch_id,
//			'bx_id'=>$bx_id,
			'brand_id'=>$brand_id,
			'model_id'=>$model_id,
			'capacity_id'=>$capacity_id,
			'condition_id'=>$condition_id
		],'*');

		return Response::Okdata($info, 'get data success');
	}

	//获取等级说明
	public function getBrandModelCondition()
	{
		$brand_id = $this->request->param('brand_id');
		$type = $this->request->param('type','',0);
		if(empty($brand_id)||empty($type)){
			return Response::Okdata([], 'get data success');
		}
		$info = BrandCondition::getOne([
			'brand_id'=>$brand_id,
			'type'=>$type,
		],'*');

		return Response::Okdata($info, 'get data success');
	}
}
