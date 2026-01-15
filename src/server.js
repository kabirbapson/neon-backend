import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoutes from "./routes/transactionsRoutes.js";
import job from "./config/cron.js";

dotenv.config();
// if (process.env.NODE_ENV === "production") job.start();
// job.start();
const app = express();
const PORT = process.env.PORT || 5001;
app.use(rateLimiter);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK!" });
  console.log("Server health: OK");
});

app.use("/api/transactions", transactionRoutes);

initDB().then(() => {
  app.listen(5001, () => {
    console.log("Server started at port:", PORT);
  });
});
