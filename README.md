# TaskFlow — MERN Task Manager

TaskFlow is a full-stack task management application that helps users organize, track, and manage their daily tasks through a clean and responsive dashboard.

## Features

- User registration and login
- JWT-based authentication
- User-specific tasks
- Create, edit, complete, and delete tasks
- Task categories and priorities
- Due dates and overdue task indicators
- Task sorting and filtering
- Calendar view
- Responsive dashboard interface

## Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)

**Tools**
- Git and GitHub
- Bun

## Project Structure

```text
TaskFlow/
├── client/       # React frontend
├── server/       # Express backend
└── README.md
```

## Run Locally

### Prerequisites

Install Node.js, Bun, and MongoDB access before running the project.

### 1. Clone the repository

```bash
git clone https://github.com/AlishaIqbal985/TaskFlow.git
cd TaskFlow
```

### 2. Install frontend dependencies

```bash
cd client
bun install
```

### 3. Install backend dependencies

Open another terminal from the TaskFlow root folder:

```bash
cd server
bun install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` folder and configure the required values using the variable names expected by the backend code.

Keep database credentials and JWT secrets private. Never commit `.env` files to GitHub.

### 5. Start the backend

From the `server` folder:

```bash
bun run dev
```

### 6. Start the frontend

From the `client` folder in a separate terminal:

```bash
bun run dev
```

Open the local URL shown in the frontend terminal, usually `http://localhost:5173`.

## Deployment

The application is being prepared for deployment. Hosting URLs will be added here after the frontend and backend are deployed and tested.

## Author

**Alisha Iqbal**

GitHub: [AlishaIqbal985](https://github.com/AlishaIqbal985)
