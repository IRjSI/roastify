import { NextResponse } from "next/server";

let client_id = 'ecd44eba401a48c48e8e5b770ebfb62b';
const redirect_uri = "http://127.0.0.1:3000/api/callback";

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
        scope: "app-remote-control user-top-read",
        state,
    });

   const response = NextResponse.redirect(
        `https://accounts.spotify.com/authorize?${params.toString()}`
    );

    response.cookies.set("spotify_auth_state", state, {
        httpOnly: true,
        secure: false,   // development only
        sameSite: "lax",
        path: "/",
    });

    return response;
}