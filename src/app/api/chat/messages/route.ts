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
    const message = event.chat?.messagePayload?.message;

    // メッセージイベントの場合のみ処理を実行
    if (message) {
      const messageText: string = message.text || '';
      const senderEmail: string = message.sender?.email || '';

      // 1. Supabaseから全ての通知ルールを取得
      const { data: rules, error: rulesError } = await supabase
        .from('notification_rules')
        .select('user_id, rule_type, rule_value');
      
      if (rulesError) throw rulesError;

      // 2. このメッセージに合致するルールを持つユーザーIDを特定する
      const usersToNotify = new Set<string>();
      if (rules) {
        for (const rule of rules) {
          // ルールタイプが'sender'で、差出人メールアドレスが一致する場合
          if (rule.rule_type === 'sender' && rule.rule_value === senderEmail) {
            usersToNotify.add(rule.user_id);
          }
          // ルールタイプが'keyword'で、メッセージ本文にキーワードが含まれる場合
          if (rule.rule_type === 'keyword' && messageText.includes(rule.rule_value)) {
            usersToNotify.add(rule.user_id);
          }
        }
      }
      
      // 3. 該当するユーザーがいれば、そのユーザー宛の通知をDBに書き込む
      if (usersToNotify.size > 0) {
        const newNotifications = Array.from(usersToNotify).map(userId => ({
          message: messageText,
          user_id: userId,
        }));

        const { error: insertError } = await supabase
          .from('notifications')
          .insert(newNotifications);
        
        if (insertError) throw insertError;
        
        console.log(`✅ Notified ${usersToNotify.size} user(s).`);
      }
    }

    return NextResponse.json({});
  } catch (error) {
    console.error('Error processing request:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}