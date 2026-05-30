import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { verifyPassword } from '@/lib/password';
import { findUserByEmail } from '@/lib/users';

const providers = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }),
  Credentials({
    name: 'Email',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      const email = String(credentials?.email || '').trim().toLowerCase();
      const password = String(credentials?.password || '');
      if (!email || !password) return null;

      const user = await findUserByEmail(email);
      if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) return null;

      return {
        id: String(user._id),
        name: user.name,
        email: user.email,
        image: user.image || null
      };
    }
  })
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'resumetai-local-development-secret-change-before-deploy',
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login'
  },
  providers,
  callbacks: {
    authorized({ auth: session, request }) {
      const isProtected = [
        '/dashboard',
        '/resume-lab',
        '/interview',
        '/skill-gap',
        '/roadmap',
        '/analytics',
        '/history',
        '/settings'
      ].some((path) => request.nextUrl.pathname.startsWith(path));

      if (!isProtected) return true;
      return Boolean(session?.user);
    },
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.id || token.sub;
      return session;
    }
  }
});
