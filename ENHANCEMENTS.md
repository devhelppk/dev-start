# Enhancements

Tracked from [roadmap](web/app/(marketing)/roadmap/page.tsx). Priorities based on user impact and dependency order.

## Shipped

- [x] **Billing & Subscriptions** — Stripe integration with subscription management, customer portal, and webhook handling. Works with both Better Auth and Clerk.
- [x] **Drizzle ORM** — Alternative to Prisma with a more SQL-like approach. Same type-safe integration, different philosophy.
- [x] **Clerk Auth** — Drop-in authentication alternative to Better Auth. Pre-built components, webhooks, and organization support.
- [x] **Email Templates** — React Email + Resend for transactional emails (welcome, password reset, invitations). Type-safe and previewable.
- [x] **Form Renderer** — JSON-driven forms with classic, conversational, and multistep layouts.
- [x] **File Uploads** — S3-compatible uploads with presigned URLs.

## Coming soon

- [ ] **Monorepo Templates** — Turborepo-based monorepo starter with shared packages, multiple apps, and coordinated tooling.

## Planned

- [ ] **Organizations & Multi-tenancy** — Team workspaces, role-based access control, and tenant isolation. Built on top of the auth layer with Prisma/Drizzle schema extensions.

## Exploring

- [ ] **Background Jobs** — Job queue integration for async processing (email sending, webhook delivery, data pipelines). Considering Trigger.dev and BullMQ.
- [ ] **Real-time & WebSockets** — Live updates, presence, and collaboration features. Evaluating Ably, Pusher, and PartyKit.
- [ ] **Admin Dashboard** — Internal tools template for managing users, viewing analytics, and handling support. Auto-generated from Prisma/Drizzle schema.
