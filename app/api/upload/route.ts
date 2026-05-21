import { NextResponse } from 'next/server';
import { ECHO_MEDIA_BUCKET, getSupabaseAdmin, isSupabaseServerConfigured } from '@/lib/supabase/admin';

function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; contentType: string; ext: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('Invalid data URL');
  const contentType = match[1];
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  return { buffer: Buffer.from(match[2], 'base64'), contentType, ext };
}

export async function POST(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ error: 'Cloud storage not configured' }, { status: 503 });
  }

  try {
    const form = await request.formData();
    const file = form.get('file');
    const dataUrl = form.get('dataUrl');

    let buffer: Buffer;
    let contentType: string;
    let ext: string;

    if (file instanceof File) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only images allowed' }, { status: 400 });
      }
      if (file.size > 4 * 1024 * 1024) {
        return NextResponse.json({ error: 'Image must be under 4MB' }, { status: 400 });
      }
      buffer = Buffer.from(await file.arrayBuffer());
      contentType = file.type;
      ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    } else if (typeof dataUrl === 'string') {
      const parsed = dataUrlToBuffer(dataUrl);
      buffer = parsed.buffer;
      contentType = parsed.contentType;
      ext = parsed.ext;
      if (buffer.length > 4 * 1024 * 1024) {
        return NextResponse.json({ error: 'Image must be under 4MB' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(ECHO_MEDIA_BUCKET).upload(path, buffer, {
      contentType,
      upsert: false,
    });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(ECHO_MEDIA_BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
