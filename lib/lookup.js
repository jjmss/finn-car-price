require("dotenv").config();
const axios = require("axios");

class FinnLookup {
	constructor({ regNr, milage, sessionID = process.env.__flt }) {
		this.regNr = regNr;
		this.milage = milage;
		this.sessionID = sessionID;
	}

	async getResults() {
		try {
			const result = await axios.post(
				"https://www.finn.no/pristips/api/valuation/regnrLookup",
				{
					mileage: this.milage,
					regNr: this.regNr,
				},
				{
					headers: {
						Cookie: `__flt=${this.sessionID}`,
					},
				}
			);

			const data = result.data;
			return {
				priceMin: data.price[0],
				priceMax: data.price[1],
				priceAvg: (data.price[0] + data.price[1]) / 2,
				nettbilPriceMin: data.nettbilPrice[0],
				nettbilPriceMax: data.nettbilPrice[1],
				nettbilPriceAvg:
					(data.nettbilPrice[0] + data.nettbilPrice[1]) / 2,
				data: data,
			};
		} catch (err) {
			if (err.response.data.status == "incomplete") {
				return {
					code: 21,
					message:
						"incomplete details about the car. Needs manual review here: https://www.finn.no/pristips/full",
					link: "https://www.finn.no/pristips/full",
				};
			}
			// if (err.result.status == 401) {
			// 	console.log('error :)');
			// }
		}
	}
}

module.exports = FinnLookup;
