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
   
  
  
  
---  
  
## API Testing (Postman)  
  
- A complete **Postman Collection** is provided  
- Includes:  
  - Auth APIs  
  - Task CRUD APIs  
  - Admin APIs  
- Uses environment variables:  
  - `base_url`  
  - `access_token`  
  
---  
  
## Setup Instructions  
  
### 1️⃣ Clone the repository  

git clone https://github.com/hardik-soni12/Task-Manager-Flask-RESTAPI.git  
cd Task-Manager-Flask-RESTAPI  
  
  
### 2️⃣ Create virtual environment  
  
python -m venv venv  
activate : venv/Scripts/activate - windows  
  

### 3️⃣ Install dependencies  
  
pip install -r requirements.txt  
  

### 4️⃣ Environment Variables  
  
- Create a .env file and add:  
  
SECRET_KEY='any-secret-key'  
SQLALCHEMY_DATABASE_URI = production database url  
JWT_SECRET_KEY = any-secret-key-for-jwt  
JWT_ACCESS_TOKEN_EXPIRES=3600   # 1 hour  
JWT_REFRESH_TOKEN_EXPIRES=86400 # 1 day  
  
- Create a .flaskenv file and add:  
  
FLASK_APP = run:app  
FLASK_ENV = production/development  
  
  

### 5️⃣ Database Migrations  
  
flask db init  
flask db migrate -m "Initial migration"  
flask db upgrade  
  
  

### ▶️ Run the Application  
  
backend/python run.py
  
~~ Server will start at:  
http://127.0.0.1:5000  
  


### API Base URL  
  
/api/v1  
  
- Example:  
POST /api/v1/auth/login  
GET  /api/v1/tasks  
  
  

### Postman Collection Link :  
  
link : https://hardik-soni12-9436696.postman.co/workspace/Hardik-Soni's-Workspace~fa9d7973-8f81-4f9c-8918-a7e3ab03f25d/collection/47195622-b1a11787-7edd-4884-bd1a-c4930a6d8a9b?action=share&creator=47195622&active-environment=47195622-0978e7a1-a945-4cf3-9cdb-5f544cfe018f  
  
---