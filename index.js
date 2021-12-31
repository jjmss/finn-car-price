require("dotenv").config();
const express = require("express");
const app = express();
const FinnLookup = require("./lib/lookup");
const { requiredParameters, verifyRegNr } = require("./lib/middleware");
const StatensVegvesenVehicle = require("./lib/vegvesen");

app.get(
	"/finn/lookup",
	requiredParameters(["regNr", "milage"]),
	verifyRegNr("regNr", true),
	async (req, res) => {
		console.log(Object.entries(req.query));
		const lookup = new FinnLookup({
			regNr: req.query.regNr,
			milage: req.query.milage,
		});
		const results = await lookup.getResults();

		res.json(results);
	}
);

app.get(
	"/vegvesen/reg",
	requiredParameters(["vehicle"]),
	verifyRegNr("vehicle"),
	async (req, res) => {
		const vehicle = new StatensVegvesenVehicle({
			vin: req.vin,
			regNr: req.regNr,
		});

		const results = await vehicle.getData();
		res.json(results);
	}
);

app.listen(process.env.port, () => {
	console.log(`🚀 App started on http://localhost:${process.env.port}`);
});
