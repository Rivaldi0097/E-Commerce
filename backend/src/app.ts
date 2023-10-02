import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import productsRoutes from "./routes/product";
import reviewRoutes from "./routes/reviews";
import orderRoutes from "./routes/order";
import userRoutes from "./routes/user";
import cartRoutes from "./routes/cart";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require("cors");
const app = express();

app.use(cors());

app.options("*", cors);

app.use(morgan("dev"));

app.use(express.json());

app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000
  },
  rolling: true,
  store: MongoStore.create({
    mongoUrl: env.MONGO_CONNECTION_STRING
  })
}))

app.use("/api/products", productsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

//make sure this is after the app, because it is useing next() for the error handling
//make sure the Request is from the express package
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknow error happed";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(statusCode).json({ error: errorMessage });
  
});

export default app;
