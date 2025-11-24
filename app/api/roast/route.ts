import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { tracks } = await req.json();

    const prompt = `
      Roast this person's Spotify top tracks. 
      Make it funny, sarcastic, and playful. 
      Do NOT insult the person personally. Only roast the music taste and be brutal.
      Keep it short. Like one or two lines.
      
      CRITICAL FORMAT RULE:
        - Do NOT use hyphens (-) anywhere in the output.
        - Do NOT output bullet points.
        - Output must be a single sentence or two sentences.

        If you accidentally include a hyphen, rewrite the roast until NO hyphens exist.

        Your output must match this regex pattern: ^[^-]+$
        (Meaning: the output cannot contain a hyphen.)

      Tracks:
      ${tracks.map((t: any, i: number) => `${i + 1}. ${t.name} - ${t.artists[0].name}`).join("\n")}

      Roast:
    `;

    const HF_TOKEN = process.env.OPEN_ROUTER_TOKEN!;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://roastyfy.vercel.app",
        "X-Title": "Roastify App"
      },
      body: JSON.stringify({
        model: "nousresearch/hermes-2-pro-mistral",
        messages: [
          { role: "user", content: prompt }
        ],
        reasoning: {"enabled": true}
      }),
    });

    if (!response.ok) {
      const txt = await response.text();
      console.error("HF error:", txt);
      return NextResponse.json(
        { error: "HF Error", detail: txt },
        { status: 500 }
      );
    }

    const json = await response.json();
    const roast =
      json?.choices[0].message ??
      "Unable to generate roast.";

    return NextResponse.json({ roast });
  } catch(err) {
    console.error("API /roast error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
