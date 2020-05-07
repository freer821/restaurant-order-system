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
			currency="€"
            @click="itemClick(item.id)"
          />

        </div>
      </div>
    </div>
    <van-sku
      v-model="showSku"
	  :sku="sku"
	  :properties="properties"
	  :hide-stock="true"
	  :goods="skuGoods"
      :goodsId="good.info.id"
	  :initial-sku="initialSku"
      close-on-click-overlay
      @buy-clicked="buyGoods"
      @add-cart="addCart"
    >
		<template #sku-header-price="props">
			<div class="van-sku__goods-price">
				<span class="van-sku__price-symbol">€</span>
				<span class="van-sku__price-num">{{ props.price }}</span>
			</div>
		</template>

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
			good: {
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
			properties:[],
			skuGoods: {
				// 商品标题
				title: '',
				// 默认商品 sku 缩略图
				picture: ''
			},
			initialSku:{
				selectedProp:{}
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
				price: parseInt(this.good.info.retailPrice), // 未选择规格时的价格
				stock_num: 0, // TODO 总库存
				collection_id: '', // 无规格商品skuId取collection_id，否则取所选sku组合对应的id
				none_sku: false, // 是否无规格商品
				hide_stock: true
			};
			this.sku = {
				tree,
				list,
				...skuInfo,
				messages: [
					{
						// 商品留言
						datetime: '0', // 留言类型为 time 时，是否含日期。'1' 表示包含
						multiple: '0', // 留言类型为 text 时，是否多行文本。'1' 表示多行
						name: 'Comment', // 留言名称
						type: 'text', // 留言类型，可选: id_no（身份证）, text, tel, date, time, email
						required: '0', // 是否必填 '1' 表示必填
						placeholder: 'if you have specification requirements, please let me know! ' // 可选值，占位文本
					}
				],
			};
			this.skuGoods = {
				title: this.good.info.name,
				picture: this.good.info.picUrl
			};
			this.properties = this.setProperties();
			this.setInitialSku();
		},
		setSkuList() {
			var sku_list = [];
			_.each(this.good.productList, v => {
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
		setProperties() {
			let properties_list = [];
			_.each(this.good.accessories, accessory => {
				let property_obj = {};
				let v = [];
				_.each(accessory.goods, (good) => {
					v.push({
						id: good.id,
						name: good.name,
						price: good.retailPrice*100
					})
				});

				property_obj.k_id = accessory.id;
				property_obj.k = accessory.name;

				if (accessory.name === 'Extra') {
					property_obj.is_multiple = true;
				} else {
					property_obj.is_multiple = false;
				}
				property_obj.v = v;
				properties_list.push(property_obj);
			});

			return properties_list;
		},
		setInitialSku() {
			let attributes = this.good.attribute;
			for (let i = 0; i < attributes.length; i++ ) {
				let attribute = attributes[i];
				this.properties.forEach(p => {
					if (p.k.toUpperCase() === attribute.attribute.toUpperCase() ) {
						p.v.forEach( v => {
							if (v.name.toUpperCase() === attribute.value.toUpperCase()) {
								this.initialSku.selectedProp[p.k_id]=[v.id]
							}
						});
					}
				})
			}
		},
		findSpecValueIdByName(name) {
			let id = 0;
			_.each(this.good.specificationList, specification => {
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
			_.each(this.good.specificationList, (v, k) => {
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
				this.good = res.data.data;
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
			let product = this.getProductByOne(data.selectedSkuComb.s1)
			let params = {
				goodsId: data.goodsId,
				number: data.selectedNum,
				name: this.good.info.name,
				picUrl: this.good.info.picUrl,
				price: (data.selectedSkuComb.price + data.selectedSkuComb.property_price)/100,
				...product,
				comment: data.messages.message_0? data.messages.message_0: ''
			};
			params.specifications = this.getSpecifications(data.selectedSkuComb.properties);

			this.$store.dispatch('cart/addCart', params);
			this.$toast({
				message: '已添加至购物车',
				duration: 1500
			});
			that.showSku = false;
			/**
			cartAdd(params).then(() => {
				this.cartInfo = this.cartInfo + data.selectedNum;
				this.$toast({
					message: '已添加至购物车',
					duration: 1500
				});
				that.showSku = false;
			});*/
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
				params.productId = this.getProductByOne(data.selectedSkuComb.s1);
			}
			/**
			cartFastAdd(params).then(res => {
				let cartId = res.data.data;
				setLocalStorage({ CartId: cartId });
				that.showSku = false;
				this.$router.push('/order/checkout');
			});*/
		},
		getProductByOne(s1) {
			let product = {};
			let s1_name;
			_.each(this.good.specificationList, specification => {
				_.each(specification.valueList, specValue => {
					if (specValue.id === s1) {
						s1_name = specValue.value;
						return;
					}
				});
			});

			_.each(this.good.productList, v => {
				let result = _.without(v.specifications, s1_name);
				if (result.length === 0) {
					product = {
						product_id: v.id,
						product_ame:s1_name,
						product_url: v.url
					};
				}
			});
			return product;
		},
		getSpecifications(properties) {
			let specifications = [];
			if (properties && properties.length > 0) {
				_.each(properties, property => {
					_.each(property.v, v => {
						specifications.push(v.name);
					});
				});

			}
			return specifications;

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
