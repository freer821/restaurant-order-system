const getters = {
	language: state => state.app.language,
	token: state => state.user.token,
	avatar: state => state.user.avatar,
	name: state => state.user.username,
	cart_goods: state => state.cart.cart_goods,
	num_cart_goods: state => state.cart.num_cart_goods,
	fee_cart_goods: state => state.cart.fee_cart_goods
}
export default getters
