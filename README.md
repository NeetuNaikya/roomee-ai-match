# Roomee AI Match

> **AI-powered roommate matching for women, with secure profile creation and government ID verification.**

## Features

- ✨ AI-powered roommate matching algorithm
- 👩‍🤝‍👩 Women-only platform for safety and comfort
- 🛡️ Secure Gmail authentication (Google OAuth 2.0)
- 🪪 Government ID verification (Aadhaar, Passport, etc.)
- 📋 Profile creation with photo upload and personal details
- 🏠 Room and roommate suggestions with compatibility scores
- 🔒 Modern, beautiful UI with responsive design

## Screenshots

![Login Page](public/placeholder.svg)
![Profile Creation](public/placeholder.svg)
![Matches Page](public/placeholder.svg)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or bun
- Firebase project (for authentication and database)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Muneerali199/roomee-ai-match.git
   cd roomee-ai-match
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   bun install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your Firebase credentials.
   - Example:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
     ```

4. **Start the development server:**
   ```sh
   npm run dev
   # or
   bun run dev
   ```

5. **Open the app:**
   - Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
roomee-ai-match/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images and media
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Firebase, database, and utility logic
│   ├── pages/             # Main app pages (Login, Profile, Matches, etc.)
│   └── ...
├── .env                   # Environment variables
├── package.json           # Project metadata and scripts
├── tailwind.config.ts     # Tailwind CSS config
├── vite.config.ts         # Vite config
└── ...
```

## Usage

1. **Sign in with Gmail** (only Gmail accounts allowed)
2. **Complete your profile** with photo and government ID verification
3. **Get matched** with compatible roommates and view room suggestions

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Firebase (Auth, Firestore)
- Lucide React Icons

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
