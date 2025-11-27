# Roastify

A web app that roasts your music taste based on your Spotify listening history. Sign in with Spotify, let AI analyze your top tracks, and get hilariously roasted for your questionable music choices.

## Features

- **Spotify OAuth Integration** - Secure authentication with NextAuth
- **Music Taste Analysis** - Fetches your top tracks from Spotify Web API
- **AI-Powered Roasts** - Generates witty, sarcastic roasts via OpenRouter
- **Spotify-Inspired UI** - Clean, minimal design matching Spotify's aesthetic

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js with Spotify Provider
- **AI Generation:** OpenRouter API
- **Data Source:** Spotify Web API

## Getting Started

### Prerequisites

- Node.js 18+
- Spotify Developer Account
- OpenRouter API Key

### Installation

1. Clone the repository
```bash
git clone https://github.com/irjsi/roastify.git
cd roastify
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file:
```env
# Spotify OAuth
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Redirects
REDIRECT_URI = "http://127.0.0.1:3000/api/callback"
REDIRECT = "http://127.0.0.1:3000"

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL="http://127.0.0.1:3000"

# OpenRouter
OPEN_ROUTER_TOKEN=your_openrouter_api_key
```

4. Configure Spotify App

- Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- Create a new app
- Add redirect URI: `http://127.0.0.1:3000/api/auth/callback/spotify` (spotify doesn't allow 'localhost')
- Copy Client ID and Client Secret to `.env.local`

5. Run the development server
```bash
npm run dev
```

Visit `http://127.0.0.1:3000` to see the app.

## Project Structure
```
roastify/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth configuration
│   │   ├── top-tracks/             # Fetch user's top tracks
│   │   └── roast/                  # Generate AI roast
│   ├── page.tsx                    # Main page
│   └── layout.tsx
```

## API Routes

### `/api/auth/[...nextauth]`
Handles Spotify OAuth flow with NextAuth.js

### `/api/top-tracks`
Fetches user's long-term top 10 tracks from Spotify Web API.

**Response:**
```json
{
  "tracks": [
    {
      "name": "Track Name",
      "artists": [{"name": "Artist"}],
      "album": {"name": "Album"}
    }
  ]
}
```

### `/api/roast`
Generates a roast based on user's music taste using OpenRouter.

**Request:**
```json
{
  "tracks": ["Track 1 - Artist", "Track 2 - Artist", ...]
}
```

**Response:**
```json
{
  "roast": "Your music taste is..."
}
```

## Known Issues & Solutions

### NextAuth Token Decryption Issue

**Problem:** `getToken()` returns `null` in API routes despite valid session cookie.

**Root Cause:** Cookie name mismatch between NextAuth config and `getToken()` default behavior.

**Solution:**
```typescript
const token = await getToken({ 
  req, 
  secret: process.env.NEXTAUTH_SECRET,
  secureCookie: true,
  cookieName: 'next-auth.session-token', // Explicitly specify cookie name
})
```

### Spotify OAuth Challenges

#### 1. Development Mode Restrictions
- Spotify apps start in Development Mode with a 25-user limit
- Only manually allowlisted users (by email) can authenticate
- **As of May 2025:** Extended Quota Mode requires organization status (not available to individuals)

**Workaround for personal projects:**
- Add up to 25 users manually in Spotify Developer Dashboard → User Management
- Suitable for friend groups or portfolio demonstrations

#### 2. Cross-Browser Cookie Issues
Some browsers (Safari, Firefox, Brave) block cookies during OAuth redirects by default.

**Solution:**
```typescript
// In NextAuth config
cookies: {
  sessionToken: {
    name: 'next-auth.session-token',
    options: {
      httpOnly: true,
      sameSite: 'lax',  // Critical for OAuth flow
      path: '/',
      secure: true      // Required in production
    }
  }
}
```

#### 3. Token Expiry
Spotify access tokens expire after 1 hour. Implement token refresh logic for production:
```typescript
async function refreshAccessToken(token) {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
  })
  // Handle response...
}
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Update Spotify redirect URI to: `https://yourdomain.com/api/auth/callback/spotify`
5. Deploy

**Important:** After changing environment variables, redeploy for changes to take effect.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SPOTIFY_CLIENT_ID` | Spotify app client ID |
| `SPOTIFY_CLIENT_SECRET` | Spotify app client secret |
| `NEXTAUTH_SECRET` | Random string for encrypting tokens |
| `NEXTAUTH_URL` | Your app URL (e.g., `https://yourdomain.com`) |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI generation |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Acknowledgments

- Spotify Web API for music data
- NextAuth.js for authentication
- OpenRouter for AI generation