import readline from "node:readline/promises";
import Expences from "./model/expence.js";
import Income from "./model/income.js";
import mongoose from "mongoose";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

// ✅ MongoDB connect
await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// const expenseDB = [];
// const incomeDB = [];

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function callAgent() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const messages = [
    {
      role: "system",
      content: `You are Vasu, a personal finance assistant. Your task is to assist user with their expenses, balances and financial planning.
            You have access to following tools:
            1. getTotalExpense({from, to}): string // Get total expense for a time period.
            2. addExpense({name, amount}): string // Add new expense to the expense database.
            3. addIncome({name, amount}): string // Add new income to income database.
            4. getMoneyBalance(): string // Get remaining money balance from database.
             5. getExpenseByCategory({from, to}): string // Get category-wise expense report.
             6. getMonthlyExpenseReport({year}): string // Get monthly total expense for given year.

            current datetime: ${new Date()}`,
    },
  ];

  // this is for user prompt loop
  while (true) {
    const question = await rl.question("User: ");

    if (question === "bye") {
      break;
    }

    messages.push({
      role: "user",
      content: question,
    });

    // this is for agent
    while (true) {
      const completion = await groq.chat.completions.create({
        messages: messages,
        // model: "llama-3.3-70b-versatile",
        model: "openai/gpt-oss-20b",
        tools: [
          {
            type: "function",
            function: {
              name: "getTotalExpense",
              description: "Get total expense from date to date.",
              parameters: {
                type: "object",
                properties: {
                  from: {
                    type: "string",
                    description: "From date to get the expense.",
                  },
                  to: {
                    type: "string",
                    description: "To date to get the expense.",
                  },
                },
              },
            },
          },
          {
            type: "function",
            function: {
              name: "addExpense",
              description: "Add new expense entry to the expense database.",
              parameters: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the expense. e.g., Bought an iphone",
                  },
                  amount: {
                    type: "string",
                    description: "Amount of the expense.",
                  },
                },
              },
            },
          },
          {
            type: "function",
            function: {
              name: "addIncome",
              description: "Add new income entry to income database",
              parameters: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the income. e.g., Got salary",
                  },
                  amount: {
                    type: "string",
                    description: "Amount of the income.",
                  },
                },
              },
            },
          },
          {
            type: "function",
            function: {
              name: "getMoneyBalance",
              description: "Get remaining money balance from database.",
            },
          },
          {
            type: "function",
            function: {
              name: "getExpenseByCategory",
              description: "Get expense grouped by category",
              parameters: {
                type: "object",
                properties: {
                  from: { type: "string" },
                  to: { type: "string" },
                },
              },
            },
          },
          {
            type: "function",
            function: {
              name: "getMonthlyExpenseReport",
              description: "Get monthly expense report for year.",
              parameters: {
                type: "object",
                properties: {
                  year: { type: "string" },
                },
              },
            },
          },
        ],
      });

      // console.log(JSON.stringify(completion.choices[0], null, 2));
      messages.push(completion.choices[0].message);

      const toolCalls = completion.choices[0].message.tool_calls;
      if (!toolCalls) {
        console.log(`Assistant: ${completion.choices[0].message.content}`);
        break;
      }

      for (const tool of toolCalls) {
        const functionName = tool.function.name;
        // const functionArgs = tool.function.arguments;

        // let result = "";
        // if (functionName === "getTotalExpense") {
        //   result = getTotalExpense(JSON.parse(functionArgs));
        // } else if (functionName === "addExpense") {
        //   result = addExpense(JSON.parse(functionArgs));
        // } else if (functionName === "addIncome") {
        //   result = addIncome(JSON.parse(functionArgs));
        // } else if (functionName === "getMoneyBalance") {
        //   result = getMoneyBalance(JSON.parse(functionArgs));
        // }
        const functionArgs = JSON.parse(tool.function.arguments || "{}");

        let result = "";
        if (functionName === "getTotalExpense") {
          result = await getTotalExpense(functionArgs);
        } else if (functionName === "addExpense") {
          result = await addExpense(functionArgs);
        } else if (functionName === "addIncome") {
          result = await addIncome(functionArgs);
        } else if (functionName === "getMoneyBalance") {
          result = await getMoneyBalance();
        } else if (functionName === "getExpenseByCategory") {
          result = await getExpenseByCategory(functionArgs);
        } else if (functionName === "getMonthlyExpenseReport") {
          result = await getMonthlyExpenseReport(functionArgs);
        }

        messages.push({
          role: "tool",
          content: result,
          tool_call_id: tool.id,
        });
        // console.log(JSON.stringify(completion2.choices[0], null, 2));
      }

      // console.log('===============');
      // console.log('MESSAGES:', messages);
      // console.log('===============');
      //   console.log("DB: ", expenseDB);
    }
  }

  rl.close();
}
callAgent();

/**
 * Get total expense
 */

async function getTotalExpense({ from, to }) {
  // console.log('Calling getTotalExpense tool');

  // In reality -> we call db here...
  //   const expense = expenseDB.reduce((acc, item) => {
  //     return acc + item.amount;
  //   }, 0);
  //   return `${expense} INR`;
  const query = {};
  if (from && to) {
    query.createdAt = { $gte: new Date(from), $lte: new Date(to) };
  }
  const expenses = await Expences.find(query);
  const total = expenses.reduce((acc, e) => acc + e.amount, 0);
  return `${total} INR`;
}

async function addExpense({ name, amount }) {
  // console.log(`Adding ${amount} to expense db for ${name}`);
  //   expenseDB.push({ name, amount });
  await Expences.create({ name, amount: Number(amount) });
  return "Added to the database.";
}

async function addIncome({ name, amount }) {
  //   incomeDB.push({ name, amount });
  await Income.create({ name, amount: Number(amount) });

  return "Added to the income database.";
}

async function getMoneyBalance() {
  //   const totalIncome = incomeDB.reduce((acc, item) => acc + item.amount, 0);
  //   const totalExpense = expenseDB.reduce((acc, item) => acc + item.amount, 0);

  //   return `${totalIncome - totalExpense} INR`;
  const [incomeAgg] = await Income.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const [expenseAgg] = await Expences.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalIncome = incomeAgg?.total || 0;
  const totalExpense = expenseAgg?.total || 0;

  return `${totalIncome - totalExpense} INR`;
}

async function getExpenseByCategory({ from, to }) {
  const query = {};
  if (from && to)
    query.createdAt = { $gte: new Date(from), $lte: new Date(to) };

  const agg = await Expences.aggregate([
    { $match: query },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
    { $sort: { total: -1 } },
  ]);

  return JSON.stringify(agg, null, 2);
}

async function getMonthlyExpenseReport({ year }) {
  const start = new Date(`${year}-01-01`);
  const end = new Date(`${Number(year) + 1}-01-01`);

  const agg = await Expences.aggregate([
    { $match: { createdAt: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);

  return JSON.stringify(agg, null, 2);
}
console.log(await Expences.find());
console.log(await Income.find());
