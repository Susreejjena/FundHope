# FundHope - Crowdfunding Platform

FundHope is a modern crowdfunding platform that allows users to create and donate to fundraising campaigns for various causes.

## Features

- User authentication and profile management
- Campaign creation and management
- Campaign discovery with filtering and search
- Secure donations via PayPal
- Responsive design for all devices

## Tech Stack

### Frontend

- React 19
- React Router v7
- Tailwind CSS
- Framer Motion for animations
- Axios for API requests

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- PayPal integration for payments
- Multer for file uploads

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- PayPal Developer Account (for payment integration)

### Installation

1. Clone the repository

```
git clone https://github.com/yourusername/fundhope.git
cd fundhope
```

2. Install backend dependencies

```
cd backend
npm install
```

3. Install frontend dependencies

```
cd ../frontend
npm install
```

4. Set up environment variables
   - Backend: Make sure the `.env` file in the backend directory contains:

```
NODE_ENV=development
PORT=8080
MONGO_URI=mongodb://coriuday:12345679@127.0.0.1:27017/FHDB?authSource=admin
JWT_SECRET=coriuday12345679
```

- Frontend: Make sure the `.env` file in the frontend directory contains:

```
VITE_API_URL=http://localhost:8080/api
VITE_PAYPAL_CLIENT_ID=AbAU6QGq3H0-oBa0tvzfxPUta-0IgH152BhvJY2Rq7rQPMANRQMlVdvb-_p6h1z8PuMyC-Dm-NVCI8FA
```

### Running the Application

1. Start the backend server

```
cd backend
npm run dev
```

2. Start the frontend development server

```
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## API Documentation

The API provides the following endpoints:

### Authentication

- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Campaigns

- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign by ID
- `POST /api/campaigns` - Create a new campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `POST /api/campaigns/:id/updates` - Add campaign update

### Donations

- `POST /api/donations` - Create a new donation
- `GET /api/donations` - Get user donations
- `GET /api/donations/:id` - Get donation by ID
- `GET /api/donations/campaign/:id` - Get campaign donations

### Payments

- `GET /api/payments/paypal/config` - Get PayPal client ID
- `POST /api/payments/paypal/create-order` - Create PayPal order
- `POST /api/payments/paypal/capture-order` - Capture PayPal payment

## License

This project is licensed under the MIT License.
