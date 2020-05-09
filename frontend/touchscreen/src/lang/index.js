import Vue from 'vue'
import VueI18n from 'vue-i18n'
import {Locale} from 'vant'
import enLocale from './en'
import frLocale from './fr'
import deLocale from './de'
import { getLocalStorage } from '@/utils/local-storage';

Vue.use(VueI18n)

const messages = {
	en: {
		...enLocale,
	},
	de: {
		...deLocale,
	},
	fr: {
		...frLocale,
	},

}

function vantLocales (lang) {
	switch (lang) {
		case 'en':
			Locale.use(lang, enLocale);
			break;
		case 'de':
			Locale.use(lang, deLocale);
			break;
		case 'fr':
			Locale.use(lang, frLocale);
			break;
	}
}

export function getLanguage() {
	const { language } = getLocalStorage('language');
	if (language) return language
	return 'en'
}
const i18n = new VueI18n({
	// set locale
	// options: en | zh | es
	locale: getLanguage(),
	// set locale messages
	messages
})

export {i18n, vantLocales}
