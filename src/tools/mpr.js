import axios from 'axios'

console.log(import.meta.env.VITE_API_CLIENT, import.meta.env.API_CLIENT, import.meta.env.API_SECRET)

function createRequest(config) {
	let { method, data, url, query, headers } = config;
	if (method == undefined) method = 'get';
	let API_SERVER = 'https://robot.teslalasers.com/webhook';
	if (import.meta.env.DEV) API_SERVER += '/test';
	url = API_SERVER + url;

	// headers[]

	return axios({
		method: method,
		url: url,
		data: data,
		headers: headers,
		query: query
	});
}

// const mpreq = createRequest();

export default createRequest