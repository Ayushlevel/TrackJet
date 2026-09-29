# 🚀 TrackJet – Project Management System

TrackJet is a full-stack Project Management application built using the MERN Stack. It enables teams to manage projects, create tasks, assign priorities, track progress, and collaborate through comments.

---

## 📌 Features

### 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Password Encryption using bcrypt

### 📁 Project Management
- Create Project
- View Projects
- Update Project
- Delete Project
- Project Members

### ✅ Task Management
- Create Task
- Edit Task
- Delete Task
- Task Status (To Do, In Progress, Completed)
- Task Priority (Low, Medium, High)
- Assign Tasks
- Search Tasks
- Filter Tasks

### 💬 Comments
- Add Comments
- Edit Comments
- Delete Comments
- View Task Comments

### 📊 Dashboard
- Total Projects
- Total Tasks
- Completed Tasks
- Pending Tasks
- Dashboard Statistics

---

# 🛠️ Tech Stack

## Frontend
- React.js
- React Router
- Axios
- Tailwind CSS

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

---

# 📂 Folder Structure

```
TrackJet
│
├── controllers
├── middleware
├── models
├── routes
├── frontend
├── services
├── server.js
├── package.json
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Ayushlevel/TrackJet.git
```

Move into project

```bash
cd TrackJet
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Start Backend

```bash
npm start
```

Start Frontend

```bash
npm run dev
```

---

# 📸 Screenshots

Add screenshots here.

- Login Page
- Dashboard
- Project Details
- Task Management
- Comments

---

# 📌 API Endpoints

## Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`

## Projects
- GET `/api/projects`
- POST `/api/projects`
- PUT `/api/projects/:id`
- DELETE `/api/projects/:id`

## Tasks
- GET `/api/tasks/project/:projectId`
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`

## Comments
- POST `/api/comments/:taskId`
- GET `/api/comments/:taskId`
- PUT `/api/comments/:commentId`
- DELETE `/api/comments/:commentId`

---

# 🔒 Security

- JWT Authentication
- Password Hashing using bcrypt
- Protected APIs
- Authorization Middleware

---

# 👨‍💻 Author

**Ayushman Yadav**

GitHub: https://github.com/Ayushlevel

---

# ⭐ Future Improvements

- File Attachments
- Notifications
- Email Invitations
- Activity Logs
- Calendar View
- Dark Mode
- Real-time Collaboration

---

## 📄 License

This project is developed for learning and educational purposes.