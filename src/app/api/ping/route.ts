import { NextResponse } from 'next/server';
import { startPinger } from '@/lib/pinger';
import { pingerManager } from '@/lib/pinger-manager';

export async function GET() {
  if (!pingerManager.isPingerStarted()) {
    startPinger();
    pingerManager.setPingerStarted();
  }
  return NextResponse.json({ message: "Pinger service is active." });
}
