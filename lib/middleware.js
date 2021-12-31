const requireParams = (params) => (req, res, next) => {
	const reqParamList = Object.keys(req.query);
	const missingRequiredParams = params.filter((param) => {
		return !reqParamList.includes(param) ? true : false;
	});

	if (missingRequiredParams.length > 0) {
		return res.status(400).json({
			code: 1,
			message: `The following parameters are required for this route, but is not included: ${missingRequiredParams.join(
				", "
			)}`,
		});
	}

	next();
};

const verifyRegNr =
	(parameter = "regNr", stopOnError) =>
	(req, res, next) => {
		const regexReg = /^(?<REG>[A-Za-z]{2}[0-9]{5})$/;
		const match = req.query[parameter].match(regexReg);
		if (stopOnError && !match) {
			res.status(400).json({
				code: 3,
				message: `${req.query[parameter]} is not a valid regNr, it should look like AA12345`,
			});
		}

		if (match) {
			req.regNr = match.groups.REG;
		} else {
			req.vin = req.query[parameter];
		}

		next();
	};

module.exports.requiredParameters = requireParams;
module.exports.verifyRegNr = verifyRegNr;
