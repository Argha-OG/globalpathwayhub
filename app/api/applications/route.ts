import { NextResponse } from 'next/server';
import { query, formatApplication } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 8);
    const contentType = request.headers.get('content-type') || '';

    let fullName = '';
    let email = '';
    let phone = '';
    let country = 'Bangladesh';
    let universityId = '';
    let courseId = '';
    let payloadData: Record<string, any> = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      fullName = (formData.get('fullName') as string) || '';
      email = (formData.get('email') as string) || '';
      phone = (formData.get('phone') as string) || '';
      country = (formData.get('country') as string) || 'Bangladesh';
      universityId = (formData.get('universityId') as string) || '';
      courseId = (formData.get('courseId') as string) || '';

      const uploadedDocs: Record<string, string> = {};

      // Helper to upload files to R2 safely
      const tryUpload = async (field: string) => {
        const file = formData.get(field);
        if (file && typeof file === 'object' && 'name' in file && (file as File).size > 0) {
          try {
            const { uploadToR2 } = await import('@/lib/r2');
            const fileObj = file as File;
            const buffer = Buffer.from(await fileObj.arrayBuffer());
            const ext = fileObj.name.split('.').pop() || 'dat';
            const safeName = fileObj.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const key = `applications/${Date.now()}-${safeName}`;
            const url = await uploadToR2(buffer, key, fileObj.type || 'application/octet-stream');
            uploadedDocs[field] = url;
          } catch (r2Err) {
            console.warn(`Could not upload ${field} to R2, saving filename reference:`, r2Err);
            uploadedDocs[field] = (file as File).name;
          }
        }
      };

      await tryUpload('sscFile');
      await tryUpload('hscFile');
      await tryUpload('bsFile');
      await tryUpload('passportFile');
      await tryUpload('additionalFile');

      // Collect all text entries into payloadData
      formData.forEach((value, key) => {
        if (typeof value === 'string') {
          payloadData[key] = value;
        }
      });

      payloadData.uploadedDocuments = uploadedDocs;
    } else {
      payloadData = await request.json();
      fullName = payloadData.fullName || '';
      email = payloadData.email || '';
      phone = payloadData.phone || '';
      country = payloadData.country || 'Bangladesh';
      universityId = payloadData.universityId || '';
      courseId = payloadData.courseId || '';
    }

    if (!fullName || !phone || !email) {
      return NextResponse.json(
        { success: false, message: 'Name, Contact Number, and Email Address are mandatory.' },
        { status: 400 }
      );
    }

    const insertSql = `
      INSERT INTO applications (id, full_name, email, phone, country, university_id, course_id, status, data, submitted_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *
    `;

    const result = await query(insertSql, [
      id,
      fullName,
      email,
      phone,
      country,
      universityId || null,
      courseId || null,
      'pending',
      JSON.stringify(payloadData),
    ]);

    const newApplication = formatApplication(result.rows[0]);

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        data: newApplication,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error in POST /api/applications:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const result = await query('SELECT * FROM applications ORDER BY submitted_at DESC');
    const formatted = result.rows.map(formatApplication);
    return NextResponse.json(formatted);
  } catch (err: any) {
    console.error('Error in GET /api/applications:', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
