const axios = require("axios");

class StatensVegvesenVehicle {
	constructor({ vin, regNr }) {
		this.vin = vin;
		this.regNr = regNr;
		this.type = "";
		this.defineType();
	}

	defineType() {
		if (this.vin && !this.regNr) {
			this.type = "vin";
		} else {
			this.type = "regNr";
		}
	}

	async getData() {
		const urlType =
			this.type == "vin"
				? "understellsnummeroppslag"
				: "kjennemerkeoppslag";
		const url = `https://kjoretoyoppslag.atlas.vegvesen.no/ws/no/vegvesen/kjoretoy/kjoretoyoppslag/v1/${urlType}/kjoretoy/${
			this[this.type]
		}`;

		try {
			const response = await axios.get(url);
			const data = response.data;

			return {
				status: 200,
				regNr: data.kjennemerke,
				vin: data.understellsnummer,
				prevEU: data.periodiskKjoretoykontroll.sistKontrollert,
				nextEU: data.periodiskKjoretoykontroll.nesteKontroll,
				meta: {
					make: data.tekniskKjoretoy.merke,
					model: data.tekniskKjoretoy.handelsbetegnelse,
					gearbox: data.tekniskKjoretoy.girkasse,
					colorCode: data.tekniskKjoretoy.karosseri.fargekode,
					color: data.tekniskKjoretoy.karosseri.farge,
				},
				data: data,
			};
		} catch (e) {
			return {
				status: e.response.data.status,
				message: e.response.data.melding,
			};
		}
	}
}

module.exports = StatensVegvesenVehicle;
