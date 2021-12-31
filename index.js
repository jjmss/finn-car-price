require('dotenv').config();
const express = require('express');
const app = express();
const FinnLookup = require('./lib/lookup');
const requiredParameters = require('./lib/middleware');
const StatensVegvesenVehicle = require('./lib/vegvesen');

app.get('/finn/lookup', requiredParameters(['regNr', 'milage']), async (req, res) => {
	console.log(Object.entries(req.query));
	const lookup = new FinnLookup({
		regNr: req.query.regNr,
		milage: req.query.milage,
	});
	const results = await lookup.getResults();

	res.json(results);
	// }
});

app.get('/vegvesen/reg', async (req, res) => {
	const vehicle = new StatensVegvesenVehicle({
		vin: req.query.vin,
	});

	const results = await vehicle.getData();
	res.json(results);
});

app.listen(process.env.port, () => {
	console.log(`🚀 App started on http://localhost:${process.env.port}`);
});
