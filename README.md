# 🌐 Chill Gamer - Server Side

[**Live Site URL**](https://chill-gamer-main.netlify.app/) https://chill-gamer-main.netlify.app/

- This is the **server-side code** for the **Chill Gamer** web application. It serves as the backend, handling data management, authentication, and APIs to provide functionality for game reviews and a personal watchlist.

---

## **Technologies Used**

- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Web framework for creating API endpoints.
- **MongoDB**: NoSQL database for storing game reviews and watch list data.
- **dotenv**: To manage environment variables securely.
- **cors**: Middleware for enabling Cross-Origin Resource Sharing.

---

## **Features**

### 1. **Game Reviews Management**

- **POST `/gameReviews`**: Add a new game review to the database.
- **GET `/gameReviews`**: Retrieve all game reviews from the database.
- **GET `/gameReviews/:id`**: Fetch a specific game review by its unique ID.
- **GET `/gameReviews/email/:email`**: Retrieve all reviews submitted by a specific user using their email.
- **PUT `/gameReviews/:id`**: Update an existing game review by its unique ID.
- **DELETE `/gameReviews/:id`**: Delete a game review by its unique ID.

### 2. **Watchlist Management**

- **POST `/watchList`**: Add a game to the user's personal watchlist.
- **GET `/watchList`**: Retrieve all watchlist items.
- **GET `/watchList/:id`**: Fetch a specific watchlist item by its unique ID.
- **GET `/watchList/email/:email`**: Retrieve all watchlist items for a specific user using their email.
- **DELETE `/watchList/:id`**: Delete a watchlist item by its unique ID.

### 3. **Root Endpoint**

- **GET `/`**: A test endpoint to confirm the server is running.

---

## **Environment Variables**

This project uses a `.env` file to securely manage sensitive information.
