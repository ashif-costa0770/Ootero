import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import storeRoutes from "./routes/store.routes.js";
import syncRoutes from "./routes/sync.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        credentials: true,
    }
));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to Ootero API",
    });
  });

app.use("/api/auth", authRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/product", productRoutes);
export default app;