# User Registration API

## Endpoint

`POST /users/register`

Registers a new user in the system.

---

## Description

This endpoint accepts a new user's personal information, validates it, checks whether the email already exists, hashes the password, and creates a user record.

On success, it returns a JWT token and the created user data.

---

## Request Body

The request body must be a JSON object with the following fields:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "123456"
}
```

### Required Fields

- `fullname.firstname`: required, minimum 3 characters
- `email`: required, valid email format
- `password`: required, minimum 6 characters
- `fullname.lastname`: optional, but if provided should be at least 2 characters

---

## Validation Rules

The endpoint validates the data using `express-validator` before creating the user:

- `email` must be a valid email address
- `fullname.firstname` must contain at least 3 characters
- `password` must be at least 6 characters long

---

## Success Response

### Status Code: `201 Created`

Example response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2M0YzU2YS1iYjM0LTQ3MWEtYjU3YS1mNjBhODc3YjQ4MjQiLCJpYXQiOjE3MDAxMjM0NTYsImV4cCI6MTcwMDAzNzA1Nn0.abcxyz",
  "user": {
    "_id": "67c4c56a-bb34-471a-b57a-f60a877b4824",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "$2b$10$Q4E4V4sP5xuYf1nWcQn0mOeM4N3Q4v5y8HhJ8dY7nq2B2f8L5lV6"
  }
}
```

This means the user was created successfully and a JWT token was returned.

---

## Error Responses

### `400 Bad Request`

Returned when:

- validation fails
- email already exists
- invalid request payload

Example:

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

or

```json
{
  "message": "User already exists"
}
```

### `500 Internal Server Error`

Returned when an unexpected server error occurs while processing the request.

---

## Notes

- Passwords are hashed before saving to the database.
- A JWT token is generated for the registered user and returned in the response.
- The route is defined as `POST /users/register`.

---

## User Login API

### Endpoint

`POST /users/login`

Authenticates an existing user with their email and password. On success, the endpoint returns a JWT token and the user data.

### Request Body

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

### Validation Rules

- `email` must be a valid email address.
- `password` must contain at least 6 characters.

### Success Response

#### Status Code: `200 OK`

```json
{
  "token": "<jwt-token>",
  "user": {
    "_id": "67c4c56a-bb34-471a-b57a-f60a877b4824",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  }
}
```

### Error Responses

#### `400 Bad Request`

Returned when request validation fails. The response includes an `errors` array describing the invalid fields.

#### `401 Unauthorized`

Returned when the email is not found or the password does not match:

```json
{
  "message": "Invalid email or password"
}
```

### Notes

- Passwords are checked against the stored password hash.
- The route is defined as `POST /users/login`.
