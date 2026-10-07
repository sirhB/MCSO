import "@/lib/runtime-env";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { OWNER_ADMIN } from "@/lib/admin-accounts";

export const authOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET ||
    process.env.SUPABASE_API_KEY ||
    "mcso-hostinger-default-nextauth-secret",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const email = credentials.email.toLowerCase().trim();

        async function findUser() {
          return prisma.user.findUnique({ where: { email } });
        }

        let user;
        try {
          user = await findUser();
        } catch (err) {
          console.error("[auth] user lookup failed, repairing DB:", err);
          try {
            const { ensureDatabaseReady } = await import("@/lib/ensure-owner");
            await ensureDatabaseReady();
            user = await findUser();
          } catch (repairErr) {
            console.error("[auth] DB repair failed:", repairErr);
            return null;
          }
        }

        // Self-heal: if Michael's seeded credentials are used but the row is missing.
        if (
          !user &&
          email === OWNER_ADMIN.email &&
          credentials.password === OWNER_ADMIN.password
        ) {
          try {
            const { ensureOwnerAdmin } = await import("@/lib/ensure-owner");
            await ensureOwnerAdmin();
            user = await findUser();
          } catch (err) {
            console.error("[auth] ensureOwnerAdmin failed:", err);
            return null;
          }
        }

        if (!user) return null;
        const ok = await compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
};
