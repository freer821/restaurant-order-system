export function calcCartGoodId(good) {
	if (good.specifications.length > 0) {
		return good.goodsId+'_'+good.product_id+'_'+good.specifications.join('_');
	}
	return good.goodsId+'_'+good.product_id;
}
