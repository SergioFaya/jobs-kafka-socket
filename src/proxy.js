
const app = require('express')();
const axios = require('axios');

const PORT_PROXY = process.env.PORT_PROXY;
const PROCESSOR_HOST = process.env.PROCESSOR_HOST;


app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', async function (_req, res) {
	axios
		.get(PROCESSOR_HOST)
		.then(function (response) {
			res.send(response.data);
		})
		.catch(function (error) {
			res.send(error);
		});
});

app.get('/tags/:name', async function (req, res) {
	const tagname = req.params.name;
	axios
		.get(PROCESSOR_HOST)
		.then(function (response) {
			const jobs = response.data;
			const filtered = jobs.filter(job => job.tags.includes(tagname));
			res.send(filtered);
		})
		.catch(function (error) {
			res.send(error);
		});
});

app.get('/content/:value', async function (req, res) {
	const value = req.params.value.toUpperCase();
	axios
		.get(PROCESSOR_HOST)
		.then(function (response) {
			const jobs = response.data;
			const filtered = jobs.filter(job =>
				job.description.toUpperCase().includes(value)
				|| job.company.toUpperCase().includes(value)
				|| job.title.toUpperCase().includes(value)
				|| job.location.country.toUpperCase().includes(value)
				|| job.location.city.toUpperCase().includes(value)
			);
			res.send(filtered);
		})
		.catch(function (error) {
			res.send(error);
		});
});

app.get('/salary/:amount', async function (req, res) {
	const amount = parseInt(req.params.amount);

	axios
		.get(PROCESSOR_HOST)
		.then(function (response) {
			const jobs = response.data;
			const filtered = jobs.filter(job => job.has_salary && amount > job.salary.low);
			res.send(filtered);
		})
		.catch(function (error) {
			res.send(error);
		});
});

app.get('/charts/bar', async function (req, res) {
	axios
		.get(PROCESSOR_HOST)
		.then(function (response) {
			const jobs = response.data;
			const tags = jobs
				.flatMap(job => job.tags)
			const groupedObject = groupBy(tags)
			const result = Object.entries(groupedObject).map(([key, value]) => {
				return { tag: key, count: value.length }
			})
			res.send(result);
		})
		.catch(function (error) {
			res.send(error);
		});
});

var groupBy = function (xs, key) {
	return xs.reduce(function (rv, x) {
		(rv[x] = rv[x] || []).push(x);
		return rv;
	}, {});
};
app.listen(PORT_PROXY, '0.0.0.0', () => {
	console.log('proxy listening on port ', PORT_PROXY)
})