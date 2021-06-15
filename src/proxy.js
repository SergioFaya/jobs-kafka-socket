
const app = require('express')();
const axios = require('axios');

const PORT_PROXY = process.env.PORT_PROXY;
const PROCESSOR_HOST = process.env.PROCESSOR_HOST;

app.get('/', async function (_req, res) {
	axios
		.get(PROCESSOR_HOST)
		.then(function (response) {
			console.log(response)
			res.send(response.data);
		})
		.catch(function (error) {
			console.log(error)
			res.send(error);
		});
});

app.listen(PORT_PROXY, '0.0.0.0', () => {
	console.log('proxy listening on port ', PORT_PROXY)
})