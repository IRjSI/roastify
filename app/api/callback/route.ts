import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const redirect_uri = process.env.REDIRECT_URI!;

export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const cookieStore = await cookies();
    const storedState = cookieStore.get("spotify_auth_state")?.value;

    if (!state || state !== storedState) {
        return NextResponse.redirect(
        new URL("/?error=state_mismatch", req.url)
        );
    }

    const tokenRes = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
        code: code!,
        redirect_uri,
        grant_type: "authorization_code",
        }).toString(),
        {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
            "Basic " +
            Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
        },
        }
    );

    const { access_token, refresh_token } = tokenRes.data;

    const response = NextResponse.redirect(process.env.REDIRECT!);

    response.cookies.set("spotify_access_token", access_token, {
        httpOnly: true,
        secure: process.env.ENV !== "development",
        sameSite: "lax",
        path: "/"
    });

    response.cookies.set("spotify_refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.ENV !== "development",
        sameSite: "lax",
        path: "/"
    });


    return response;
}