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
Request:
```json
{
    "user_name": "mabrur",
    "user_phone": "998991234567"
}
```
Response:
```json
{
    "ok": true,
    "message": "User created successfully",
    "data": {
        "id": "772b6427-ff7f-400b-a9c8-fe164480a0e8",
        "code": 721017
    }
}
```
### Validate Code
Route: `/api/v1/users/validate-code` Method: `POST`
Header:
```
code-validation-id: 772b6427-ff7f-400b-a9c8-fe164480a0e8
```
Request: 
```json
{
    "code": 721017,
    "user_device": "Android" # IOS, other
}
```
Response:
```json
{
    "ok": true,
    "message": "You are logged in!",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiYjE0MjlkZjktNzIzNC00MWExLTliNmItYmZiM2VkNGQ2NDk1IiwiaWF0IjoxNjQ3MDI4NDU1fQ.veisCisw86fY6K1-wg97WxtQ0D_VuZwwCRe-QBo1icE",
        "user": {
            "user_id": "5436f73f-56b6-4844-909b-48d0d6e1b444",
            "user_name": "mabrur",
            "user_phone": "998991234567",
            "user_attempts": 0,
            "user_password": null,
            "createdAt": "2022-03-11T19:50:46.899Z",
            "updatedAt": "2022-03-11T19:50:46.899Z"
        }
    }
}
```
### Login
Route: `/api/v1/users/login` Method: `POST`
Request: 
```json
{
    "user_phone": "998999123456"
}
```
Response: 
```json
{
    "ok": true,
    "message": "We've sent verification code on your phone!",
    "data": {
        "id": "63d99e2a-6b94-4dd9-85d3-1941c7ccd67f",
        "code": 965269
    }
}
```
### Resend Code
Route: `/api/v1/users/resend-code` Method: `POST`
Request: 
```json
{
    "user_phone": "998999123456"
}
```
Response: 
```json
{
    "ok": true,
    "message": "Code was sent on your number!",
    "data": {
        "id": "bc107c4a-7bbd-4f1c-ad1c-0f412ee469af",
        "code": 180561
    }
}
```
### Change Number
Route: `/api/v1/users/change-number` Method: `PATCH`
Request: 
```json
{
    "old_user_phone": "998999123456",
    "new_user_phone": "998977777777"
}
```
Response: 
```json
{
    "ok": true,
    "message": "Code was sent on your number!",
    "data": {
        "id": "1849db96-6c64-4701-9980-e4dff9caf721",
        "code": 161151
    }
}
```
## How it Works?
First you should create account by sign-up, then you will receive code and id. Write the id in the validate-code route into headers and send code with request body.
If you are in login, you will receive the code and you should do the same.
To change number or resend code also the same.
When your code and id is correct you will get access token.
