# API Reference

## Base URL
```
Development: http://localhost:3000/api
Production: https://app.betterbeing.com/api
```

## Authentication
Most API endpoints require authentication via NextAuth.js session cookies or JWT tokens.

### Authentication Headers
```http
Cookie: next-auth.session-token=<session-token>
```

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "user | admin"
  },
  "message": "Account created successfully"
}
```

**Error Responses:**
- `400` - Validation error or email already exists
- `500` - Server error

### NextAuth Endpoints
- `GET/POST /api/auth/signin` - Sign in page
- `GET/POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - Get CSRF token
- `GET /api/auth/providers` - List auth providers
- `POST /api/auth/callback/:provider` - OAuth callback

---

## Product Endpoints

### GET /api/products
List all products with optional filtering.

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)
- `category` (string) - Filter by category ID
- `search` (string) - Search products
- `sort` (string) - Sort field (name, price, createdAt)
- `order` (string) - Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "string",
      "slug": "string",
      "description": "string",
      "price": "decimal",
      "categoryId": 1,
      "images": ["url"],
      "inStock": true,
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### GET /api/products/:id
Get a single product by ID.

**Response:**
```json
{
  "success": true,
  "product": {
    "id": 1,
    "name": "string",
    "slug": "string",
    "description": "string",
    "longDescription": "string",
    "price": "decimal",
    "categoryId": 1,
    "images": ["url"],
    "inStock": true,
    "features": ["string"],
    "ingredients": ["string"],
    "usage": "string",
    "warnings": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### POST /api/products (Admin Only)
Create a new product.

**Request Body:**
```json
{
  "name": "string",
  "slug": "string",
  "description": "string",
  "longDescription": "string",
  "price": "decimal",
  "categoryId": 1,
  "images": ["url"],
  "inStock": true,
  "features": ["string"],
  "ingredients": ["string"]
}
```

### PUT /api/products/:id (Admin Only)
Update a product.

**Request Body:**
Same as POST /api/products

### DELETE /api/products/:id (Admin Only)
Delete a product.

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Cart Endpoints

### GET /api/cart
Get the current user's cart.

**Response:**
```json
{
  "success": true,
  "cart": {
    "id": "string",
    "userId": "string",
    "items": [
      {
        "id": "string",
        "productId": 1,
        "quantity": 1,
        "price": "decimal",
        "product": {
          "name": "string",
          "image": "url"
        }
      }
    ],
    "total": "decimal",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### POST /api/cart/items
Add item to cart.

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 1
}
```

### PUT /api/cart/items/:id
Update cart item quantity.

**Request Body:**
```json
{
  "quantity": 2
}
```

### DELETE /api/cart/items/:id
Remove item from cart.

---

## Order Endpoints

### GET /api/orders
List user's orders.

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `status` (string) - Filter by status

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "string",
      "orderNumber": "string",
      "userId": "string",
      "items": [...],
      "subtotal": "decimal",
      "tax": "decimal",
      "shipping": "decimal",
      "total": "decimal",
      "status": "pending | processing | shipped | delivered | cancelled",
      "shippingAddress": {...},
      "createdAt": "date"
    }
  ],
  "pagination": {...}
}
```

### GET /api/orders/:id
Get order details.

### POST /api/checkout
Create a new order from cart.

**Request Body:**
```json
{
  "shippingAddress": {
    "name": "string",
    "address1": "string",
    "address2": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string"
  },
  "paymentMethodId": "string"
}
```

---

## User Endpoints

### GET /api/users/profile
Get current user profile.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "user | admin",
    "emailVerified": "date | null",
    "createdAt": "date"
  }
}
```

### PUT /api/users/profile
Update user profile.

**Request Body:**
```json
{
  "name": "string",
  "email": "string"
}
```

### PUT /api/users/password
Change user password.

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

---

## Payment Endpoints

### POST /api/payments/create-intent
Create Stripe payment intent.

**Request Body:**
```json
{
  "amount": 1000,
  "currency": "usd"
}
```

**Response:**
```json
{
  "success": true,
  "clientSecret": "string"
}
```

### POST /api/payments/webhook
Stripe webhook endpoint for payment events.

---

## Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| name | varchar(255) | User's display name |
| email | varchar(255) | Unique email address |
| password | varchar(255) | Hashed password |
| role | enum | user, admin |
| emailVerified | timestamp | Email verification date |
| image | varchar(255) | Profile image URL |
| createdAt | timestamp | Account creation date |
| updatedAt | timestamp | Last update date |

### Products Table
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| name | varchar(255) | Product name |
| slug | varchar(255) | URL-friendly name |
| description | text | Short description |
| longDescription | text | Detailed description |
| price | decimal(10,2) | Product price |
| categoryId | integer | Foreign key to categories |
| images | jsonb | Array of image URLs |
| inStock | boolean | Stock availability |
| features | jsonb | Product features array |
| ingredients | jsonb | Ingredients array |
| createdAt | timestamp | Creation date |
| updatedAt | timestamp | Last update date |

### Orders Table
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| orderNumber | varchar(255) | Unique order number |
| userId | integer | Foreign key to users |
| subtotal | decimal(10,2) | Order subtotal |
| tax | decimal(10,2) | Tax amount |
| shipping | decimal(10,2) | Shipping cost |
| total | decimal(10,2) | Total amount |
| status | enum | Order status |
| shippingAddress | jsonb | Shipping details |
| createdAt | timestamp | Order date |

### Cart Items Table
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| userId | integer | Foreign key to users |
| productId | integer | Foreign key to products |
| quantity | integer | Item quantity |
| createdAt | timestamp | Added date |

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

## Rate Limiting

Default rate limits:
- **Anonymous users:** 100 requests per 15 minutes
- **Authenticated users:** 1000 requests per 15 minutes
- **Admin users:** No rate limit

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1637001600
```

---

## Authentication Requirements

| Endpoint | Auth Required | Admin Only |
|----------|--------------|------------|
| GET /api/products | No | No |
| POST /api/products | Yes | Yes |
| PUT /api/products/:id | Yes | Yes |
| DELETE /api/products/:id | Yes | Yes |
| GET /api/cart | Yes | No |
| POST /api/cart/items | Yes | No |
| GET /api/orders | Yes | No |
| POST /api/checkout | Yes | No |
| GET /api/users/profile | Yes | No |
| PUT /api/users/profile | Yes | No |

---

## Pagination

All list endpoints support pagination:

**Request:**
```
GET /api/products?page=2&limit=20
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

## Webhooks

### Stripe Webhooks
Endpoint: `POST /api/payments/webhook`

Events handled:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `checkout.session.completed`
- `invoice.payment_succeeded`

Webhook signature verification required.

---

## CORS Configuration

Allowed origins:
- Development: `http://localhost:3000`
- Production: `https://app.betterbeing.com`

Allowed methods: `GET, POST, PUT, DELETE, OPTIONS`

Allowed headers: `Content-Type, Authorization, X-Requested-With`