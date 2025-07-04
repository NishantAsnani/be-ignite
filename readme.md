# BEignite

BEignite is a CLI tool to generate boilerplate code for backend applications using Node.js, Express, and MongoDB.

## Features

- Quickly scaffolds a backend project structure
- Generates controllers, models, routes, middleware, services, and utility files
- Sets up MongoDB connection and JWT authentication
- Includes ready-to-use user authentication and CRUD endpoints

## Getting Started

### 1. Create a New Project

Run the following command in your terminal:

```sh
npx beignite boot-be-app
```

This will generate the project structure and install all necessary dependencies.

### 2. Configure Environment Variables

Create a `.env` file in your project root (or copy from `.env.example`) and set the following variables:

```
JWT_SECRET=your_jwt_secret
PORT=3000
DB_NAME=your_db_name
```

> **Note:** Fall-back values have been added for these environment variables. Setting them in your `.env` file is recommended, but not compulsory—the application will use default values if any are missing.

### 3. Start Working

You can now start building your backend application! The generated code includes:

- `controllers/`
- `models/`
- `routes/`
- `middleware/`
- `services/`
- `utils/`
- `db/`
- `index.js` (entry point)

### 4. Run Your Application

```sh
node index.js
```

Your server will start on the port specified in your `.env` file (or the default if not set).

## License

This project is licensed under the [MIT License](./LICENSE).

---

