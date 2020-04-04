<template>
  <div class="tab_class">
    <div class="class_tree clearfix">
      <ul class="class_tree_nav">
        <li
          v-for="(item, index) in categoryList"
          :key="index"
          :class="{active_nav: currentCategory.id == item.id}"
          @click="changeCatalog(index)"
        >{{item.name}}</li>
      </ul>
      <div class="class_tree_content">
        <div class="class_tree_all">
          <van-image
            height="70"
            fit="fill"
            lazy-load
            :src="currentCategory.picUrl"
          />
        </div>
        <div class="box">
          <span>{{currentCategory.desc}}</span>
        </div>
        <div class="class_tree_items_wrap clearfix">

          <van-card
            v-for="(item, i) in goodsList"
            :key="i"
            :desc="item.brief"
            :title="item.name"
            :thumb="item.picUrl"
            :price="item.retailPrice"
            :origin-price="item.counterPrice"
            @click="itemClick(item.id)"
          />

        </div>
      </div>
    </div>
    <van-sku
      v-model="showSku"
      :sku="sku"
      :hide-stock="true"
      :goods="skuGoods"
      :goodsId="goods.info.id"
      close-on-click-overlay
      @buy-clicked="buyGoods"
      @add-cart="addCart"
    >
      <template #sku-actions="props">
        <div class="van-sku-actions">
          <van-button
            square
            size="large"
            type="warning"
            @click="props.skuEventBus.$emit('sku:addCart')"
          >
            add to Cart
          </van-button>
          <!-- trigger sku inner event -->
          <van-button
            square
            size="large"
            type="danger"
            @click="props.skuEventBus.$emit('sku:buy')"
          >
            Buy Now
          </van-button>
        </div>
      </template>

    </van-sku>

  </div>
</template>

<script>
import {
	goodsDetail,
	cartGoodsCount,
	cartAdd,
	cartFastAdd,
	goodsFastfoodCategory,
	goodsList
} from '@/api/api';
import { setLocalStorage } from '@/utils/local-storage';

import { Card, List } from 'vant';
import _ from 'lodash';

