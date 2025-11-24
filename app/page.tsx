"use client"

import { useEffect, useState } from "react";

interface IUser {
  display_name: string;
  images: [
    {
      url: string;
    }
  ];
  external_urls: {
    spotify: string;
  };
}

export default function Home() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [roastText, setRoastText] = useState("");
  const [hasRoasted, setHasRoasted] = useState(false);

  async function getTopTracks() {
    const res = await fetch("/api/top-tracks");
    if (!res.ok) return;
    const json = await res.json();
    setData(json.tracks);
  }

  async function roast(tracks: any) {
    const res = await fetch("/api/roast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tracks })
    });

    const json = await res.json();
    setRoastText(json.roast.content);
    setHasRoasted(true);
  }

  const spotify_oauth = () => {
    window.location.href = "/api/login";
  };

  const get_user = async () => {
    const res = await fetch("/api/user");
    if (!res.ok) {
      setUser(null);
      return;
    }
    const data = await res.json();
    if (data.data.error) {
      setUser(null);
      return;
    }
    setUser(data.data);
  }

  useEffect(() => {
    get_user();
    getTopTracks();
  }, []);

  useEffect(() => {
    if (user && data && !hasRoasted) {
      roast(data);
    }
  }, [user, data, hasRoasted]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <button
          onClick={spotify_oauth}
          className="px-4 rounded-full bg-green-500 text-black font-bold text-xl shadow-lg hover:bg-green-400 transition flex items-center justify-center"
        >
          <img src="https://static.vecteezy.com/system/resources/previews/042/148/631/non_2x/spotify-logo-spotify-social-media-icon-free-png.png" className="w-24 h-24" alt="" />
          Login with Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white p-6">

      <div className="flex items-center gap-4 mb-6">
        {user?.images[0].url ? (
          <img
            src={user.images[0].url}
            alt="avatar"
            className="w-16 h-16 rounded-full border border-green-500"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-neutral-800" />
        )}

        <div>
          <h2 className="text-xl font-bold">{user?.display_name}</h2>
          <a
            href={user?.external_urls.spotify}
            target="_blank"
            className="text-green-400 text-sm underline"
          >
            View Spotify Profile
          </a>
        </div>
      </div>

      <div className="w-full max-w-xl bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-lg">
        <h1 className="text-2xl font-bold text-green-400 mb-4">
          Your Spotify Roast
        </h1>

        {!roastText ? (
          <div className="animate-pulse text-neutral-400">
            Generating roast...
          </div>
        ) : (
          <p className="whitespace-pre-line text-lg leading-relaxed">
            {roastText}
          </p>
        )}
      </div>
    </div>
  );
}
