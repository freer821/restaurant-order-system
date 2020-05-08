<template>
  <div class="payment">
    <div class="time_down payment_group">
      Only Credit Card accepted! Please finish the Payment
      <span class="red">in 30 minutes</span>
      ，Otherwise this Order will be canceled!
    </div>

    <van-cell-group class="payment_group">
      <van-cell title="Total:">
        <span class="red">{{order.actualPrice *100 | euro}}</span>
      </van-cell>
		<van-field
			v-model="order.message"
			placeholder="Comment"
			label="Comment"
		>
			<template slot="icon">{{order.message.length}}/50</template>
		</van-field>
    </van-cell-group>

    <div class="pay_way_group">
      <div class="pay_way_title">Eat Way</div>
      <van-radio-group v-model="order.eatway">
        <van-cell-group>
          <van-cell title="Eat in">
            <van-radio name="eatin" />
          </van-cell>
          <van-cell title="Take Away">
            <van-radio name="takeaway" />
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
import { Radio, RadioGroup, Dialog, Field } from 'vant';
import { orderDetail, orderShoppay } from '@/api/api';
import _ from 'lodash';
import axios from 'axios';
export default {
	name: 'payment',

	data() {
		return {
			order:{
				eatway: 'eatin',
				actualPrice: this.$store.getters.fee_cart_goods,
				message:'',
				goods: Object.values(this.$store.getters.cart_goods)
			}
		};
	},
	methods: {
		pay() {
			Dialog.confirm({
				message: 'thank you for your visit!'
			})
				.then(() => {
					console.log(this.order);
					this.$store.dispatch('cart/clearCart')
					this.$router.push('/');
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
		print(status) {
			let orderdata = {}
			orderdata.orderNo= this.order.orderInfo.orderSn;
			orderdata.total= this.order.orderInfo.actualPrice;
			orderdata.status= status;
			orderdata.orderTime= this.order.orderInfo.addTime;
			orderdata.items = [];
			_.each(orderdata.orderGoods, (orderGood) => {
				let description = orderGood.specifications.join()
				orderdata.items.push({
					title: orderGood.goodsName,
					description: description
				})
			});

			axios.post('http://127.0.0.1:9031/printer', orderdata).then(response => {
				console.log(response);
			}).catch(err =>{
				console.log(err)
			})
		}
	},

	components: {
		[Radio.name]: Radio,
		[RadioGroup.name]: RadioGroup,
		[Dialog.name]: Dialog,
		[Field.name]: Field
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
