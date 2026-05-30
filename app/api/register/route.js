import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/password';
import { createUserAccount, findUserByEmail } from '@/lib/users';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!name || !email || password.length < 8) {
      return NextResponse.json({ error: 'Enter name, email, and password with at least 8 characters.' }, { status: 400 });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) return NextResponse.json({ error: 'An account already exists for this email.' }, { status: 409 });

    await createUserAccount({
      name,
      email,
      passwordHash: hashPassword(password)
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not create account.' }, { status: 500 });
  }
}
