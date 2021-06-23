
const app = require('express')();
const axios = require('axios');

const PORT_PROXY = process.env.PORT_PROXY;
const PROCESSOR_HOSTS = process.env.PROCESSOR_HOST.split(',');


app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

const getFromProcessors = async () => {
	console.log("hosts", PROCESSOR_HOSTS)

	const processor1Response = await axios.get(PROCESSOR_HOSTS[0]);
	const processor2Response = await axios.get(PROCESSOR_HOSTS[1]);

	return [...processor1Response.data, ...processor2Response.data];
}

app.get('/', async function (_req, res) {
	getFromProcessors()
		.then(function (response) {
			res.send(response);
		})
		.catch(function (error) {
			res.status(500).send('Get all failed. ' + error);
		});
});

app.get('/tags/:name', async function (req, res) {
	const tagname = req.params.name;
	getFromProcessors()
		.then(function (response) {
			const jobs = response;
			const filtered = jobs.filter(job => job.tags.includes(tagname));
			res.send(filtered);
		})
		.catch(function (error) {
			res.status(500).send('Get tags failed. ' + error);
		});
});

app.get('/content/:value', async function (req, res) {
	const value = req.params.value.toUpperCase();
	getFromProcessors()
		.then(function (response) {
			const jobs = response;
			const filtered = jobs.filter(job => {
				const isInDescription = job.description.toUpperCase().includes(value)
				const isInCompany = job.company.toUpperCase().includes(value)
				const isInTitle = job.title.toUpperCase().includes(value)
				return isInDescription || isInCompany || isInTitle
			}
			);
			res.send(filtered);
		})
		.catch(function (error) {
			res.status(500).send('Get content failed. ' + error);
		});
});

app.get('/salary/:amount', async function (req, res) {
	const amount = parseInt(req.params.amount);
	getFromProcessors()
		.then(function (response) {
			const jobs = response;
			const filtered = jobs.filter(job => job.has_salary && amount > job.salary.low);
			res.send(filtered);
		})
		.catch(function (error) {
			res.status(500).send('Get salary failed. ' + error);
		});
});

app.get('/charts/bar', async function (req, res) {
	getFromProcessors()
		.then(function (response) {
			const jobs = response;
			const tags = jobs
				.flatMap(job => job.tags)
			const groupedObject = groupBy(tags)
			const result = Object.entries(groupedObject).map(([key, value]) => {
				return { tag: key, count: value.length }
			})
			res.send(result);
		})
		.catch(function (error) {
			res.status(500).send('Get charts failed. ' + error);
		});
});

app.get('/tags', async function (req, res) {
	getFromProcessors()
		.then(function (response) {
			const jobs = response;
			const tags = jobs
				.flatMap(job => job.tags)
			const groupedObject = groupBy(tags)
			const result = Object.entries(groupedObject).map(([key, value]) => {
				return key
			})
			res.send(result);
		})
		.catch(function (error) {
			res.status(500).send('Get charts failed. ' + error);
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