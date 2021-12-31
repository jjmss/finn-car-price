const requireParams = (params) => (req, res, next) => {
	const reqParamList = Object.keys(req.query);
	const missingRequiredParams = params.filter((param) => {
		return !reqParamList.includes(param) ? true : false;
	});

	if (missingRequiredParams.length > 0)
		return res.status(400).json({
			code: 1,
			message: `The following parameters are required for this route, but is not included: ${missingRequiredParams.join(
				', '
			)}`,
		});

	next();
};

module.exports = requireParams;
