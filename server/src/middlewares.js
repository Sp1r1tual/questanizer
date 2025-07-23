import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

const middlewares = (app) => {
    app.use(express.json());
    app.use(cookieParser());
    app.use(
        cors({
            origin: process.env.CLIENT_URL,
            credentials: true,
        })
    );
};

export default middlewares;
