import { NextResponse } from 'next/server';
import { LittleWorldPost } from '@/lib/types';
import { getSupabaseAdmin, isSupabaseServerConfigured } from '@/lib/supabase/admin';
import { littleWorldFromRow, littleWorldToRow } from '@/lib/supabase/mappers';

export async function GET() {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ error: 'Cloud not configured' }, { status: 503 });
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('little_world_posts')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const posts = (data ?? []).map(littleWorldFromRow);
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ error: 'Cloud not configured' }, { status: 503 });
  }
  const post = (await request.json()) as LittleWorldPost;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('little_world_posts').upsert(littleWorldToRow(post));
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
