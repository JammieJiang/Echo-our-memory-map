import { NextResponse } from 'next/server';
import { BBPost } from '@/lib/types';
import { getSupabaseAdmin, isSupabaseServerConfigured } from '@/lib/supabase/admin';
import { bbFromRow, bbToRow } from '@/lib/supabase/mappers';

export async function GET() {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ error: 'Cloud not configured' }, { status: 503 });
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('bb_posts')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const posts = (data ?? []).map(bbFromRow);
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ error: 'Cloud not configured' }, { status: 503 });
  }
  const post = (await request.json()) as BBPost;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('bb_posts').upsert(bbToRow(post));
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
