module.exports = {
	NOT_LOGGED:
		{
			code: 1,
			message: "You are not logged in to Facebook."
		},
	NOT_LOGGED_AS_ADMIN:
		{
			code: 10,
			message: "You are not logged as an admin."
		},
	QUOTA_REACHED:
		{
			code: 10,
			message: "You have reached your quota for today. " +
							"Please come back tomorrow or login with Facebook to enjoy no restrictions."
		},
	GENERAL_ERROR:
		{
			code: 0,
			message: "Something went wrong. Please try again later."
		}
}