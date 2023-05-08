import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter";
import corsOptions from "./config/corsOptions";
import verifyJWT from "./middlewares/verifyJWT";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/auth", authRouter);

app.get("/me", verifyJWT, (req, res) => {
  res.status(200).json(req.user);
});

app.get("/", (_, res) => {
  res.status(200).send({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
