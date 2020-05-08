<template>
	<div class="tab-cart">
		<div class="card-goods">
			<div
				v-for="(item, i) in goods"
				:key="i"
				class="card-goods__item"
			>
				<van-card
					:title="item.name"
					:price="item.price"
					:thumb="item.picUrl"
					currency="€"
				>
					<div slot="desc">
						{{item.product_ame}}
						<div class="van-card__desc">
							<van-tag
								plain
								style="margin-right:6px;"
								v-for="(spec, index) in item.specifications"
								:key="index"
							>
								{{spec}}
							</van-tag>
						</div>
						{{item.comment}}
					</div>
					<div
						slot="footer"
					>
						<van-stepper
							v-model="item.number"
							@change="stepperEvent(item,arguments)"
							disableInput
						/>
					</div>
				</van-card>

				<div
					class="cart_delete"
					@click="deleteCart(item)"
				>Del
				</div>
			</div>
		</div>

		<is-empty v-if="!goods.length">No Orders~</is-empty>

		<van-submit-bar
			style="bottom: 50px"
			:price="totalPrice"
			:disabled="!isSubmit"
			buttonText="Pay"
			currency="€"
			@submit="cartSubmit"
		>
		</van-submit-bar>
	</div>
</template>

<script>
	import {Checkbox, CheckboxGroup, Card, SubmitBar, Stepper, Tag} from 'vant';
	import isEmpty from '@/components/is-empty/';

	export default {
		computed: {
			goods() {
				return this.$store.getters.cart_goods;
			},
			totalPrice() {
				return this.$store.getters.fee_cart_goods * 100;
			},
			isSubmit() {
				return this.$store.getters.num_cart_goods > 0;
			}
		},

		methods: {
			stepperEvent(item, arg) {
				this.$store.dispatch('cart/changeGoodsNumInCart', {cart_id: item.id, num: arg[0]});
			},
			cartSubmit() {
				this.$router.push('/order/payment');
			},
			deleteCart(item) {
				this.$dialog
					.confirm({message: '确定删除所选商品吗', cancelButtonText: '再想想'})
					.then(() => {
						this.$store.dispatch('cart/removeGoodFromCart', item.id);
					});
			}
		},

		components: {
			[Card.name]: Card,
			[Tag.name]: Tag,
			[Stepper.name]: Stepper,
			[isEmpty.name]: isEmpty,
			[Checkbox.name]: Checkbox,
			[SubmitBar.name]: SubmitBar,
			[CheckboxGroup.name]: CheckboxGroup
		}
	};
</script>


<style lang="scss" scoped>
	@import '../../assets/scss/mixin';

	.tab-cart {
		padding-bottom: 50px;
		box-sizing: border-box;
	}

	.editor_head {
		@include one-border;
		text-align: right;
		padding: 10px;
		font-size: $font-size-normal;
		background-color: #fff;
	}

	.card-goods {
		background-color: $bg-color;
		overflow: auto;
		.card-goods__item {
			display: flex;
			align-items: center;
			margin-bottom: 10px;
			background-color: #fff;
		}

		.cart_delete {
			line-height: 100px;
			padding: 0 10px;
			color: #fff;
			background-color: $red;
		}

		.card-goods__footer {
			font-size: $font-size-normal;
			color: $font-color-gray;
		}
	}

	.clear_invalid {
		width: 120px;
		color: $font-color-gray;
		border: 1px solid $font-color-gray;
		margin: 0 auto;
		text-align: center;
		padding: 5px 3px;
		margin-top: 20px;
		border-radius: 3px;
	}
</style>
