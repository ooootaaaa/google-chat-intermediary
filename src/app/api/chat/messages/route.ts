// file: app/api/chat/messages/route.ts

import { NextResponse } from 'next/server';

// Google ChatからのPOSTリクエストを処理する関数
export async function POST(request: Request) {
  try {
    // 送られてきたリクエストの本体（body）をJSONとして解析
    const event = await request.json();

    // デバッグ用に、受け取った内容をコンソールログに出力
    console.log('Received from Google Chat:', JSON.stringify(event, null, 2));

    // とりあえずGoogleに「受け取りました」という空の応答を返す
    // 将来的にはここでメッセージカードなどを返すこともできる
    return NextResponse.json({});

  } catch (error) {
    console.error('Error processing request:', error);
    // エラーが発生した場合はサーバーエラーを返す
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}