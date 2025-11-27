import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  // const access_token = cookieStore.get("spotify_access_token")?.value;
  // const access_token = cookieStore.get("next-auth.session-token")?.value;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log(token);

  if (!token || !token.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // if (!access_token) {
  //   return NextResponse.json(
  //     { error: "Not authenticated" },
  //     { status: 401 }
  //   );
  // }

  const res = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10",
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
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
