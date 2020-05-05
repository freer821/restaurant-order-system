const getters = {
	token: state => state.user.token,
	avatar: state => state.user.avatar,
	name: state => state.user.username,
	selected_goods: state => state.cart.selected_goods,
	num_selected_goods: state => state.cart.num_selected_goods,
	selected_goods_fee: state => state.cart.selected_goods_fee
}
export default getters
