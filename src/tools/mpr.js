import axios from 'axios'

function createRequest(config) {
	let { method, data, url, query, params, headers } = config;
	if (method == undefined) method = 'get';
	let API_SERVER = import.meta.env.VITE_API_SERVER;
	if (import.meta.env.DEV) API_SERVER += '/test';
	url = API_SERVER + url;

	if (headers == undefined) headers = {};
	if (data == undefined) data = {};
	if (query == undefined) query = {};
	if (params == undefined) params = {};

	if (method == 'get') {
		params['client-id'] = import.meta.env.VITE_API_CLIENT
		params['secret'] = import.meta.env.VITE_API_SECRET
	} else {
		data['client-id'] = import.meta.env.VITE_API_CLIENT
		data['secret'] = import.meta.env.VITE_API_SECRET
	}

	console.log(params);
	
	return axios({
		method: method,
		url: url,
		data: data,
		query: query,
		params: params,
	});
}

export default createRequest