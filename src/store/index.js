import { createStore } from 'vuex'
import notifications from './notifications';

const store = createStore({
	modules: {
		notifications,
	},
})

export default store;

