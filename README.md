# Parcel Delivery Backend

A Node.js Express backend API for parcel delivery management system.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT
- **Validation**: Zod
- **Real-time**: Socket.io
- **Payment**: Stripe
- **SMS**: Twilio
- **Email**: Nodemailer
- **File Storage**: AWS S3

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- npm or yarn

### Installation

```bash
# Install dependencies
yarn install

# Build the project
yarn build

# Start the server
yarn start
```

### Development

```bash
# Run in development mode with hot reload
yarn dev
```

## API Endpoints

### Base URL

```
http://localhost:5000/api/v1
```

### Available Modules

- **User** - User authentication and management
- **Auth** - Authentication (login, register, OTP)
- **Driver** - Driver management and tracking
- **Parcel** - Parcel booking and tracking
- **Payment** - Payment processing with Stripe
- **Refund** - Refund management
- **Notification** - Push notifications
- **Chat** - Real-time messaging
- **Review** - Driver and service reviews
- **Dashboard** - Analytics and statistics
- **Settings** - App configuration
- **Track Driver** - Real-time driver tracking

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket
```

## Project Structure

```
src/
├── app/
│   └── v1/
│       └── modules/       # Feature modules
├── config/                # Configuration files
├── db/                    # Database connection
├── middleware/            # Express middleware
├── socket/                # Socket.io setup
├── utils/                 # Utility functions
├── server.ts              # Entry point
└── express-app.ts         # Express app setup
```

## License

Private - Alivinoye Botswana
