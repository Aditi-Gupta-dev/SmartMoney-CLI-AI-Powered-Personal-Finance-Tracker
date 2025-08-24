# 💰 SmartMoney CLI – AI-Powered Personal Finance Tracker

A command-line personal finance assistant powered by Groq LLM and MongoDB. Track your expenses and income, calculate balance, and generate detailed financial reports using natural language prompts.

---

## 🧠 Features

- 🤖 **AI Assistant** – Interact with an LLM (Groq/OpenAI) that understands your finance-related questions.
- 💸 **Expense & Income Tracking** – Log your daily transactions effortlessly.
- 📊 **Reports & Analytics**  
  - Total expense in a date range  
  - Monthly expense breakdown  
  - Category-wise expense summary  
  - Real-time balance calculation
- 🗃️ **MongoDB Integration** – All data is stored in a NoSQL database using Mongoose.
- 🧪 Built with modular and testable architecture.

---

## 🚀 Demo

```bash
User: Add expense of 2000 for groceries
Assistant: Added to the database.

User: What is my balance?
Assistant: 4500 INR

User: Show category-wise report from July 1 to July 31
Assistant: [
  { "_id": "Groceries", "total": 5000 },
  { "_id": "Transport", "total": 1200 }
]
```
---
## 🚀🛠️ Tech Stack
- Node.js (ESM)
- MongoDB + Mongoose
- Groq LLM (Open Source Model)
- dotenv
- readline (CLI)
---
  ## 📦 Installation

- 1.**Clone the repository**
```bash
git clone https://github.com/your-username/smartmoney-cli.git
cd smartmoney-cli

```

- 2.**Install dependencies**
```bash
npm install
```
- 3.**Setup environment variables**
--Create a .env file:
```bash
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key

```

- 2.**Run the App**
```bash
node index.js
```
---

## **📂Project Structure**
```bash
.
├── model/
│   ├── expence.js        # MongoDB schema for expense tracking
│   └── income.js         # MongoDB schema for income tracking
├── index.js              # Main application logic
├── .env                  # Environment variables
└── README.md             # Project documentation

```
---
## **📈 Upcoming Features**
- Web-based dashboard (React.js)

- Authentication (JWT)

- Budget planning suggestions

- Expense limits and alerts
---
- ## **🙌 Contributing**
- Fork the repository.

Create a new branch (git checkout -b feature/feature-name).

Commit your changes (git commit -m 'Add some feature').

Push to the branch (git push origin feature/feature-name).

Open a pull request.
---
## **Author**
- Aditi Gupta
