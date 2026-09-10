import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://paper-api.alpaca.markets/v2/positions",
      {
        headers: {
          "APCA-API-KEY-ID": process.env.ALPACA_API_KEY!,
          "APCA-API-SECRET-KEY": process.env.ALPACA_SECRET_KEY!,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Alpaca request failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to connect to Alpaca" },
      { status: 500 }
    );
  }
}