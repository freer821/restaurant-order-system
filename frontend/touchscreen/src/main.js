import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker'
import {i18n, vantLocales} from './lang' // internationalization
import store from '@/store'
import router from './router';
import 'vant/lib/icon/local.css';
import '@/assets/scss/global.scss';
import '@/assets/scss/iconfont/iconfont.css';

import VueCountdown from '@chenfengyuan/vue-countdown';

import filters from '@/filter';

Vue.component(VueCountdown.name, VueCountdown);
Vue.use(filters);

import {Lazyload, Icon, Cell, CellGroup, Loading, Locale, Button, Toast, Col, Row, Image, Sku, DropdownMenu, DropdownItem} from 'vant';

Vue.use(Icon);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Loading);
Vue.use(Button);
Vue.use(Toast);
Vue.use(Col);
Vue.use(Row);
Vue.use(Image);
Vue.use(Sku);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Locale);
Vue.use(Lazyload, {
	preLoad: 1.3,
	error: require('@/assets/images/goods_default.png'),
	loading: require('@/assets/images/goods_default.png'),
	attempt: 1,
	listenEvents: ['scroll'],
	lazyComponent: true
});

vantLocales(store.getters.language);

Vue.config.productionTip = false

new Vue({
	router,
	store,
	i18n,
	render: h => h(App),
}).$mount('#app')
