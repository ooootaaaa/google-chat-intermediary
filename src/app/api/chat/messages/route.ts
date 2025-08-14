// file: app/api/chat/messages/route.ts
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
    const messageText = event.message.text || '';

    // ★★★ Supabaseのテーブルに通知データを書き込む ★★★
    const { error } = await supabase
      .from('notifications')
      .insert({ 
        message: messageText, 
        user_id: 'test_user' // 今はテスト用に固定
      });

    if (error) throw error;

    console.log(`✅ Notification saved to Supabase: "${messageText}"`);
    return NextResponse.json({});
  } catch (error) {
    console.error('Error saving to Supabase:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}