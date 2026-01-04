import { sql } from "../config/db.js";

export async function getTransactions(req, res) {
  try {
    const response = await sql`
    SELECT * FROM transactions
    `;
    res.status(200).json(response);
  } catch (error) {
    console.log("Error getting Txc", error);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
}

export async function getTransactionsByID(req, res) {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${user_id}
    `;
    // Check if the array is empty
    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for this user" });
    }
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error getting USERID", error);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
}

export async function createTransactions(req, res) {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || !amount || !category) {
      return res.status(400).json({ message: "All fields required" });
    }
    const transaction = await sql`
     INSERT INTO transactions(user_id,title,amount,category)
     VALUES (${user_id}, ${title}, ${amount}, ${category})
     RETURNING *
     `;

    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("ERROR CREATING TX", error);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
}

export async function deleteTransactionById(req, res) {
  const { id } = req.params;

  if (!user_id) {
      return res.status(400).json({ message: "Invalid user id" });
    }

  try {
    const result = await sql`
     DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;
    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction ID npt found" });
    }

    res.status(200).json({ message: "Transaction Deleted Successfully" });
  } catch (error) {
    console.log("ERROR DELETING TRANSACTION", error);
    res.status(400).json({ message: "invalid ID" });
  }
}

export async function getSummaryByID(req, res) {
  try {
    const { user_id } = req.params;
     if (!user_id) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const balanceResult = await sql`
     SELECT COALESCE(sum(amount), 0) as balance FROM transactions 
     WHERE user_id = ${user_id}
    `;
    const incomeResult = await sql`
     SELECT COALESCE(sum(amount), 0) as income FROM transactions 
     WHERE user_id = ${user_id} AND amount > 0
    `;
    const expenseResult = await sql`
     SELECT COALESCE(sum(amount), 0) as expenses FROM transactions
     WHERE user_id = ${user_id} AND amount < 0
    `;
    // if(balanceResult.length === 0){
    //   res.status(400).json({message:'Zero Balance'})
    // }

    res.status(200).json({
      balance: balanceResult[0],
      income: incomeResult[0],
      expenses: expenseResult[0],
    });
  } catch (error) {
    console.log("Error fetching summary", error);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
}
