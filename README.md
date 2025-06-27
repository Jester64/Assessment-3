<h1/>🎬 Movie API Server</h1>

A secure, Express-based Node.js server for accessing and interacting with movie and people data from a SQL database, with JWT-based authentication and Swagger documentation.
<h2/>🚀 Getting Started</h2>
<h3/>✅ Prerequisites</h3>

    Node.js

    npm

    MySQL

    A .env file with your secrets (see below)

<h3/>🔧 Installation</h3>

Clone the repository

    git clone <your-repo-url>
    cd <your-project-directory>

Install dependencies

    npm install

Set up environment variables

Create a .env file in the root directory with the following:

    JWT_SECRET=your_jwt_secret_here

Create a knexfile.js and fill out the template:

      module.exports = {
      client: 'mysql2',
      connection: {
          host: '127.0.0.1',
          database: 'database name (movies)',
          user: 'username',
          password: 'password'
      }
    }

Start the HTTPS server

    npm start

  This will run the server on https://localhost:3000 using a self-signed certificate.

<h3/>🔐 Authentication</h3>

Use JWT tokens for protected routes.

    Register: POST /users/register

    Login: POST /users/login

After login, include your token in the Authorization header:

Authorization: Bearer <token>

<h2/>📚 API Endpoints</h2>
Method	Endpoint	Description

GET	/movies/search?title=x&year=y	Search movies by title and/or year

GET	/movies/data/:imdbID	Get detailed data for a specific movie

GET	/people/:id	Get info about a person and their roles

POST	/users/login	Log in and receive JWT

POST	/users/register	Register a new user

GET	/docs	View Swagger/OpenAPI documentation

GET	/knex	Logs database version (for debugging)

<h2/>🧠 Design Highlights</h2>
🛡 HTTPS

    Uses self-signed SSL certs: selfsigned.key and selfsigned.crt

    Secure by default on https://localhost:3000

<h2/>🔐 JWT Middleware</h2>

    Authorization checked in middleware/authorization.js

    Ensures tokens are valid and not expired

<h2/>🗂 Routes</h2>

    Defined in routes/index.js and routes/users.js

    Protected routes require JWT

<h2/>📄 Views</h2>

    Jade templating for error handling (views/*.jade)

    Basic public styling in public/stylesheets/style.css

<h2/>🔗 OpenAPI Integration</h2>

    OpenAPI spec (docs/openapi.json)

    Accessible at /docs via Swagger UI

<h2/>🛠 Development Scripts</h2>

    Start the server:

    npm start

    Dev logging enabled with:
    debug=expworld:*

<h2/>🧾 .gitignore</h2>

Make sure to exclude sensitive files:

    .env
    node_modules/
    selfsigned.key
    selfsigned.crt
    knexfile.js

<h2/>📂 Project Structure</h2>

.
├── bin/www                  # Entry point (HTTPS server)

├── app.js                  # Main app configuration

├── knexfile.js             # Knex config (excluded via .gitignore)

├── middleware/             # Custom auth middleware

├── routes/                 # Route handlers

├── public/                 # Static files

├── views/                  # Jade templates

├── docs/                   # Swagger/OpenAPI spec

├── selfsigned.crt/.key     # Local SSL cert/key

├── .env                    # Env config (JWT_SECRET, PORT)

<h2/>✅ Notes</h2>

  nsure your database has the required tables: basics, principals, names, users.

  Error handling is included for bad requests and DB failures.

  JWTs expire after 24 hours (60 * 60 * 24).
