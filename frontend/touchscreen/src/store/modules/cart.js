import {calcCartGoodId } from '@/utils/cart'

const state = {
	selected_goods: {},
	num_selected_goods: 0,
	selected_goods_fee: 0
}

const mutations = {
	ADD_GOOD_CART: (state, {cart_id, good}) => {
		if (cart_id in state.selected_goods) {
			state.selected_goods[cart_id].num += 1;
		} else {
			state.selected_goods[cart_id] = {
				good: good,
				num: 1
			};
		}
		console.log(state.selected_goods);

	},
	REMOVE_GOODS_FROM_CART: (state, cart_id) => {
		if (cart_id in state.selected_goods) {
			delete state.selected_goods.cart_id;
		}
	},
	CHANGE_NUM_GOODS_IN_CART: (state, {cart_id, num}) => {
		if (cart_id in state.selected_goods && num > 0) {
			state.selected_goods.cart_id.num = num;
		}
	},
	CLEAR_CART: (state) => {
		state.selected_goods = {};
		state.num_selected_goods = 0;
		state.selected_goods_fee = 0;
	},
	CALC_CART: (state) => {
		let num_total = 0;
		let fee_total = 0;
		for (let key in state.selected_goods) {
			num_total += state.selected_goods[key].num;
			fee_total += state.selected_goods[key].num * state.selected_goods[key].good.price
		}
		state.num_selected_goods = num_total;
		state.selected_goods_fee = fee_total;
		console.log(state.num_selected_goods)
	}
}

const actions = {
	addCart({commit}, cart_good) {
		commit('ADD_GOOD_CART', {cart_id:calcCartGoodId(cart_good), good:cart_good});
		commit('CALC_CART');
	},
	removeFromCart({commit}, good) {
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
