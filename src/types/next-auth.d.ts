import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      profession: string;
      plan: string;
    } & DefaultSession['user'];
  }

  interface User {
    profession?: string;
    plan?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    profession: string;
    plan: string;
  }
}