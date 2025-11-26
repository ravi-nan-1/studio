import { NextResponse } from 'next/server';

const PING_URL = "https://pdf-tools-dljh.onrender.com/ping";

// This is a simple in-memory flag to ensure the initial ping is only done once per instance.
let initialPingDone = false;

async function pingService() {
  try {
    // We only need to ping if the service is idle.
    // The main conversion requests will keep it warm.
    // This is just to wake it up on the first visit to a new instance.
    if (initialPingDone) return;
    
    console.log(`Pinging backend service at ${PING_URL} to wake it up.`);
    await fetch(PING_URL, {
      method: 'GET',
      headers: { 'accept': 'application/json' },
    });
    initialPingDone = true;
    console.log("Backend service should be warm now.");
  } catch (error) {
    console.error("Error during initial ping:", error);
  }
}

export async function GET() {
  // Fire-and-forget the ping. We don't need to wait for it.
  pingService();
  return NextResponse.json({ message: "Ping request sent." });
}
