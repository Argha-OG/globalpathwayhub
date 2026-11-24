import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { getCurrentUser } from '@/lib/auth';
import { uploadToR2 } from '@/lib/r2';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || typeof file !== 'object' || !file.name) {
      return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
    }

    const contentType = file.type || 'image/jpeg';
    if (!contentType.startsWith('image/')) {
      return NextResponse.json(
        { message: 'Only image files (JPG, PNG, WebP, GIF) are allowed' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'Image size must be 5 MB or less' },
        { status: 400 }
      );
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${cleanName}`;
    const r2Key = `guides/${uniqueName}`;

    try {
      const publicUrl = await uploadToR2(buffer, r2Key, contentType);
      return NextResponse.json({ success: true, url: publicUrl, r2Key });
    } catch (r2Err: any) {
      console.warn('[Guides Upload] R2 unavailable, saving locally:', r2Err?.message);
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'guides');
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, uniqueName), buffer);
        return NextResponse.json({
          success: true,
          url: `/uploads/guides/${uniqueName}`,
          r2Key: null,
        });
      } catch (fsErr: any) {
        console.warn('[Guides Upload] Local disk write failed, using data URL fallback:', fsErr?.message);
        const base64Url = `data:${contentType};base64,${buffer.toString('base64')}`;
        return NextResponse.json({ success: true, url: base64Url, r2Key: null });
      }
    }
  } catch (err: any) {
    console.error('Error uploading guide image:', err);
    return NextResponse.json(
      { message: err.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
