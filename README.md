
# **NodeHorizon** 

**NodeHorizon** is a RESTful API backend built with Node.js, Express, and MongoDB. It includes user authentication (JWT-based), role-based authorization, and CRUD operations for resources. The project is designed with modern technologies and is fully customizable for any scalable API development needs.

## **Features**
- User authentication with JWT (Register, Login).
- Profile management (View, Update, Change password).
- Role-based access control (User and Admin roles).
- Admin functionalities (Manage users).
- CRUD operations for resources.
- Secured with bcrypt for password hashing.
- Modular, scalable codebase.

## **Technologies**
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password encryption
- **Nodemon** for development
- **dotenv** for environment configuration

---

## **Table of Contents**
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## **Installation**

### 1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/NodeHorizon.git
```

### 2. **Install dependencies:**

```bash
cd NodeHorizon
npm install
```

### 3. **Set up environment variables:**

Create a `.env` file in the root of your project and add the following environment variables:

```bash
MONGO_URI=mongodb://localhost:27017/nodehorizon
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4. **Run MongoDB:**

Make sure you have MongoDB running locally or update the `MONGO_URI` to connect to a cloud MongoDB instance like **MongoDB Atlas**.

For local MongoDB, run:
```bash
mongod
```

---

## **API Endpoints**

### **Authentication & Users**
| HTTP Method | Endpoint                   | Description                  | Auth Required | Admin Only |
|-------------|----------------------------|------------------------------|---------------|------------|
| POST        | `/api/users/register`       | Register a new user          | No            | No         |
| POST        | `/api/users/login`          | Login and get JWT            | No            | No         |
| GET         | `/api/users/profile`        | Get user profile             | Yes           | No         |
| PUT         | `/api/users/profile`        | Update user profile          | Yes           | No         |
| PUT         | `/api/users/change-password`| Change user password         | Yes           | No         |
| GET         | `/api/users`                | Get all users                | Yes           | Yes        |
| DELETE      | `/api/users/:id`            | Delete a user                | Yes           | Yes        |

### **Resources**
| HTTP Method | Endpoint                   | Description                  | Auth Required | Admin Only |
|-------------|----------------------------|------------------------------|---------------|------------|
| GET         | `/api/resources`            | Get all resources            | Yes           | No         |
| POST        | `/api/resources`            | Create a new resource        | Yes           | No         |
| GET         | `/api/resources/:id`        | Get a single resource        | Yes           | No         |
| PUT         | `/api/resources/:id`        | Update a resource            | Yes           | No         |
| DELETE      | `/api/resources/:id`        | Delete a resource            | Yes           | No         |

---

## **Usage**

### 1. **Running the Server**

To run the server in development mode, use **Nodemon**:

```bash
npx nodemon server.js
```

Or directly with Node:

```bash
node server.js
```

The server will start at `http://localhost:5000` by default.

### 2. **Testing API Endpoints**

You can test the API using tools like **Postman** or **Insomnia**, or use **curl** commands from the terminal.

#### **Register a User**
```bash
POST /api/users/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "password123"
}
```

#### **Login a User**
```bash
POST /api/users/login
Content-Type: application/json

{
    "email": "johndoe@example.com",
    "password": "password123"
}
```

You will receive a JWT token upon successful login, which you need to pass in the `Authorization` header for protected routes.

Example:
```bash
Authorization: Bearer your_jwt_token
```

#### **Get User Profile (Authenticated)**
```bash
GET /api/users/profile
Authorization: Bearer your_jwt_token
```

---

## **Environment Variables**

Make sure to set the following variables in your `.env` file:

| Variable      | Description                                      |
|---------------|--------------------------------------------------|
| `MONGO_URI`   | MongoDB connection string                        |
| `JWT_SECRET`  | Secret key for signing JWT tokens                |
| `PORT`        | Port number where the server will run (default: 5000) |

---

## **Scripts**

| Command                   | Description                             |
|----------------------------|-----------------------------------------|
| `npm start`                | Start the server in production mode     |
| `npx nodemon server.js`    | Start the server in development mode    |
| `npm run lint`             | Run ESLint to lint the code             |
| `npm run lint:fix`         | Fix ESLint issues automatically         |

---

## **Contributing**

We welcome contributions to **NodeHorizon**! To contribute:

1. Fork the project.
2. Create a new branch:  
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes.
4. Commit your changes:  
   ```bash
   git commit -m 'Add some feature'
   ```
5. Push to the branch:  
   ```bash
   git push origin feature-name
   ```
6. Open a Pull Request.

Please make sure your code adheres to the project's coding standards and passes all tests before submitting.

---

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### **Contact**

If you have any questions or suggestions regarding **NodeHorizon**, feel free to reach out via issues or directly contact us at:

- Email: contact@nodehorizon.com

Happy coding with **NodeHorizon**! 🎉
