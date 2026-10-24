# PropertyOS $0 Deployment Guide (October 2026)

This is a **personal demonstration / development** deployment, not a production hosting guarantee. Do not upload real client PII, contracts, or confidential property documents.

## Intended free stack

| Area | Service | Constraints |
|---|---|---|
| Next.js frontend | Vercel Hobby | Free for personal, **non-commercial** use only |
| NestJS backend | Render Free web service | Sleeps after 15 minutes idle, 750 shared free instance hours/month; no pre-deploy command |
| PostgreSQL | Neon Free | 1 GB per project as of October 2, 2026; quota suspends rather than charging on Free |
| Authentication | Clerk Hobby | Free limit applies, no credit card required |
| Media | Neon Object Storage Free | 5 GB per project, S3-compatible, private buckets supported; subject to Free plan limits |
| Email | Clerk sign-in email; optional Resend HTTPS | SMTP ports 25/465/587 are blocked on Render Free |

**Strictly no-charge configuration:** do not enable paid plans, add-ons, metered external APIs, Cloudflare R2 billing, Google Maps billing, or purchases. Use Neon Object Storage Free for media, or leave file uploads disabled. Optional backend email features need a supported HTTPS mail provider. A business-facing commercial frontend must move off Vercel Hobby onto hosting whose terms allow the use.

## 1. Create the database

1. Sign up at https://neon.com and select **Free**.
2. Create a fresh empty PostgreSQL project in the region closest to the backend (Singapore if available).
3. In Neon, copy the **direct** database connection URL. Set **DATABASE_URL** only in Render's private environment settings, not in GitHub.
4. On first backend startup only, the repository's `Backend/scripts/deploy-migrations.js` detects an *empty* database, creates the current Prisma schema using `prisma db push`, marks the checked-in legacy migrations as already applied, and runs `prisma migrate deploy`. Existing tracked databases receive only pending migrations. A populated untracked database is intentionally rejected.

This empty-database baseline is a **demo compatibility workaround**. The first checked-in migration assumes tables already exist. Before production use, establish a reviewed initial migration and tested backup/restore process.

## 2. Create Clerk authentication

1. Create a Clerk Hobby application at https://dashboard.clerk.com.
2. Enable email/password or email code authentication.
3. Copy the publishable and secret keys **to the relevant hosting provider's secret environment settings**. Never paste them into source control.
4. Once the frontend URL exists, add its origin to Clerk's allowed origins/redirect configuration.

## 3. Deploy backend on Render Free

1. In https://dashboard.render.com select **New → Blueprint** and connect `anmolsansi/Property-OS`.
2. Review that the blueprint creates **one web service, plan Free**, in Singapore. **Do not approve any paid resource**.
3. Set required variables privately: `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_AUTHORIZED_PARTIES`, `APP_FRONTEND_URL`, `CORS_ORIGIN`. The blueprint generates JWT and encryption secrets.
4. Leave Redis disabled. Do **not** set Gmail SMTP credentials, because Render Free blocks SMTP ports.
5. For free private media storage, create a **private bucket** named `propertyos-media` using Neon Object Storage in the same Neon project. Obtain branch-specific S3-compatible endpoint and scoped storage read/write credentials from Neon. Set `S3_ENDPOINT`, `S3_BUCKET=propertyos-media`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, and `S3_REGION` in Render's private environment settings. Leave `S3_PUBLIC_URL` unset for confidential documents. If you aren't using media yet, leave S3 credentials unset.
6. The free blueprint builds from the **monorepo root** with the root npm lockfile. It runs the schema preparation in the startup command because Render pre-deploy commands require a paid web service.
7. Copy the actual Render API URL. Replace any sample `propertyos-api.onrender.com` URL if Render assigns a different hostname, and set `APP_URL` accordingly.

If the first build fails, inspect Render logs. Do not create additional paid instances to troubleshoot.

## 4. Deploy frontend on Vercel Hobby, personal demo only

1. At https://vercel.com/new import `anmolsansi/Property-OS` to a **Hobby** team.
2. Set **Root Directory** = `Frontend` and Framework = Next.js.
3. Under **Environment Variables**, set:
   - `NEXT_PUBLIC_API_URL=https://YOUR-RENDER-HOST/api/v1`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` from Clerk
   - `CLERK_SECRET_KEY` from Clerk
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard`
4. Do not enable any paid add-ons. Deploy and copy the real `.vercel.app` URL.
5. Update Render `APP_FRONTEND_URL`, `CORS_ORIGIN`, and `CLERK_AUTHORIZED_PARTIES` to that exact frontend origin. Redeploy Render after changing environment settings.

Vercel Hobby's terms restrict commercial use. For a real business deployment, replace this frontend step with an approved free hosting option, which may require Next.js code adaptations.

## 5. Seeding and safety

**Do not run `npm run db:seed` on a public database.** The existing seed file creates example accounts with hardcoded known passwords. It must be redesigned to seed reference data without insecure demo accounts before use on a public app.

When no backend email delivery is configured, legacy backend OTP/email operations fail closed in production instead of logging OTP secrets and pretending email was sent. Clerk's own sign-in flows can still send email according to its plan.

A scheduled GitHub Actions keep-alive ping was disabled so Render Free can sleep naturally and won't consume continuous instance time.

## 6. Verify

- Open `https://YOUR-RENDER-HOST/` and `https://YOUR-RENDER-HOST/api/v1/health`.
- Open `https://YOUR-VERCEL-SITE.vercel.app`, sign in using Clerk, and inspect network requests to the correct API URL.
- Verify CORS, unauthenticated request rejection, database reads/writes with throwaway demo records, and that no secret appears in browser responses or logs.
- Only after separate review, test media upload and notifications if their service providers are configured.

## Costs and constraints

- **Render**: Free web service sleeps after 15 minutes without inbound traffic and has a 750-hour monthly workspace allowance. External transfer or paid-feature usage can have billing implications; review dashboard billing controls.
- **Neon**: Free database has limited monthly compute and network transfer and 1 GB storage as of October 2026.
- **Neon Object Storage**: Free includes 5 GB of S3-compatible object storage per project as of October 2026. Treat the storage and shared network quotas as hard limits. Keep private documents in private buckets.
- **Cloudflare R2**: Not required for this deployment. It requires an R2 subscription and may bill beyond the free allowance.
- **Vercel**: Hobby is free only for personal, non-commercial use.
- **Clerk**: Hobby free plan supports email sign-in and has usage limits.

Official limits: https://render.com/docs/free | https://render.com/docs/deploys | https://vercel.com/docs/plans/hobby | https://neon.com/blog/neon-free-plan-1-gb-per-project | https://clerk.com/pricing | https://neon.com/docs/storage/get-started | https://developers.cloudflare.com/r2/pricing/
