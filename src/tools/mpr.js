import axios from 'axios'

function createRequest(config) {
	let { method, data, url, query } = config;
	if (method == undefined) method = 'get';
	let API_SERVER = 'https://robot.teslalasers.com/webhook';
	if (import.meta.env.DEV) API_SERVER += '/test';
	url = API_SERVER + url;
	console.log(url);

	return axios({
	  method: method,
	  url: url,
	  data: data,
		query: query
	});
}

// const mpreq = createRequest();

export default createRequest