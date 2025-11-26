import { NextResponse } from 'next/server';
import { startPinger } from '@/lib/pinger';
import { pingerManager } from '@/lib/pinger-manager';

export async function GET() {
  if (!pingerManager.isPingerStarted()) {
    startPinger();
  }
  return NextResponse.json({ message: "Pinger service is active." });
}
