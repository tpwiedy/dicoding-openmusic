
---

# OpenMusic API

This project is part of the **OpenMusic API** development case study from [Dicoding]. The API provides a backend service to manage music collections, including albums and songs, built using **Node.js** and **PostgreSQL**.

## Features

- **Album Management:** Create, read, update, and delete albums.
- **Song Management:** Add, retrieve, edit, and remove songs associated with albums.
- **Playlist Management:** Create and manage playlists and add songs to playlists.
- **User Authentication:** Secure user authentication and authorization using JWT tokens.
- **Caching:** Use Redis to enhance performance by caching data.
- **Activity Logs:** Track activities like adding songs to playlists.

## Tech Stack

- **Node.js:** JavaScript runtime for server-side code.
- **Hapi:** A framework for building server-side applications.
- **PostgreSQL:** A relational database for managing the data.
- **Redis:** For caching frequently accessed data.
- **JWT:** JSON Web Token for user authentication.
- **ESLint:** Ensures code quality and consistency.

## Prerequisites

Before running this project, ensure you have:

- Node.js (v14+)
- PostgreSQL (v12+)
- Redis
- npm (Node package manager)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/tpwiedy/dicoding-openmusic.git
    cd dicoding-openmusic
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up the environment variables:

    Create a `.env` file in the project root and define the following variables:

    ```bash
    HOST=localhost
    PORT=5000
    PGUSER=your_postgres_username
    PGPASSWORD=your_postgres_password
    PGDATABASE=openmusic
    PGHOST=localhost
    PGPORT=5432
    ACCESS_TOKEN_KEY=your_access_token_secret
    REFRESH_TOKEN_KEY=your_refresh_token_secret
    REDIS_HOST=localhost
    ```

4. Initialize the database:

    Run the SQL scripts to set up the database schema. These scripts can be found in the `migrations` folder.

    ```bash
    npm run migrate up
    ```

## Running the Application

Start the server with the following command:

```bash
npm run start:dev
```

The API will run on `http://localhost:5000`.

## API Documentation

The API is documented using Postman collections or Swagger. You can import the Postman collection from `docs/openmusic-api.postman_collection.json` to explore the API.


## Project Structure

```bash
.
├── migrations        # Database migration files
├── src
│   ├── api           # API route handlers
│   ├── services      # Business logic and services
│   ├── validator     # Request validation schemas
│   ├── utils         # Utility functions
│   ├── db            # Database connection setup
└── ├──server.js     # Main server setup
```

## License

This project is licensed under the MIT License.

---
