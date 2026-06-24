import express from 'express';
import cors  from 'cors';
import authRoutes from './routes/auth.route.js';
import apiRoutes from "./routes/api.route.js";
import proxyRoutes from "./routes/proxy.route.js";
const app = express();

app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/auth',authRoutes);
app.use('/api/apis/',apiRoutes);
app.use('/proxy', proxyRoutes);
app.get('/',(req,res)=>{
    res.send("API Gateway Running in backend");
})

export default app;