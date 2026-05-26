import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products.js';
import returnRouter from './routes/return.js';
import memberRouter from './routes/member.js';
import cartsRouter from './routes/carts.js';
import kakaoRouter from './routes/kakao.js';
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.SERVER_PORT || 9000;
const app = express();

//미들웨어 -> 공통작업 정의
// app.use(cors());
app.use(
  cors({
    origin: "http://192.168.7.25:3000", // 프론트 주소 정확히 명시 (포트 포함)
    credentials: true, // withCredentials 대응
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());
app.use(express.json());

//라우팅 작업
app.use('/products', productsRouter);
app.use('/return', returnRouter);
app.use('/member', memberRouter);
app.use('/carts', cartsRouter);
app.use('/kakao', kakaoRouter);


app.listen(PORT, () => {
    console.log(`서버 실행 => ${PORT}`);    
});