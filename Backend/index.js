import dotenv from "dotenv";

dotenv.config();
const { default: app } = await import('./src/app.js');
const { default: connectDB } = await import('./src/config/db.js');
const PORT = process.env.PORT || 5000;


connectDB();
app.listen(PORT,()=>{
    console.log(`Sever running on port ${PORT}`);
});


