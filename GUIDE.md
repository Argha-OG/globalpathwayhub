# Full Stack Setup Guide

This guide explains how the frontend (React) connects to the backend (Express + MongoDB) and how the authentication now works without Firebase.

## 1. Prerequisites
- **Node.js** installed.
- **MongoDB** installed and running locally (or use a cloud URL).

## 2. Backend Setup (Server)

The backend is an Express.js server that connects to MongoDB.

1.  **Navigate to the server directory**:
    ```bash
    cd server
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # This will install express, mongoose, cors, dotenv, etc.
    # Note: firebase-admin has been removed.
    ```

3.  **Configure Environment**:
    Create or check your `.env` file in the `server` folder:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/globalpathwayhub
    # Replace the URI with your actual MongoDB connection string if different
    ```

4.  **Start the Server**:
    ```bash
    npm run dev
    ```
    You should see:
    > Server running on http://localhost:5000
    > MongoDB Connected

## 3. Frontend Setup (Client)

The frontend is a React (Vite) app that consumes the backend API.

1.  **Navigate to the client directory**:
    ```bash
    cd client
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the Frontend**:
    ```bash
    npm run dev
    ```
    Access the site at `http://localhost:5173` (or the port shown).

## 4. Architecture Overview

### Authentication (Simplified)
- **Login**: The Admin Login page now accepts the hardcoded credentials:
    - **Username**: `Siam#18767:)`
    - **Password**: `Siam#18767:)`
- **Token**: Upon successful login, a mock token (`siam-secret-token`) is stored in the browser's `localStorage`.
- **Protection**: Private API routes (like creating/deleting universities) check for this token in the `Authorization` header.

### Data Storage (MongoDB)
- **Database**: All University and Course data is stored in the MongoDB database specified in your `MONGO_URI`.
- **API**: The frontend sends HTTP requests (GET, POST, PUT, DELETE) to `http://localhost:5000/api/...`.
- **Models**: Mongoose models in `server/models/` define the data structure.

### Connecting Frontend to Backend
The connection happens in `client/src/lib/api.js`:
- `API_URL` is set to point to your local server (`http://localhost:5000/api`).
- Functions like `fetchUniversities` make `fetch()` calls to this URL.
- Authentication headers are automatically added if the user is logged in.

## 5. Troubleshooting
- **Frontend can't connect?** Ensure the backend server is running and the port matches `API_URL` in `api.js`.
- **MongoDB error?** Ensure your MongoDB service is running (`mongod`).
