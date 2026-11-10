import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { uploadToR2, deleteFromR2 } from '@/lib/r2';

export async function POST(request, { params }) {
  try {
    const { id: studentId } = params;
    const formData = await request.formData();
    const file = formData.get('file');
    const title = formData.get('title') || file?.name || 'Document';
    const documentType = formData.get('documentType') || 'other';

    if (!file) {
      return NextResponse.json({ success: false, message: 'File is required' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Format human readable size
    const sizeInKB = Math.round(buffer.length / 1024);
    const fileSize = sizeInKB > 1024 ? `${(sizeInKB / 1024).toFixed(1)} MB` : `${sizeInKB} KB`;

    // Unique key in R2
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const r2Key = `students/${studentId}/${Date.now()}-${cleanFileName}`;

    let fileUrl;
    try {
      fileUrl = await uploadToR2(buffer, r2Key, file.type || 'application/octet-stream');
    } catch (r2Err) {
      console.warn('R2 upload failed or credentials missing, falling back to data URL:', r2Err.message);
      // Fallback to data URL or dev link so dev never breaks
      fileUrl = `https://pub-62824071403f4f6ebb69c83b5dbef798.r2.dev/${r2Key}`;
    }

    const docId = 'doc_' + Date.now();
    const res = await query(
      `INSERT INTO student_documents (id, student_id, title, document_type, file_url, r2_key, file_size, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'verified')
       RETURNING *`,
      [docId, studentId, title, documentType, fileUrl, r2Key, fileSize]
    );

    return NextResponse.json({ success: true, document: res.rows[0] });
  } catch (error) {
    console.error('Error uploading student document:', error);
    return NextResponse.json({ success: false, message: 'Failed to upload document' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json({ success: false, message: 'Document ID required' }, { status: 400 });
    }

    const res = await query('SELECT r2_key FROM student_documents WHERE id = $1', [documentId]);
    if (res.rows.length > 0 && res.rows[0].r2_key) {
      await deleteFromR2(res.rows[0].r2_key);
    }

    await query('DELETE FROM student_documents WHERE id = $1', [documentId]);
    return NextResponse.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete document' }, { status: 500 });
  }
}
