<?php


namespace app\common\model;


use app\base\BaseModel;
use think\facade\Request;
use think\facade\Session;

class Order extends BaseModel
{
    protected $name = 'order';

    public function getPriceAttr($value,$data){
    	$price = Offer::getOneField(
    		['brand_id'=>$data['brand_id'],
		     'model_id'=>$data['model_id'],
		     'capacity_id'=>$data['capacity_id'],
		     'condition_id'=>$data['condition_id']],'price');
        return $price;
    }

	public function getUserInfoAttr($value,$data)
	{
		$info = Member::getOne(['id'=>$data['uid']],'username,phone,share_pid,is_distribution,image');
//		$info['phone_y'] = $info['phone'];
		$info['phone'] = substr_replace($info['phone'], '****', 3, 4);
		return $info;
	}

	public function getSureTimeAttr($value,$data)
	{
		return empty($data['sure_time'])?'':date('Y-m-d H:i:s',$data['sure_time']);
	}

	public function getPhotoAttr($value,$data)
	{
		$url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'];
		return empty($data['photo'])?'':$url.$data['photo'];
	}

	public function getBrandImgAttr($value,$data)
	{
		$brand_img = Brand::getOneField(['id'=>$data['brand_id']],'image');
//		$url=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'];
//		return empty($brand_img)?'':$url.$brand_img;
		return $brand_img;
	}

	public function getModelNameAttr($value,$data)
	{
		$brand_title = Brand::getOneField(['id'=>$data['brand_id']],'title');
		$model_name = BrandModel::getOneField(['id'=>$data['model_id']],'title');
		return $brand_title.$model_name;
	}
	public function getCapacityAttr($value,$data)
	{
		$capacity_title = BrandCapacity::getOneField(['id'=>$data['capacity_id']],'title');
		return $capacity_title;
	}

	public function getModelParamAttr($value,$data)
	{
		$capacity_title = BrandCapacity::getOneField(['id'=>$data['capacity_id']],'title');
		$net_name = BrandNetworkModel::getOneField(['id'=>$data['model_id']],'title');
		return $capacity_title.'/'.$net_name;
	}

	public function getCommissionDefAttr($value,$data)
	{
		$commission_per = CommissionPer::getOne([['min','<=',$data['price_eval']],['max','>',$data['price_eval']]]);
		return empty($commission_per)?0:$commission_per['commission'];
	}
	public function getUserPhoneAttr($value,$data)
	{
		$info = Member::getOneField(['id'=>$data['uid']],'phone');
		return $info;
	}


}
