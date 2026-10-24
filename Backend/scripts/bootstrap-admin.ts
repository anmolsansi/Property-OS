/**
 * Explicit one-time bootstrap of the first PropertyOS administrator.
 * Not invoked by deploys, application startup, migrations, or seeding.
 */
import { createClerkClient } from "@clerk/backend";
import { PrismaClient, UserRole, UserStatus, Prisma } from "@prisma/client";
import * as argon2 from "argon2";
import { randomBytes } from "node:crypto";

const required = [
  "DATABASE_URL",
  "CLERK_SECRET_KEY",
  "BOOTSTRAP_ADMIN_CLERK_ID",
  "BOOTSTRAP_ADMIN_EMAIL",
  "ALLOW_ADMIN_BOOTSTRAP",
] as const;

async function main() {
  for (const name of required) {
    if (!process.env[name]?.trim()) throw new Error(`Missing ${name}`);
  }
  if (process.env.ALLOW_ADMIN_BOOTSTRAP !== "yes") {
    throw new Error("ALLOW_ADMIN_BOOTSTRAP must equal yes");
  }
  if (process.env.AUTH_PROVIDER !== "clerk") {
    throw new Error("AUTH_PROVIDER must equal clerk");
  }

  const clerkId = process.env.BOOTSTRAP_ADMIN_CLERK_ID!.trim();
  const expectedEmail = process.env.BOOTSTRAP_ADMIN_EMAIL!.trim().toLowerCase();
  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
  const account = await clerk.users.getUser(clerkId);
  const email = account.emailAddresses.find(
    (e) => e.id === account.primaryEmailAddressId,
  );
  if (!email || email.emailAddress.toLowerCase() !== expectedEmail) {
    throw new Error("Clerk primary email does not match BOOTSTRAP_ADMIN_EMAIL");
  }
  if (email.verification?.status !== "verified") {
    throw new Error("Clerk primary email is not verified");
  }

  const prisma = new PrismaClient();
  try {
    // Do not run this against an established database, including one whose
    // administrator was subsequently disabled or deleted.
    const currentUsers = await prisma.user.count();
    if (currentUsers !== 0) {
      throw new Error("Bootstrap refused: database already has users");
    }
    const passwordHash = await argon2.hash(randomBytes(32).toString("hex"));
    const admin = await prisma.$transaction(
      async (tx) => {
        if ((await tx.user.count()) !== 0) {
          throw new Error("Bootstrap refused: accounts already exist");
        }
        const user = await tx.user.create({
          data: {
            email: expectedEmail,
            fullName: account.fullName || expectedEmail,
            clerkUserId: clerkId,
            passwordHash,
            role: UserRole.ADMIN,
            status: UserStatus.active,
            emailVerifiedAt: new Date(),
          },
        });
        await tx.auditEvent.create({
          data: {
            actorUserId: user.id,
            eventType: "admin_bootstrap",
            entityType: "user",
            entityId: user.id,
            metadataJson: { method: "explicit_operator_bootstrap" },
          },
        });
        return user;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    console.log(`First administrator provisioned successfully (user ID: ${admin.id}).`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(
    "Admin bootstrap refused:",
    error instanceof Error ? error.message : "unknown error",
  );
  process.exitCode = 1;
});
