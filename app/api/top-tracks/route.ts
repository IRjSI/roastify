import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("spotify_access_token")?.value;

  if (!access_token) {
    return NextResponse.json(
      { error: "Not authenticated" },
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

  // Spotify error response also must be parsed
  const data = await res.json().catch(() => null);

  // If Spotify returned a non-JSON response
  if (!data || typeof data !== "object") {
    return NextResponse.json(
      { error: "Invalid response from Spotify" },
      { status: 500 }
    );
  }

  // If token expired
  if (data.error) {
    return NextResponse.json(data, { status: res.status });
  }

  // Safe return
  return NextResponse.json({
    tracks: data.items || [],
  });
}
