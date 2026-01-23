import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"))
app.use(cookieParser())

import userRoutes from "./routes/user.route.js"
import inventoryRoutes from "./routes/inventory.route.js"
import mechanicRoutes from "./routes/mechanic.route.js"

app.use("/api/v1/users",userRoutes)
app.use("/api/v1/inventory",inventoryRoutes)
app.use("/api/v1/mechanic",mechanicRoutes)

export {app};