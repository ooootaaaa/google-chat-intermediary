// file: app/api/chat/messages/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const event = await request.json();
    console.log('Received raw event:', JSON.stringify(event, null, 2));

    // ★★★ ここから下を追加 ★★★
    // eventオブジェクトの中から、メッセージのテキスト部分を抜き出す
    // event.message.text には "@MyApp こんにちは" のような形でテキストが入っている
    const messageText = event.message.text || ''; 
    const senderName = event.user.displayName || 'Unknown User';

    // 抜き出した情報をログに出力して確認する
    console.log(`✅ Parsed Info: [${senderName}] said "${messageText}"`);
    // ★★★ ここまで追加 ★★★

    return NextResponse.json({});

  } catch (error) {
    console.error('Error processing request:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}