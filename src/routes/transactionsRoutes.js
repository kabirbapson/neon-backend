import express from 'express'
import { sql } from '../config/db.js';
import { createTransactions, deleteTransactionById, getSummaryByID, getTransactions, getTransactionsByID } from '../controllers/transactionsController.js';

const router = express.Router()

router.get("/", getTransactions);

router.get("/:user_id", getTransactionsByID);

router.post("", createTransactions);

router.delete("/:id", deleteTransactionById);

router.get("/summary/:user_id", getSummaryByID);


export default router;