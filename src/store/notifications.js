const state = {
	default: {
		sec: 3000,
	},
	all: [],
};

const mutations = {
	add(state, { type, text }) {
		state.all.push({ type, text });
	},
	remove(state, notification) {
		state.all.splice(state.all.indexOf(notification), 1);
	}
};

const actions = {
	add({ commit }, { type, text, sec, forever }) {
		const notification = {
			type: type,
			text: text
		}
		if (sec == undefined) sec = Number(state.default.sec);

		commit('add', notification);

		if (typeof forever == 'undefined') {
			setTimeout(() => {
				commit('remove', notification);
			}, sec);
		}
	},
};

const getters = {
	get(state) {
		return state.all;
	},
};

export default {
	state,
	mutations,
	actions,
	getters,
};