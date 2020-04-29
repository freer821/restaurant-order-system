<template>
  <div class="payment">
    <div class="time_down payment_group">
      Please finish the Payment
      <span class="red">in 30 minutes</span>
      ，Otherwise this Order will be canceled!
    </div>

    <van-cell-group class="payment_group">
      <van-cell
        title="Order No.:"
        :value="order.orderInfo.orderSn"
      />
      <van-cell title="Total:">
        <span class="red">{{order.orderInfo.actualPrice *100 | euro}}</span>
      </van-cell>
    </van-cell-group>

    <div class="pay_way_group">
      <div class="pay_way_title">Payment</div>
      <van-radio-group v-model="payWay">
        <van-cell-group>
          <van-cell title="Credit Card">
            <van-radio name="credit" />
          </van-cell>
          <van-cell title="Cash">
            <van-radio name="cash" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>


	  <div class="pay_cancel_div">
		  <van-button
			  class="pay_submit"
			  @click="pay"
			  type="primary"
			  bottomAction
		  >Pay</van-button>
		  <van-button
			  class="cancel_submit"
			  @click="cancel"
			  type="danger"
			  bottomAction
		  >Canel</van-button>
	  </div>
  </div>
</template>

<script>
import { Radio, RadioGroup, Dialog } from 'vant';
import { orderDetail, orderShoppay } from '@/api/api';
import _ from 'lodash';
import { getLocalStorage } from '@/utils/local-storage';

export default {
	name: 'payment',

	data() {
		return {
			payWay: 'cash',
			order: {
				orderInfo: {},
				orderGoods: []
			},
			orderId: 0
		};
	},
	created() {
		if (_.has(this.$route.params, 'orderId')) {
			this.orderId = this.$route.params.orderId;
			this.getOrder(this.orderId);
		}
	},
	methods: {
		getOrder(orderId) {
			orderDetail({ orderId: orderId }).then(res => {
				this.order = res.data.data;
			});
		},
		pay() {
			Dialog.confirm({
				message:
					'You have chosen' + (this.payWay === 'cash' ? 'Cash Pay' : 'Credit Pay')
			})
				.then(() => {
					if (this.payWay === 'credit') {
						orderShoppay({ orderId: this.orderId })
							.then(res => {
								let data = res.data.data;
								console.log(data)
								Dialog.alert({
									title: 'success pay!',
									message: ''
								}).then(() => {
									this.$router.push('/');
								});
							})
							.catch(err => {
								Dialog.alert({ message: err });
								this.$router.replace({
									name: 'paymentStatus',
									params: {
										status: 'failed'
									}
								});
							});
					} else {
						Dialog.alert({
							title: 'Cash Pay, please take your note and go to cashier desk!',
							message: this.order
						}).then(() => {
							this.$router.push('/');
						});
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		cancel() {
			Dialog.confirm({
				title: 'Order Cancel!',
				message: 'after canceling this order, all of the Cart will be removed'
			}).then(() => {
				this.$router.push('/');
			});
		},
		onBridgeReady() {
			let that = this;
			let data = getLocalStorage('prepay_data');
			// eslint-disable-next-line no-undef
			WeixinJSBridge.invoke(
				'getBrandWCPayRequest',
				JSON.parse(data.prepay_data),
				function(res) {
					if (res.err_msg == 'get_brand_wcpay_request:ok') {
						that.$router.replace({
							name: 'paymentStatus',
							params: {
								status: 'success'
							}
						});
					} else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
						that.$router.replace({
							name: 'paymentStatus',
							params: {
								status: 'cancel'
							}
						});
					} else {
						that.$router.replace({
							name: 'paymentStatus',
							params: {
								status: 'failed'
							}
						});
					}
				}
			);
		}
	},

	components: {
		[Radio.name]: Radio,
		[RadioGroup.name]: RadioGroup,
		[Dialog.name]: Dialog
	}
};
</script>

<style lang="scss" scoped>
.payment_group {
	margin-bottom: 10px;
}

.time_down {
	background-color: #fffeec;
	padding: 10px 15px;
}

.pay_submit {
	width: 100%;
}

.cancel_submit {
	width: 100%;
}
.pay_cancel_div {
	position: fixed;
	bottom: 0;
	width: 100%;
}


.pay_way_group img {
	vertical-align: middle;
}

.pay_way_title {
	padding: 15px;
	background-color: #fff;
}
</style>
