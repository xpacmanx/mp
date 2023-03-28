import axios from 'axios'

function createRequest(config) {
	let { method, data, url, query, headers } = config;
	if (method == undefined) method = 'get';
	let API_SERVER = import.meta.env.VITE_API_SERVER;
	if (import.meta.env.DEV) API_SERVER += '/test';
	url = API_SERVER + url;

	if (headers == undefined) headers = {};
	if (data == undefined) data = {};
	if (query == undefined) query = {};
	
	// headers.MP_API_KEY = import.meta.env.VITE_API_SECRET;

	console.log(url, headers);
	return axios({
		method: method,
		url: url,
		data: data,
		headers: {
			'MPY': 'test'
		},
		query: query,
	});
}

export default createRequest