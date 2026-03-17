# Atypical Task Scheduler

**A gamified productivity organizer with RPG mechanics** – schedule quests (tasks), defeat bosses, gain experience, and level up your life.

---

## Screenshot

![Questanizer](https://res.cloudinary.com/dynnapuco/image/upload/v1768000299/f6ef2add-42df-4537-8da4-540e42826f79.png)

---

## About the Project

This project was inspired by the concept of [Habitica](https://github.com/HabitRPG/habitica) – a popular productivity tool that turns everyday tasks into exciting quests and adventures. The author aimed to create their own version of this approach, combining RPG mechanics with daily task management.

This project is the author’s first personal project, serving as a kind of “field experiment” for practicing the full development cycle: from design and frontend to backend and database management. It provided an opportunity to dive deeper into technologies, refine client-server integration skills, and implement a personal vision of gamified productivity. As it is the first production-ready project, there may be some inefficiencies or optimization issues that could be improved in future iterations.

The project not only advanced the author technically but also allowed experimentation with game mechanics in a real environment, emphasizing the importance of motivation and personal progress for users.

---

## Features

- 📝 Task Management – organize your daily quests efficiently
- 🌟 Experience System – gain XP for every completed task
- 🐉 Boss Battles – face challenges triggered by accumulated progress
- 🔒 User Authentication – secure login, account activation via email, and password recovery
- 👩‍🦰 User Profiles – customize your name, bio and avatar to represent yourself
- 🤝 Friend System – connect with friends and compare progress
- 💬 Real-Time Chat – communicate with friends in real time
- 🛒 Shop System - add market items to cart and buy them
- 📦 Inventory - manage collected items
- 🌐 Localization – support for multiple languages to reach a wider audience

---

## Tech Stack

### Frontend

- JavaScript
- React
- Redux Toolkit
- React Router
- Axios
- Socket.IO Client
- React-i18next
- React Error Boundary
- React Toastify
- @dnd-kit/core

### Backend

- Node.js
- Express
- MongoDB (via Mongoose)
- Socket.IO
- jsonwebtoken
- express-rate-limit
- express-validator
- multer-storage-cloudinary

**Architecture**: Client ↔ (Main API - Mail API) ↔ Database

---

## Core Gameplay Concepts

- **Tasks as quests** – every task is a mission you choose to complete
- **Boss battles** – productivity triggers challenges
- **XP system** – gain experience, progress, and evolve
- **Login system** – track your personal progress securely
- **Friend system** – connect with friends and compare progress
- **Real-time chat** – communicate with friends instantly
- **Currency system** – earn in-game currency by completing tasks and challenges
- **Shop system** – spend your currency to buy items

---

## Future Plans

- **Complete UI overhaul** – modernize the interface, as the current design is quite basic
- **Improved task management** – enhance organization, prioritization, and usability of tasks
- **Expand shop inventory** – add a larger variety of items, boosters, and cosmetics
- **Project optimization** – improve performance and reduce potential inefficiencies
- **Detailed boss fights** – replace static images with interactive and dynamic encounters
- **Special events** – implement events between bosses and general project-wide special activities
- **Complete documentation** – provide full and detailed documentation for both the client and server, covering setup, features, API endpoints, and usage instructions

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sp1r1tual/questanizer.git
```

### Mail Service

This project requires a separate mail service. Clone and set it up first by following the instructions in its repository:

```bash
git clone https://github.com/Sp1r1tual/mail-api.git
```

### Server

### 2. Navigate to server directory

```bash
cd server
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```dotenv
PORT=5000
DB_URL=mongodb://localhost:27017/questanizer
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_RESET_SECRET=your_jwt_reset_secret
API_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000

# Cloudinary — create a free account at https://cloudinary.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mail Service URL (from the mail-api repository)
MAIL_SERVICE_URL=http://localhost:10000
```

### 5. Start the server

```bash
npm run dev
```

The server will be available at `http://localhost:5000`.

### Client

### 6. Create a new terminal and navigate to client directory

```bash
cd client
```

### 7. Install dependencies

```bash
npm install
```

### 8. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```dotenv
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 9. Start the client

```bash
npm run dev
```

The client will be available at `http://localhost:3000`.

---

## Docker Setup

### 1. Configure environment variables

Configure `.env` files for both server and client as described in the [Local Development Setup](#local-development-setup) section above, with one change — set `DB_URL` to use the Docker MongoDB service instead of localhost:

```dotenv
DB_URL=mongodb://mongo:27017/questanizer
```

### 2. Build and start all services

```bash
docker-compose up --build
```

This will start three containers: **MongoDB**, **server**, and **client**.

| Service | URL                   |
| ------- | --------------------- |
| Client  | http://localhost:3000 |
| Server  | http://localhost:5000 |
| MongoDB | localhost:27017       |

### 3. Stop all services

```bash
docker-compose down
```

To stop and remove volumes (clears the database):

```bash
docker-compose down -v
```

---

## License

Currently, this project does not include a formal license.
All rights are reserved by the author.

If you plan to use, modify, or distribute this project, please contact the author for permission.
