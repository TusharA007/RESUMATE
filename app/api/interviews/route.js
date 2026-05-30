import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getInterviewsCollection } from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ interviews: [] });

  const interviews = await getInterviewsCollection();
  const data = await interviews.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(20).toArray();
  return NextResponse.json({ interviews: data.map((item) => ({ ...item, _id: String(item._id) })) });
}
