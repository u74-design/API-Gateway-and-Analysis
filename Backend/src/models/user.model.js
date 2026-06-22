import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            lowercase: true,
            trim: true,
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true,
            match: [
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Password must contain at least one letter, one number, one special character, and be at least 8 characters long"
            ]
        },
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User',UserSchema);
export default User;