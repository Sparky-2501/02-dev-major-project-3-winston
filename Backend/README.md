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

## User Profile API

### Endpoint

`GET /users/profile`

Returns the authenticated user's profile.

### Authentication

Send the JWT in the `token` cookie or as a bearer token:

```http
Authorization: Bearer <jwt-token>
```

### Success Response

#### Status Code: `200 OK`

```json
{
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

### Error Response

#### `401 Unauthorized`

Returned when the token is missing or invalid:

```json
{
  "message": "Unauthorized"
}
```

An invalid or expired token returns:

```json
{
  "message": "Invalid token"
}
```

## User Logout API

### Endpoint

`GET /users/logout`

The user routes are mounted at `/users`, so the registered logout path is `/users/logout` (not `/user/logout`).

### Authentication

Requires a JWT in the `token` cookie or as a bearer token:

```http
Authorization: Bearer <jwt-token>
```

### Success Response

#### Status Code: `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

The endpoint clears the `token` cookie. Tokens sent using the cookie are also added to the blacklist.

### Error Response

#### `401 Unauthorized`

Returned when the token is missing or invalid:

```json
{
  "message": "Unauthorized"
}
```

### Implementation Notes

- The JWT contains the user ID in the `_id` claim, while the authentication middleware currently looks up `decoded.id`. As a result, the profile response may contain `"user": null` until those claim names are aligned.
- The middleware currently checks the user collection rather than the blacklist collection, so adding a token to the blacklist does not currently make subsequent requests reject it.
- The logout controller currently reads the cookie reliably; its bearer-token fallback uses the wrong request property, so bearer-token clients should discard their token locally.

## Captain APIs

Captain routes are mounted under `/captains`. The router defines registration and login endpoints, and protected profile and logout endpoints. Protected routes accept a JWT from the `token` cookie or the `Authorization: Bearer <token>` header.

### Register Captain

`POST /captains/register`

Registers a captain with personal and vehicle details.

#### Request body

```json
{
  "fullname": {
    "firstname": "Alex",
    "lastname": "Rider"
  },
  "email": "alex@example.com",
  "password": "example-password",
  "vehicle": {
    "color": "Blue",
    "plate": "MH 00 AB 6123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

#### Validation

- `fullname.firstname` is required and must contain at least 3 characters.
- `fullname.lastname` is optional; if provided, it must contain at least 3 characters.
- `email` must be a valid email address.
- `password` must contain at least 6 characters.
- `vehicle.color` is required and must contain at least 3 characters.
- `vehicle.plate` is optional in route validation; if provided, it must contain at least 3 characters.
- `vehicle.capacity` is required and must be an integer of at least 1.
- `vehicle.vehicleType` is required and must be `car`, `auto`, or `motorcycle`.

#### Responses

Validation failures return `400 Bad Request` with an `errors` array. The controller is also written to return `400 Bad Request` with `{"message":"Captain already exists"}` when its email lookup finds a duplicate.

There is currently no reliable success response: the controller calls service methods that are not exported by `captain.service.js`, does not pass the vehicle fields expected by `createCaptain`, and does not send a response after generating a token. The service requires a plate even though route validation marks it optional.

### Captain Login

`POST /captains/login`

Authenticates a captain with an email and password.

#### Request body

```json
{
  "email": "alex@example.com",
  "password": "example-password"
}
```

#### Validation

- `email` must be a valid email address.
- `password` must not be empty.

#### Responses

- Validation failures return `400 Bad Request` with an `errors` array.
- If no captain is found, the controller returns `400 Bad Request` with `{"message":"Invalid email or password"}`.
- The intended success body is `{"token":"<jwt-token>"}`.

The current success path is incomplete: the controller requests a `hashedPassword` field, while the model stores the selected-out hash in `password`; it also calls service methods that are not exported. In addition, the password-match result is not checked before token generation. Do not rely on login until these issues are fixed.

### Captain Profile

`GET /captains/profile`

The route is intended to require captain authentication and return the captain document (the example shows only its ID):

```json
{
  "captain": {
    "_id": "<captain-id>"
  }
}
```

Supply the JWT as a `token` cookie or in the `Authorization` header using the `Bearer` scheme.

The auth middleware returns `401 Unauthorized` when no token is supplied, when the token is blacklisted, or when token verification fails. However, the captain model signs tokens with an `_id` claim, while the middleware looks up `decoded.id`, so a verified token may resolve to a null captain.

### Captain Logout

`POST /captains/logout`

Requires captain authentication. The controller attempts to add the supplied cookie or bearer token to the token blacklist, clears the `token` cookie, and returns:

```json
{
  "message": "Logged out successfully"
}
```

**Current status:** The controller passes the token directly to `blackListTokenModel.create`, so logout may not create a valid blacklist record depending on the blacklist model schema. The authentication middleware checks the blacklist before allowing protected requests; verify logout and token rejection against the actual model before relying on revocation.