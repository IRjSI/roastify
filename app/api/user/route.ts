import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("spotify_access_token")?.value;

    console.log(access_token);

    const res = await fetch(
        "https://api.spotify.com/v1/me",
        {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        }
    );
    console.log(res);

    const data = await res.json();

    console.log(data);

    return NextResponse.json({ data });
}