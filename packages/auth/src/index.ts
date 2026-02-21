import { db } from "@repo/db";
import * as authSchema from "@repo/db/schema/auth";
import * as coreSchema from "@repo/db/schema/core-schema";
import { env } from "@repo/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, customSession, emailOTP, lastLoginMethod, username } from "better-auth/plugins";
import { Resend } from "resend";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { 
      ...authSchema,
      ...coreSchema
    },
  }),
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.CORS_ORIGIN!],
  logger: {
    disabled: false,
    disableColors: false,
    level: "debug"
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/google`,
      accessType: "offline",
      prompt: "select_account consent",
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 3, // 3 days (session is valid for 3 days)
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    freshAge: 60 * 60, // 1 hour (the session is considered fresh for 1 hour after creation)
    cookieCache: {
      enabled: true,
      maxAge: 10 * 60, // 10 minutes In seconds
    },
    cookieOptions: {
      domain: env.NODE_ENV === "production" ? ".viswavignanavaaradhi.org" : "localhost",
    },
  },
  advanced: {
    useSecureCookies: true,
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for"]
    },
  },
  rateLimit: {
    storage: "database",
    window: 10,
    max: 100
  },
  user: {
    additionalFields: {
      aboutMe: {
        type: "string",
        required: false,
      }
    },
    deleteUser: {
      enabled: true,
    }
  },
  account: {
    accountLinking: {
      trustedProviders: ["google"],
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
      adminUserIds: ["NWpGUiKvmwyqBq8kpzgk9brxpOLaYDZS"],
      defaultBanReason: "Spamming or abusive behavior",
      defaultBanExpiresIn: undefined,
      bannedUserMessage: "You have been banned from accessing this application.",
    }),
    username(),
    lastLoginMethod({
      storeInDatabase: true,
    }),
    emailOTP({
      otpLength: 6,
      expiresIn: 180, // 3 minutes
      allowedAttempts: 5,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "forget-password") {
          const resend = new Resend(env.RESEND_API_KEY as string);
          const {data, error} = await resend.emails.send({
            from: "contact@viswavignanavaaradhi.org",
            to: email,
            subject: "Reset Password request for Viswa Vignana Vaardhi",
            html: `<p>Your OTP for resetting your password is: <strong>${otp}</strong></p>`,
          });
          console.log(`Email sent successfully to ${email}:`, data);
          if (error) {
            console.error("Error sending email:", error);
          }
        }
      },
      sendVerificationOnSignUp: false,
      disableSignUp: false
    }),
    customSession(async ({ user, session }) => {
      const membership = await db.query.memberships.findFirst({
        where: (memberships, { eq }) => eq(memberships.userId, user.id),
      });

      return {
        user: {
          ...user,
          userRole: membership?.roleName ?? null
        },
        session
      };
    })
  ]
});
