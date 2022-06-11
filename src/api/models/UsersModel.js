//make a user model

export default async function UsersModel(Mongoose) {
    const userSchema = new Mongoose.Schema({
        user_name: {
            type: String,
            required: true,
        },
        user_email: {
            type: String,
            required: true,
            unique: true,

        },
        user_password: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
            unique: true,

        },
        register_date: {
            type: Date,


        },
        last_login: {
            type: Date,


        },
        status: {
            type: String,
            required: true,

        }
    });

    return Mongoose.model("users", userSchema);

}