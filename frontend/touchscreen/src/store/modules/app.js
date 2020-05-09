import { setLocalStorage } from '@/utils/local-storage';
import { getLanguage, vantLocales } from '@/lang/index'

const state = {
	language: getLanguage()
}

const mutations = {
	SET_LANGUAGE: (state, language) => {
		state.language = language
		setLocalStorage({language:language})
		vantLocales(language);
	}
}

const actions = {
	setLanguage({ commit }, language) {
		commit('SET_LANGUAGE', language)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
