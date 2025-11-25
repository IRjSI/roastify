import { NextResponse } from "next/server";

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const redirect_uri = process.env.REDIRECT_URI!;

function generateRandomString(length: number) {
  return [...Array(length)]
    .map(() => Math.floor(Math.random() * 36).toString(36))
    .join("");
}

export async function GET() {
    let state = generateRandomString(16);

    const params = new URLSearchParams({
        response_type: "code",
        client_id,
        redirect_uri,
        scope: "user-read-email user-read-private user-top-read",
        state,
    });

   const response = NextResponse.redirect(
        `https://accounts.spotify.com/authorize?${params.toString()}`
    );

    response.cookies.set("spotify_auth_state", state, {
        httpOnly: true,
        secure: process.env.ENV !== "development",
        sameSite: "lax",
        path: "/",
    });

    return response;
}