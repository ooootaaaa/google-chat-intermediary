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

    // ★★★ イベントタイプによって処理を分岐させる ★★★
    if (event.type === 'MESSAGE') {
      // メッセージイベントの場合のみ、メッセージを処理する
      const messageText = event.message?.text || ''; // ?.で安全にアクセス
      
      const { error } = await supabase
        .from('notifications')
        .insert({ 
          message: messageText, 
          user_id: 'test_user'
        });

      if (error) throw error;
      
      console.log(`✅ MESSAGE event processed and saved to Supabase.`);

    } else if (event.type === 'ADDED_TO_SPACE') {
      // スペース追加イベントの場合
      console.log(`✅ ADDED_TO_SPACE event received. No message to process.`);
      // ここで「追加ありがとうございます！」のようなウェルカムメッセージを返す処理を実装することも可能
    } else {
      // その他のイベントタイプ
      console.log(`✅ Received unhandled event type: ${event.type}`);
    }

    // Google Chatには必ず何らかの応答を返す（空のJSONでもOK）
    return NextResponse.json({});

  } catch (error) {
    console.error('Error processing request:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}