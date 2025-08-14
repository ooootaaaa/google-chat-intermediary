import { NextResponse } from 'next/server';

export async function GET() {
  // { status: 'ok' } というJSONを返すだけのシンプルなAPI
  return NextResponse.json({ status: 'ok' });
}