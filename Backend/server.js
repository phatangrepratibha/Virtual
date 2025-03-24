import express from "express";
import connectDb from "./utils/db.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error-middleware.js";
import contactrouter from "./router/contact-router.js";
import fashionrouter from "./router/fashion-router.js";
import buyrouter from "./router/buy-router.js";
import authRouter from "./router/user-router.js";

dotenv.config();
const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
const PORT = 3000;
app.use(express.json());

app.use("/auth", authRouter);

app.use(contactrouter);
app.use(fashionrouter);
app.use(buyrouter);
app.use(errorMiddleware);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
});
