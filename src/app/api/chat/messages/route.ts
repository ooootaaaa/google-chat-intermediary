import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabaseのクライアントを初期化
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const event = await request.json();
    console.log('Received raw event:', JSON.stringify(event, null, 2));

    // ★★★ 実際のデータ構造に合わせて判定ロジックを修正 ★★★
    // event.chat.messagePayload.message のパスを安全にたどる
    const message = event.chat?.messagePayload?.message;

    if (message) {
      // メッセージ情報が存在する場合
      const messageText = message.text || '';

      const { error } = await supabase
        .from('notifications')
        .insert({
          message: messageText,
          user_id: 'test_user' // 今はテスト用に固定
        });

      if (error) throw error;

      console.log(`✅ Message event processed and saved to Supabase: "${messageText}"`);
    } else {
      // メッセージ情報が存在しない場合（スペースへの追加など）
      console.log(`✅ Received an event without a message payload.`);
    }

    // Google Chatには必ず何らかの応答を返す
    return NextResponse.json({});

  } catch (error) {
    console.error('Error processing request:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}