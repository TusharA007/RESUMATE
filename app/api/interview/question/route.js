import { NextResponse } from 'next/server';
import { generateInterviewQuestion } from '@/lib/mock-ai';

export async function POST(request) {
  const body = await request.json();
  const question = generateInterviewQuestion(body.config || {}, body.previousAnswer || '');
  return NextResponse.json({ question });
}
