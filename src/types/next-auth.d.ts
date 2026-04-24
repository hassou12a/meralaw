import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      profession: string;
      plan: string;
      isAdmin: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    profession?: string;
    plan?: string;
    isAdmin?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    profession: string;
    plan: string;
    isAdmin: boolean;
  }
}
