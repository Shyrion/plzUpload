module.exports = {
	// General Error
	GENERAL_ERROR: {
		code: 0,
		message: "Something went wrong. Please try again later."
	},

	// Login Errors
	NOT_LOGGED: {
		code: 1,
		message: "You are not logged in to Facebook."
	},

	NOT_LOGGED_AS_ADMIN: {
		code: 10,
		message: "You are not logged as an admin."
	},

	// Upload Errors
	QUOTA_REACHED: {
		code: 20,
		message: "You have reached your quota for today. I'm full! " +
						"Please come back tomorrow or login with Facebook to enjoy no restrictions."
	},

	FILE_TOO_BIG: {
		code: 21,
		message: "The file you are trying to upload is too big for my mouth :("
	},

	CANNOT_GENERATE_CODE: {
		code: 22,
		message: "I was not able to generate a code for your file. " +
						"Please contact my master, he will tell you what to do !"
	},
	NO_MORE_CODES: {
		code: 23,
		message: "I was not able to find a code for your file. " +
						"Please contact my master, he will tell you what to do !"
	},

	REMOVE_ERROR: {
		code: 30,
		message: "An error occured when deleting your upload."
	}
}