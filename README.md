# Roastify

Roastify is a small web app that analyzes a user's Spotify top tracks and generates a short, sarcastic roast based purely on their music taste. The app uses Spotify OAuth for authentication, retrieves profile and listening data using the Spotify Web API, and sends that data to a model through OpenRouter to generate the roast. The UI is designed to resemble the clean, minimal feel of Spotify.

## Stack

- Next.js (App Router)
- Tailwind CSS
- OpenRouter for text generation
- Spotify Web API

## Spotify Authentication Flow

The app implements the Spotify Authorization Code Flow.

1. User clicks the login button, which redirects to `/api/login`.
2. `/api/login` generates a random state, sets it in an HTTP-only cookie, and redirects the user to Spotify’s authorization page.
3. Spotify redirects back to `/api/callback` with `code` and `state`.
4. The callback route validates the returned state, exchanges the code for an access token and refresh token, stores them in cookies, and redirects the user back to the homepage.
5. The frontend calls `/api/user` and `/api/top-tracks` to fetch the user profile and the user’s top tracks from Spotify.

## API Routes

### `/api/login`
Starts the OAuth flow and sets the `spotify_auth_state` cookie.

### `/api/callback`
Validates the state, exchanges the code for access and refresh tokens, writes them into secure cookies, and sends the user back to the main page.

### `/api/user`
Fetches and returns the user’s Spotify profile (display name, avatar, follower count, and profile URL).

### `/api/top-tracks`
Fetches the user's long-term top tracks using the stored access token.

### `/api/roast`
Receives the user's track list, constructs a short prompt that restricts hyphens and avoids personal insults, then calls OpenRouter to generate a one or two-line roast.
