import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import productsRoutes from "./routes/product";
import reviewRouter from "./routes/reviews";
import orderRoutes from './routes/order';
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/products", productsRoutes);
app.use("/api/reviews", reviewRouter);
app.use("/api/orders", orderRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

//make sure this is after the app, because it is useing next() for the error handling
//make sure the Request is from the express package
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res:Response, next:NextFunction)=>{
    console.error(error);
    let errorMessage = "An unknow error happed";
    let statusCode = 500;
    if(isHttpError(error)){
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage});
});

export default app;