#  Task Manager API  
  
A **Task Manager Backend API** built using **Flask**, **SQLAlchemy**, and **JWT Authentication**.  
This project allows users to manage tasks securely, with role-based access for admins.  
The API follows best practices such as the **App Factory Pattern**, **Blueprints**, and **Clean Error Handling**.  
  
---
  
##  Features  
  
### Authentication  
- User Registration  
- User Login with JWT  
- Secure password hashing using **Flask-Bcrypt**  
- Protected routes using JWT authentication  

### Task Management (CRUD)  
- Create a task  
- View own tasks  
- Update a task  
- Delete a task  

### Admin Capabilities  
- User Management  
- Task Management  
- System Monitoring  
- Admin-only protected routes  
  
### Backend Best Practices  
- Flask App Factory Pattern  
- Modular project structure  
- Marshmallow schemas for validation & serialization  
- Centralized error handling  
- Database migrations using Flask-Migrate  
  
---  
  
## Tech Stack  
  
- **Python**  
- **Flask**  
- **Flask SQLAlchemy**  
- **Flask JWT Extended**  
- **Flask Bcrypt**  
- **Marshmallow**  
- **PostgreSQL / SQLite**  
- **Flask Migrate**  
- **Postman (API testing)**  
  
---  
  
## Database Models  
  
### User Model  
- id  
- username  
- email  
- password (hashed)  
- role  
- created_at  
  
### Task Model  
- task_id  
- title  
- description  
- status  
- user_id  
- created_at  
  
---  
  
## Authentication Flow  
  
1. Register a new user  
2. Login to receive JWT access token  
3. Pass token in headers for protected routes:  
  
  
  
