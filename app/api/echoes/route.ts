import { NextResponse } from 'next/server';
import { Echo } from '@/lib/types';
import { getSupabaseAdmin, isSupabaseServerConfigured } from '@/lib/supabase/admin';
import { echoFromRow, echoToRow } from '@/lib/supabase/mappers';

export async function GET() {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ error: 'Cloud not configured' }, { status: 503 });
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('echoes')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const echoes = (data ?? []).map(echoFromRow);
  return NextResponse.json({ echoes });
}

export async function POST(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ error: 'Cloud not configured' }, { status: 503 });
  }
  const echo = (await request.json()) as Echo;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('echoes').upsert(echoToRow(echo));
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ error: 'Cloud not configured' }, { status: 503 });
  }
  const { echoes } = (await request.json()) as { echoes: Echo[] };
  const supabase = getSupabaseAdmin();
  const rows = echoes.map(echoToRow);
  if (rows.length === 0) {
    await supabase.from('echoes').delete().gte('timestamp', 0);
    return NextResponse.json({ ok: true });
  }
  const { error } = await supabase.from('echoes').upsert(rows);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ error: 'Cloud not configured' }, { status: 503 });
  }
  const id = new URL(request.url).searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('echoes').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
