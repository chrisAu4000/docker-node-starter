module.exports = {
	name: 'User',
	collection: 'users',
	schema: {
		name: {
			type: String,
			trim: true,
			required: [ true, 'Username is required.' ],
			minlength: [ 4, 'Username should be at least 4 characters long.' ],
			maxlength: [ 60, 'Username is to long.' ]
		},
		password: {
			type: String,
			trim: true,
			required: [ true, 'Password is required' ],
			minlength: [ 8, 'Password should be at least 8 characters long.' ],
			maxlength: [ 60, 'Password is to long' ],
		},
		email: {
			type: String,
			trim: true,
			unique: [ true, 'E-Mail already exists' ],
			dropDups: true,
			required: [ true, 'E-Mail is required' ],
			minlength: [ 5, 'E-Mail should be at least 5 characters long.' ],
			maxlength: [ 60, 'Password is to long' ],
		}
	}
}