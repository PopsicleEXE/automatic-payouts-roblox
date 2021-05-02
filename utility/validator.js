const { check, validationResult } = require('express-validator')

function Validate(req, res, next) { // Validate using express-validator when type's of data are finished checking
	const errors = validationResult(req)
	if (errors.isEmpty()) {
		return next()
	}
	const extractedErrors = []
	errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

	return res.status(422).json({ // The request was well formed but the data wasn't what was expected. We reject the request.
		errors: extractedErrors,
	})
}

function Payout() {
	return [
		check('Group')
			.custom((value, { req, loc, path }) => {
				if (typeof req.body.Group === "number") { return value; } else { throw new Error(`Parameter 'Group' must be an integer, not type '${typeof (value)}'`)}
			}),
		check('Target')
			.custom((value, { req, loc, path }) => {
				if (typeof req.body.Target === "number") { return value; } else { throw new Error(`Parameter 'Target' must be an integer, not type '${typeof (value)}'`)}
			}),
		check('Robux')
			.custom((value, { req, loc, path }) => {
				if (typeof req.body.Robux === "number") { return value; } else { throw new Error(`Parameter 'Robux' must be an integer, not type '${typeof (value)}'`)}
			})
	]
}

// Export

module.exports = {
	Payout,
	Validate,
}
