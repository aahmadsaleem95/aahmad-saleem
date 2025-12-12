# Project Documentation

This project implements authentication, subscription-based access
control, and chat message handling using Node.js, Express, Prisma, and
JWT cookies. A Postman collection is also included for testing API
endpoints.

---

## 📌 Features

### **1. Authentication**

- Signup and login using email/password.
- Secure JWT-based cookie authentication (`session_token`).
- Custom Express middleware (`cookieAuthMiddleware`) validating JWT
  from cookies.
- Typed `req.validated` support using Express module augmentation.

### **2. Subscription Model**

- A user cannot chat unless they have at least one active
  subscription.
- Each subscription may have:
  - `maxMessages` (nullable → unlimited messages)
  - `usedMessages`
  - `startDate`, `endDate`
  - `isActive`

### **3. Free Tier Logic**

- If a user has _no subscription_, they cannot chat.
- If they have a subscription:
  - Unlimited plans bypass message counting.
  - Limited plans consume `usedMessages` per message.

### **4. Chat Flow**

When a user calls `askQuestion`:

1. Validate user.
2. Check if user has an active subscription.
3. If yes: - If limited → increment `usedMessages`. - If unlimited → allow without limits.
4. Save the message + answer in database.
5. Return the chat response.

---

## 📁 File: Postman Collection

A Postman collection is included in the repo under:

    AI_Chat_Backend.postman_collection.json

It includes: - Auth folder (Signup, Login) - Subscription folder (Create
subscription, Activate, Check remaining messages) - Chat folder (Ask
question, Fetch messages)

Ensure you import this file into Postman for smooth testing.

---

## 🛠 Required Environment Variables

Create a `.env` file:

    DATABASE_URL="your-prisma-db-url"
    JWT_SECRET="your-secret"
    JWT_EXPIRES_IN=7d
    COOKIE_SECURE=false
    MOCK_AI_DELAY_MS=1500
    FREE_MESSAGES_PER_MONTH=3
    PORT=4000

---

## ⚙️ Environment Setup

### **1. Install dependencies**

    npm install

### **2. Database setup**

    npm run prisma:generate
    npm run prisma:migrate

### **2. Start development server**

    npm run dev

---

## 🧪 Cookie Issue in Postman

If cookies work in `Auth` folder but not elsewhere: \### **Fix: Enable
cookie sharing across Postman requests** - Go to **Postman Settings** -
Enable **Send cookies automatically** - Ensure you're using the **same
domain** in every request - After login, open **Cookies** (right side)
and verify `session_token` appears under `localhost`

---

## 📝 Author

Aahmad Saleem

---
