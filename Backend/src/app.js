import express from 'express';
import cors  from 'cors';
import authRoutes from './routes/auth.route.js';
const app = express();

app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/auth',authRoutes);
app.get('/',(req,res)=>{
    res.send("API Gateway Running in backend");
})

export default app;