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
			code: 20,
			message: "You have reached your quota for today. " +
							"Please come back tomorrow or login with Facebook to enjoy no restrictions."
		},
	FILE_TOO_BIG:
		{
			code: 21,
			message: "The file you are trying to upload is too big"
		},
	REMOVE_ERROR:
		{
			code: 100,
			message: "An error occured when deleting your upload."
		},
	GENERAL_ERROR:
		{
			code: 0,
			message: "Something went wrong. Please try again later."
		}
}