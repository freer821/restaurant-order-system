import {calcCartGoodId } from '@/utils/cart'

const state = {
	cart_goods: {},
	num_cart_goods: 0,
	fee_cart_goods: 0
}

const mutations = {
	ADD_GOOD_CART: (state, {cart_id, good}) => {
		if (cart_id in state.cart_goods) {
			state.cart_goods[cart_id].number += good.number;
		} else {
			state.cart_goods[cart_id] = {
				id: cart_id,
				...good,
			};
		}
		console.log(state.cart_goods);

	},
	REMOVE_GOODS_FROM_CART: (state, cart_id) => {
		if (cart_id in state.cart_goods) {
			delete state.cart_goods[cart_id];
		}
	},
	CHANGE_NUM_GOODS_IN_CART: (state, {cart_id, num}) => {
		if (cart_id in state.cart_goods && num > 0) {
			state.cart_goods[cart_id].number = num;
		}
	},
	CLEAR_CART: (state) => {
		state.cart_goods = {};
		state.num_cart_goods = 0;
		state.fee_cart_goods = 0;
	},
	CALC_CART: (state) => {
		let num_total = 0;
		let fee_total = 0;
		for (let key in state.cart_goods) {
			num_total += state.cart_goods[key].number;
			fee_total += state.cart_goods[key].number * state.cart_goods[key].price
		}
		state.num_cart_goods = num_total;
		state.fee_cart_goods = fee_total;
	}
}

const actions = {
	addCart({commit}, cart_good) {
		commit('ADD_GOOD_CART', {cart_id:calcCartGoodId(cart_good), good:cart_good});
		commit('CALC_CART');
	},
	changeGoodsNumInCart({commit}, {cart_id, num}) {
		commit('CHANGE_NUM_GOODS_IN_CART', {cart_id, num});
		commit('CALC_CART');
	},
	removeGoodFromCart({commit}, cart_id) {
		commit('REMOVE_GOODS_FROM_CART', cart_id);
		commit('CALC_CART');
	},
	clearCart({commit}) {
		commit('CLEAR_CART');
	}

}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
