# exam-project-backend
# MatekNinja Backend

## Description
The MathNinja backend is an Express application that serves as the intermediary between the frontend and the database for the MathNinja project. The project aims to help students practice solving mathematical problems. The backend's primary function is to establish the connection between the frontend and the database.

## Environment Variables
The application uses a .env file to manage environment variables. The .env file should contain the following:

PORT=****
MONGO_URI=mongodb+srv://*****
JWT_SECRET=******
CLIENT_ID=********
CLIENT_SECRET=********
REDIRECT_URI=https://matekninja.hu/callback
TEST_TOKEN=<your_token_here>

## Installation
To install the necessary dependencies, you can use the following command:

```bash
npm install
```

## Available Scripts
In the project directory, you can run:

npm run dev: Starts the server in development mode.
npm run build: Builds the server for production.
npm start: Runs the built server in production mode.
npm test: Launches the test runner.

## Dependencies
The application uses several npm packages:

axios: Promise based HTTP client for the browser and node.js.
cors: Provides a Connect/Express middleware that can be used to enable CORS with various options.
dotenv: Loads environment variables from a .env file into process.env.
express: Fast, unopinionated, minimalist web framework for Node.js.
jsonwebtoken: An implementation of JSON Web Tokens.
mongoose: Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
zod: A schema validation library.
Contribution
Contributions are always welcome. Please make a pull request.

## License
This project is licensed under the MIT License.