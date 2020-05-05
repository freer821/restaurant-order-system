import { authLoginByAccount } from '@/api/api';

import {
	getToken,
	removeToken,
	setToken
} from '@/utils/auth'
import router from '@/router';
import {Toast} from "vant";

const state = {
	token: getToken(),
	username: '',
	avatar: ''
}

const mutations = {
	SET_TOKEN: (state, token) => {
		state.token = token
	},
	SET_USER_NAME: (state, username) => {
		state.username = username
	},
	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar
	}
}

const actions = {
	// user login
	login({commit}, loginData) {
		return new Promise((resolve, reject) => {
			authLoginByAccount(loginData).then(res => {
				this.userInfo = res.data.data.userInfo;
				setToken(res.data.data.token)
				commit('SET_USER_NAME', this.userInfo.nickName)
				resolve(this.userInfo);
			}).catch(error => {
				reject(error);
			});
		})
	}
}


export default {
	namespaced: true,
	state,
	mutations,
	actions
}

