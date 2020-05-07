<template>
  <van-tabbar
    v-model="active"
    style="z-index: 1999"
  >
	  <van-tabbar-item icon="class-full" to="/" >Home</van-tabbar-item>
	  <van-tabbar-item icon="cart-full" to="/order" :badge="num_cart">Cart</van-tabbar-item>
  </van-tabbar>
</template>


<script>
import { Tabbar, TabbarItem } from 'vant';

export default {
	data() {
		return {
			active: 0,
			//num_cart: this.$store.getters.num_cart_goods
		};
	},
	computed: {
		num_cart () {
			return this.$store.getters.num_cart_goods;
		}
	},
	components: {
		[Tabbar.name]: Tabbar,
		[TabbarItem.name]: TabbarItem
	}
};
</script>
