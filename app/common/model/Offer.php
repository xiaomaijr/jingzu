<?php


namespace app\common\model;

use app\base\BaseModel;
use think\facade\Request;
use think\facade\Session;
use think\Model;
use think\Db;

class Offer extends BaseModel
{
    protected $name = 'offer';

	public function getPurchNameAttr($value,$data)
	{
		return $data['purch_id']?BrandPurch::getOneField(['id'=>$data['purch_id']],'title'):'无';
	}

	public function getBxNameAttr($value,$data)
	{
		return $data['bx_id']?BrandBx::getOneField(['id'=>$data['bx_id']],'title'):'无';
	}

	public function getBrandNameAttr($value,$data)
	{
		return Brand::getOneField(['id'=>$data['brand_id']],'title');
	}

	public function getModelNameAttr($value,$data)
	{
		return BrandModel::getOneField(['id'=>$data['model_id']],'title');
	}

	public function getNetworkNameAttr($value,$data)
	{
		return BrandNetworkModel::getOneField(['id'=>$data['network_model_id']],'title');
	}

	public function getCapacityNameAttr($value,$data)
	{
		return BrandCapacity::getOneField(['id'=>$data['capacity_id']],'title');
	}

	public function getConditionNameAttr($value,$data)
	{
		return BrandCondition::getOneField(['id'=>$data['condition_id']],'title');
	}

}
