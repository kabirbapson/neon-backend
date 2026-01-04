import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoutes from "./routes/transactionsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
app.use(rateLimiter);
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Working now");
});

app.use("/api/transactions", transactionRoutes);

initDB().then(() => {
  app.listen(5001, () => {
    console.log("Server started at port:", PORT);
  });
});
