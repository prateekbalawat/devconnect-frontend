# DevConnect Frontend

DevConnect is a social platform for developers to connect, share ideas, and grow their network. This is the frontend of the application, built with **React**, **TypeScript**, and **Tailwind CSS**, fully integrated with a Node.js + MongoDB backend.

---

## 🌐 Live App

🔗 [https://devconnect-frontend.vercel.app](https://devconnect-frontend-taupe.vercel.app/)

---

## 🚀 Features

### 📬 Create & Explore Posts

- Make posts with title and content
- Browse global feed or view posts from users you follow

### 💬 Engage via Comments & Replies

- Add, edit, and delete comments
- Reply to comments with full edit/delete functionality

### 👥 Social Connections

- Follow and unfollow other developers
- See follower/following counts
- View user profiles and their posts

---

## 🧰 Tech Stack

- **React** + **TypeScript**
- **Tailwind CSS** for UI
- **React Router** for client-side routing
- **JWT Authentication** via AuthContext
- **REST API** integration with backend
- **Deployed on Vercel**

---

## 🔐 Authentication

- JWT is issued on signup/login and stored in `localStorage`
- AuthContext manages login state
- Protected routes like `/dashboard` are guarded against unauthenticated access

---

## 📬 Key Routes

| Path              | Description                         |
| ----------------- | ----------------------------------- |
| `/`               | Landing page with platform features |
| `/signup`         | Register as a new user              |
| `/login`          | Log into your account               |
| `/dashboard`      | View and manage your own posts      |
| `/feed`           | Global feed of all posts            |
| `/following`      | Feed of users you follow            |
| `/profile/:email` | Public profile page with user posts |

---

## 📄 License

MIT

---

## ✍️ Author

[Prateek Balawat](https://github.com/prateekbalawat)
