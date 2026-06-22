import app from './src/app.js';
import connectDB from './src/config/db.js';
const PORT = process.env.PORT || 5000;
import dotenv from "dotenv";

dotenv.config();

connectDB();
app.listen(PORT,()=>{
    console.log(`Sever running on port ${PORT}`);
});