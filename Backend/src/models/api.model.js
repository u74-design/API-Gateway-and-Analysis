import mongoose from "mongoose";

const ApiSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        originalUrl: {
            type: String,
            required: true,
            trim: true
        },

        rateLimit:{
            type: Number,
            required: true
        },

         window: {
            type: String,
            default: "1m"
        },

        proxyId: {
            type: String,
            required: true,
            unique: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps : true
    }
)

const Api = mongoose.model('Api',ApiSchema);

export default Api;