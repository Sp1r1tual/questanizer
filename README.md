# Atypical Task Scheduler

**A gamified productivity organizer with RPG mechanics** – schedule quests (tasks), defeat bosses, gain experience, and level up your life.

---

## Screenshot

![Questanizer](https://res.cloudinary.com/dynnapuco/image/upload/v1767999303/%D0%97%D0%BD%D1%96%D0%BC%D0%BE%D0%BA_%D0%B5%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2026-01-10_005305_s0bbtu.png)

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

## License

Currently, this project does not include a formal license.
All rights are reserved by the author.

If you plan to use, modify, or distribute this project, please contact the author for permission.