export default {
	data() {
		return {
			categoryList: [],
			currentCategory: {},
			page: 0,
			limit: 100,
			goodsList: [],
			showSku: false,
			goods: {
				userHasCollect: 0,
				info: {
					gallery: []
				}
			},
			sku: {
				tree: [],
				list: [],
				price: '1.00' // 默认价格（单位元）
			},
			skuGoods: {
				// 商品标题
				title: '',
				// 默认商品 sku 缩略图
				picture: ''
			}
		};
	},

	created() {
		this.initData();
	},

	methods: {
		initData() {
			goodsFastfoodCategory().then(res => {
				this.categoryList = res.data.data;
				this.goodsList = [];
				if (this.categoryList.length > 0) {
					this.currentCategory = this.categoryList[0];
					this.getGoodsList();
				}
			});
		},
		changeCatalog(index) {
			this.currentCategory = this.categoryList[index];
			this.goodsList = [];
			this.getGoodsList();
		},
		getGoodsList() {
			this.page++;
			goodsList({
				categoryId: this.currentCategory.id,
				page: this.page,
				limit: this.limit
			}).then(res => {
				this.goodsList.push(...res.data.data.list);
				this.loading = false;
				this.finished = res.data.data.page >= res.data.data.pages;
			});
		},
		skuAdapter() {
			const tree = this.setSkuTree();
			const list = this.setSkuList();
			const skuInfo = {
				price: parseInt(this.goods.info.retailPrice), // 未选择规格时的价格
				stock_num: 0, // TODO 总库存
				collection_id: '', // 无规格商品skuId取collection_id，否则取所选sku组合对应的id
				none_sku: false, // 是否无规格商品
				hide_stock: true
			};
			this.sku = {
				tree,
				list,
				...skuInfo
			};
			this.skuGoods = {
				title: this.goods.info.name,
				picture: this.goods.info.picUrl
			};
		},
		setSkuList() {
			var sku_list = [];
			_.each(this.goods.productList, v => {
				var sku_list_obj = {};
				_.each(v.specifications, (specificationName, index) => {
					sku_list_obj['s' + (~~index + 1)] = this.findSpecValueIdByName(
						specificationName
					);
				});

				sku_list_obj.price = v.price * 100;
				sku_list_obj.stock_num = v.number;
				sku_list.push(sku_list_obj);
			});

			return sku_list;
		},
		findSpecValueIdByName(name) {
			let id = 0;
			_.each(this.goods.specificationList, specification => {
				_.each(specification.valueList, specValue => {
					if (specValue.value === name) {
						id = specValue.id;
						return;
					}
				});
				if (id !== 0) {
					return;
				}
			});
			return id;
		},
		setSkuTree() {
			let specifications = [];
			_.each(this.goods.specificationList, (v, k) => {
				let values = [];
				_.each(v.valueList, vv => {
					vv.name = vv.value;
					values.push({
						id: vv.id,
						name: vv.value,
						imUrl: vv.picUrl
					});
				});

				specifications.push({
					k: v.name,
					v: values,
					k_s: 's' + (~~k + 1)
				});
			});

			return specifications;
		},

		itemClick(id) {
			goodsDetail({ id: id }).then(res => {
				this.goods = res.data.data;
				this.skuAdapter();
				this.showSku = true;
			});

			cartGoodsCount().then(res => {
				this.cartInfo = res.data.data;
			});

			this.showSku = true;
		},
		addCart(data) {
			console.log(data);
			let that = this;
			let params = {
				goodsId: data.goodsId,
				number: data.selectedNum,
				productId: 0
			};
			if (_.has(data.selectedSkuComb, 's3')) {
				this.$toast({
					message: '目前仅支持两规格',
					duration: 1500
				});
				return;
			} else if (_.has(data.selectedSkuComb, 's2')) {
				params.productId = this.getProductId(
					data.selectedSkuComb.s1,
					data.selectedSkuComb.s2
				);
			} else {
				params.productId = this.getProductIdByOne(data.selectedSkuComb.s1);
			}
			cartAdd(params).then(() => {
				this.cartInfo = this.cartInfo + data.selectedNum;
				this.$toast({
					message: '已添加至购物车',
					duration: 1500
				});
				that.showSku = false;
			});
		},
		buyGoods(data) {
			let that = this;
			let params = {
				goodsId: data.goodsId,
				number: data.selectedNum,
				productId: 0
			};
			if (_.has(data.selectedSkuComb, 's3')) {
				this.$toast({
					message: '目前仅支持两规格',
					duration: 1500
				});
				return;
			} else if (_.has(data.selectedSkuComb, 's2')) {
				params.productId = this.getProductId(
					data.selectedSkuComb.s1,
					data.selectedSkuComb.s2
				);
			} else {
				params.productId = this.getProductIdByOne(data.selectedSkuComb.s1);
			}
			cartFastAdd(params).then(res => {
				let cartId = res.data.data;
				setLocalStorage({ CartId: cartId });
				that.showSku = false;
				this.$router.push('/order/checkout');
			});
		},
		getProductIdByOne(s1) {
			var productId;
			var s1_name;
			_.each(this.goods.specificationList, specification => {
				_.each(specification.valueList, specValue => {
					if (specValue.id === s1) {
						s1_name = specValue.value;
						return;
					}
				});
			});

			_.each(this.goods.productList, v => {
				let result = _.without(v.specifications, s1_name);
				if (result.length === 0) {
					productId = v.id;
				}
			});
			return productId;
		}
	},
	components: {
		[List.name]: List,
		[Card.name]: Card
	}
};
</script>


<style lang="scss" scoped>
@import '../../assets/scss/mixin';

.tab_class {
	overflow: hidden;
	background-color: #fff;
}

.height-fix {
	padding-bottom: 42px;
}

.tal_class_searchBox {
	position: relative;
}

.tal_class_searchMask {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 9;
}

.box {
	width: 250px;
	height: 20px;
	text-align: center;
	font-family: PingFangSC-Light, helvetica, 'Heiti SC';
	font-size: 13px;
	position: absolute;
	top: 95px;
}
.box span {
	line-height: 20px;
}
.class_tree {
	position: relative;
	background-color: #fff;
	overflow-x: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	height: 100%;
	box-sizing: border-box;
}
.class_tree_nav {
	float: left;
	width: 20%;
	height: 100%;
	background-color: #fff;
	overflow: auto;
	> li {
		@include one-border;
		height: 40px;
		line-height: 40px;
		text-align: center;
		border-left: 2px solid $bg-color;
	}
	> li.active_nav {
		background-color: #fff;
		border-left: 2px solid $red;
		color: $red;
	}
}
.class_tree_content {
	margin-left: 100px;
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;
	.class_tree_all {
		text-align: right;
		height: 40px;
		line-height: 40px;
		color: $font-color-gray;
		font-size: $font-size-small;
	}
	.van-icon-arrow {
		font-size: $font-size-small;
	}
	.class_tree_items_wrap {
		padding: 10px 20px;
		margin-right: -3%;
		margin-top: 70px;
		text-align: center;
		> div {
			float: left;
			padding-right: 3%;
			box-sizing: border-box;
			width: 33.333%;
			margin-bottom: 20px;
		}
		img {
			max-width: 100%;
		}

		.class_tree_item_img {
			display: inline-block;
			max-width: 100%;
			width: 70px;
			height: 70px;
		}
		.class_tree_item_name {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}
</style>
