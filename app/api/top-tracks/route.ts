import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("spotify_access_token")?.value;

  console.log(access_token)

  if (!access_token) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const res = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const data = await res.json().catch(() => null);

  if (!data || typeof data !== "object") {
    return NextResponse.json(
      { error: "Invalid response from Spotify" },
      { status: 500 }
    );
  }

  if (data.error) {
    return NextResponse.json(data, { status: res.status });
  }

  return NextResponse.json({
    tracks: data.items || [],
  });
}
