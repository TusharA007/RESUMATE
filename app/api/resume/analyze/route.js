import { NextResponse } from 'next/server';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import { analyzeResume } from '@/lib/mock-ai';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume');
    let resumeText = String(formData.get('resumeText') || '');

    if (file && typeof file.arrayBuffer === 'function') {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (file.type === 'application/pdf' || file.name?.endsWith('.pdf')) {
        const parsed = await pdf(buffer);
        resumeText = parsed.text;
      } else {
        resumeText = buffer.toString('utf8');
      }
    }

    if (!resumeText.trim()) {
      return NextResponse.json({ error: 'Upload a resume or paste resume text.' }, { status: 400 });
    }

    return NextResponse.json(analyzeResume(resumeText, String(formData.get('targetRole') || '')));
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Resume analysis failed.' }, { status: 500 });
  }
}
