import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("spotify_access_token")?.value;

  if (!access_token) {
    return NextResponse.json(
      { error: "No access token. User not authenticated." },
      { status: 401 }
    );
  }

  const res = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const data = await res.json();

  return NextResponse.json(data.items);
}
