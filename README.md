# CHATROOM

This is a simple chatroom application built with **Node.js** and **Express** that allows users to register, log in, and send, edit, and delete messages. The application uses **Sequelize** for database interactions and **cookies** to manage user sessions.

## Features

- **Login**: Users can log in with their email and password.
- **Registration**: New users can register by entering their email, first name, last name, and setting a password.
- **Message System**: Users can send, edit, and delete messages in the chatroom.
- **Search**: Users can search messages by keywords.
- **Session Management**: Users are logged in with a cookie that expires after 30 seconds for security reasons.
- **Error Handling**: The application provides error messages for invalid inputs or actions.

## Requirements

- **Node.js**: Version 14 or higher
- **npm**: Node package manager for dependencies
- **Sequelize**: ORM for managing the database
- **Express**: Web framework for handling routes and HTTP requests
- **Cookie-Parser**: Middleware for cookie management

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd chatroom
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm start
   ```

   The application will run on `http://localhost:3000`.

## Usage

1. **Login Page**: Navigate to `/` to log in. Use your email and password to sign in.
2. **Register Page**: If you don't have an account, you can register at `/register`. 
3. **Chatroom**: After logging in, you will be redirected to the `/chatroom` page where you can send, edit, and delete messages.
4. **Search**: You can search for messages using the `/chatroom/search?term=<keyword>` endpoint.
5. **Logout**: You can log out by visiting the `/logout` route.

## Routes

- **GET /**: Displays the login page.
- **POST /login**: Authenticates a user.
- **GET /logout**: Logs out the user.
- **GET /register**: Displays the registration form.
- **POST /register**: Handles user registration (step 1).
- **GET /register/password**: Displays the password input page.
- **POST /register/password**: Handles password input and registration (step 2).
- **GET /chatroom**: Displays the chatroom if the user is logged in.
- **GET /chatroom/messages**: Retrieves all messages in the chatroom.
- **POST /chatroom/send**: Sends a new message.
- **DELETE /chatroom/delete/:id**: Deletes a message by ID.
- **PUT /chatroom/edit/:id**: Edits a message by ID.
- **GET /chatroom/search**: Searches for messages by keyword.

## Error Handling

The application uses various checks for error handling, such as:

- Invalid login credentials
- Invalid or expired registration cookie
- Invalid input data (e.g., incorrect email format, passwords not matching)
- Server errors when accessing or modifying messages

## Technologies Used

- **Node.js**
- **Express** for routing
- **Sequelize** for ORM and database management
- **EJS** for templating
- **Cookies** for session management

## Author

- **Samah Rajabi**