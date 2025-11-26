"use server";

const PING_URL = "https://pdf-tools-dljh.onrender.com/ping";
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes

let isPinging = false;

async function pingService() {
  try {
    const response = await fetch(PING_URL, {
      method: 'GET',
      headers: { 'accept': 'application/json' },
    });
    if (response.ok) {
      console.log(`Successfully pinged service at ${new Date().toISOString()}`);
    } else {
      console.error(`Failed to ping service. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error during ping:", error);
  }
}

export function startPinger() {
  if (isPinging) {
    console.log("Pinger is already running.");
    return;
  }

  console.log(`Starting pinger to hit ${PING_URL} every 5 minutes.`);
  // Immediately ping once to start, then set the interval.
  pingService();
  setInterval(pingService, PING_INTERVAL);
  isPinging = true;
}
