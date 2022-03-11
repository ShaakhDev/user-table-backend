# Authentication Template Using Node.js
Simple NodeJS server with express providing basic authentification with postgresql (sequelize).
## Environment
1. Create .env file on your project.
Here is multiple environment variable that need to be setup:
*   PG_CONNECTION_URL
*   PORT
*   SECRET_WORD
## Installation
1. Install nodemon globally:
`npm install nodemon -g`
3. Install dependencies:
`npm install`
3. Run application:
`npm run dev`
## Routes
### Signup
Route: `/api/v1/users/signup` Method: `POST`
`json`
{
    "user_name": "mabrur",
    "user_phone": "998990123456"
}
