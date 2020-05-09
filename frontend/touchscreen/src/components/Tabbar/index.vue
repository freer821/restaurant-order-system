<template>
	<div>
		<van-tabbar
			v-model="active"
			style="z-index: 1999"
		>
			<van-tabbar-item @click="showPopup">
				<span>{{lang}}</span>
				<template #icon="">
					<img :src="flag" />
				</template>
			</van-tabbar-item>
			<van-tabbar-item icon="class-full" to="/" >Home</van-tabbar-item>
			<van-tabbar-item icon="cart-full" to="/order" :badge="num_cart">Cart</van-tabbar-item>
		</van-tabbar>
		<van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
			<van-picker
			title="Language choose"
			show-toolbar
			:columns="columns"
			@confirm="onConfirm"
			@cancel="onCancel"
			/>
		</van-popup>
	</div>
</template>


<script>
import { Tabbar, TabbarItem, Popup, Picker } from 'vant';

export default {
	data() {
		return {
			active: 0,
			show: false,
			columns: ['en', 'de', 'fr'],
		};
	},
	computed: {
		lang() {
			switch (this.$store.getters.language) {
				case 'en':
					return "English";
				case 'de':
					return "Deutsch";
				case 'fr':
					return "French";
			}

			return "English";
		},
		num_cart () {
			return this.$store.getters.num_cart_goods;
		},
		flag() {
			switch (this.$store.getters.language) {
				case 'en':
					return require("@/assets/images/English.png");
				case 'de':
					return require("@/assets/images/German.png");
				case 'fr':
					return require("@/assets/images/French.png");
			}
			return require("@/assets/images/English.png");
		}
	},
	methods: {
		showPopup() {
			this.show = true;
		},
		onConfirm(value, index) {
			this.$i18n.locale = value
			this.$store.dispatch('app/setLanguage', value)
			console.log(value);
			this.show = false;
		},
		onCancel() {
			this.show = false;
		},

	},
	components: {
		[Tabbar.name]: Tabbar,
		[TabbarItem.name]: TabbarItem,
		[Popup.name]: Popup,
		[Picker.name]: Picker
	}
};
</script>
