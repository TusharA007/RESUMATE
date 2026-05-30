import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getInterviewsCollection } from '@/lib/mongodb';
import { generateFeedback } from '@/lib/mock-ai';
import { createInterviewRecord } from '@/models/interview';

export const runtime = 'nodejs';

export async function POST(request) {
  const session = await auth();
  const body = await request.json();
  const feedback = generateFeedback(body.transcript || '');

  if (session?.user?.id && process.env.MONGODB_URI) {
    try {
      const interviews = await getInterviewsCollection();
      await interviews.insertOne(createInterviewRecord({
        userId: session.user.id,
        config: body.config || {},
        transcript: body.transcript || '',
        feedback,
        durationSeconds: body.durationSeconds || 0
      }));
    } catch (error) {
      console.error('Interview feedback generated but could not be saved.', error);
    }
  }

  return NextResponse.json(feedback);
}
