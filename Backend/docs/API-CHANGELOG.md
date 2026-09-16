# API Changelog

All notable changes to the PropertyOS API will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2025-06-01

### Added

#### Authentication
- `POST /api/v1/auth/login` — Email + password login with OTP verification
- `POST /api/v1/auth/verify-email-otp` — Verify email OTP for login
- `POST /api/v1/auth/forgot-password` — Request password reset OTP
- `POST /api/v1/auth/reset-password` — Reset password with OTP
- `POST /api/v1/auth/refresh` — Refresh JWT access token
- `POST /api/v1/auth/logout` — Revoke refresh token

#### Users
- `GET /api/v1/users` — List users (Admin)
- `GET /api/v1/users/:id` — Get user by ID
- `POST /api/v1/users` — Create user (Admin)
- `PATCH /api/v1/users/:id` — Update user (Admin)
- `POST /api/v1/users/:id/deactivate` — Deactivate user (Admin)

#### Reference Data
- `GET /api/v1/reference/states` — List states
- `GET /api/v1/reference/states/:stateId/cities` — Cities by state
- `GET /api/v1/reference/cities/:cityId/localities` — Localities by city
- `GET /api/v1/reference/localities/:localityId/micro-markets` — Micro-markets
- `GET /api/v1/reference/property-types` — Property types
- `GET /api/v1/reference/furnishing-statuses` — Furnishing statuses
- `GET /api/v1/reference/availability-statuses` — Availability statuses
- `GET /api/v1/reference/verification-statuses` — Verification statuses
- `GET /api/v1/reference/contact-roles` — Contact roles
- `GET /api/v1/reference/document-categories` — Document categories
- `GET /api/v1/reference/sources` — Lead sources
- `GET /api/v1/reference/zones` — Zones

#### Buildings
- `GET /api/v1/buildings` — List buildings (paginated)
- `GET /api/v1/buildings/:id` — Get building details
- `POST /api/v1/buildings` — Create building (Worker+)
- `PATCH /api/v1/buildings/:id` — Update building
- `DELETE /api/v1/buildings/:id` — Soft delete building (Admin)
- `POST /api/v1/buildings/:id/restore` — Restore deleted building (Admin)

#### Floors
- `GET /api/v1/floors` — List floors (filter by buildingId)
- `GET /api/v1/floors/:id` — Get floor details
- `POST /api/v1/floors` — Create floor
- `PATCH /api/v1/floors/:id` — Update floor
- `DELETE /api/v1/floors/:id` — Soft delete floor (Admin)
- `POST /api/v1/floors/:id/restore` — Restore floor (Admin)

#### Units
- `GET /api/v1/units` — List units (filter by buildingId, floorId)
- `GET /api/v1/units/:id` — Get unit details
- `POST /api/v1/units` — Create unit
- `PATCH /api/v1/units/:id` — Update unit
- `DELETE /api/v1/units/:id` — Soft delete unit (Admin)
- `POST /api/v1/units/:id/restore` — Restore unit (Admin)

#### Contacts
- `GET /api/v1/contacts` — List contacts
- `GET /api/v1/contacts/:id` — Get contact details
- `POST /api/v1/contacts` — Create contact
- `PATCH /api/v1/contacts/:id` — Update contact
- `DELETE /api/v1/contacts/:id` — Soft delete contact (Admin)
- `POST /api/v1/contacts/:id/restore` — Restore contact (Admin)

#### Clients
- `GET /api/v1/clients` — List clients (paginated)
- `GET /api/v1/clients/:id` — Get client with requirements
- `POST /api/v1/clients` — Create client
- `PATCH /api/v1/clients/:id` — Update client
- `DELETE /api/v1/clients/:id` — Soft delete client (Admin)
- `POST /api/v1/clients/:id/restore` — Restore client (Admin)

#### Deals
- `GET /api/v1/deals` — List deals (filter by status, clientId)
- `GET /api/v1/deals/:id` — Get deal details
- `POST /api/v1/deals` — Create deal
- `PATCH /api/v1/deals/:id` — Update deal
- `DELETE /api/v1/deals/:id` — Soft delete deal (Admin)
- `POST /api/v1/deals/:id/restore` — Restore deal (Admin)

#### Tasks
- `GET /api/v1/tasks` — List tasks (filter by status, priority, assignedTo)
- `GET /api/v1/tasks/:id` — Get task details
- `POST /api/v1/tasks` — Create task
- `PATCH /api/v1/tasks/:id` — Update task
- `DELETE /api/v1/tasks/:id` — Soft delete task (Admin)
- `POST /api/v1/tasks/:id/restore` — Restore task (Admin)

#### Site Visits
- `GET /api/v1/site-visits` — List site visits (filter by date, status)
- `GET /api/v1/site-visits/:id` — Get site visit details
- `POST /api/v1/site-visits` — Schedule site visit
- `PATCH /api/v1/site-visits/:id` — Update site visit
- `DELETE /api/v1/site-visits/:id` — Soft delete (Admin)
- `POST /api/v1/site-visits/:id/restore` — Restore (Admin)

#### Proposals
- `GET /api/v1/proposals` — List proposals
- `GET /api/v1/proposals/:id` — Get proposal details
- `POST /api/v1/proposals` — Create proposal
- `PATCH /api/v1/proposals/:id` — Update proposal
- `POST /api/v1/proposals/:id/pdf` — Generate PDF

#### Media
- `GET /api/v1/media` — List media files
- `GET /api/v1/media/:id` — Get media details
- `POST /api/v1/media/upload-url` — Get presigned upload URL
- `POST /api/v1/media/complete-upload` — Mark upload complete
- `PATCH /api/v1/media/:id` — Update metadata (Admin)
- `DELETE /api/v1/media/:id` — Soft delete (Admin)
- `POST /api/v1/media/:id/restore` — Restore (Admin)

#### Search
- `GET /api/v1/search/properties` — Advanced property search
- `GET /api/v1/search/units` — Advanced unit search
- `GET /api/v1/search/contacts` — Contact search

#### Map
- `GET /api/v1/map/properties` — Properties within map bounds
- `GET /api/v1/map/properties/nearby` — Nearby properties

#### Imports
- `GET /api/v1/imports` — List imports (Admin)
- `GET /api/v1/imports/:id` — Get import details
- `POST /api/v1/imports/upload` — Upload CSV (max 10MB)
- `POST /api/v1/imports/:id/map-columns` — Map columns
- `POST /api/v1/imports/:id/validate` — Validate data
- `POST /api/v1/imports/:id/confirm` — Process import

#### Exports
- `GET /api/v1/exports/:entityType` — Export data as CSV (Admin)

#### Change Requests
- `GET /api/v1/change-requests` — List change requests
- `GET /api/v1/change-requests/:id` — Get details
- `POST /api/v1/change-requests/:id/withdraw` — Withdraw
- `POST /api/v1/change-requests/:id/approve-items` — Approve (Admin)
- `POST /api/v1/change-requests/:id/reject-items` — Reject (Admin)
- `POST /api/v1/change-requests/:id/resolve-conflict` — Resolve (Admin)

#### Dashboard
- `GET /api/v1/dashboard/admin` — Admin metrics (Admin)
- `GET /api/v1/dashboard/worker` — Worker metrics (Worker)
- `GET /api/v1/dashboard/activity` — Recent activity feed

#### Notifications
- `GET /api/v1/notifications/stats` — Queue stats (Admin)
- `POST /api/v1/notifications/retry/:queue` — Retry failed jobs (Admin)

#### Audit
- `GET /api/v1/audit` — List audit events (Admin, paginated, filterable)
- `GET /api/v1/audit/:id` — Get audit event details (Admin)

#### Monitoring
- `GET /api/v1/monitoring/metrics` — System metrics (JSON)
- `GET /api/v1/monitoring/metrics/prometheus` — Prometheus metrics

#### Health
- `GET /api/v1/health` — Health check

### Security
- JWT authentication with access + refresh tokens
- Argon2 password hashing
- Rate limiting: global (60/min), auth endpoints (5/min)
- Role-based access control (ADMIN, WORKER)
- Organization-level data isolation (multi-tenancy)
- Request ID propagation (x-request-id)
- CORS configuration
- Helmet security headers (via nginx)
- Input validation via Zod schemas
- SQL injection prevention (Prisma ORM)
- File upload size limits (10MB)
- Soft deletes with recovery

### Infrastructure
- Multi-stage Docker build (Alpine)
- PostgreSQL 16 with connection pooling
- Redis 7 for BullMQ job queues
- MinIO for S3-compatible object storage
- Nginx reverse proxy with SSL/TLS 1.2+
- GitHub Actions CI/CD pipeline
- Prometheus-compatible metrics endpoint
- Structured JSON logging (production)
- Automated DB backups (daily/weekly)
- Let's Encrypt SSL automation

---

## Versioning

This API uses URI versioning: `/api/v1/...`

Breaking changes will increment the version number (v2, v3, etc.).

## Deprecation Policy

Deprecated endpoints will:
1. Return a `Sunset` header with the deprecation date
2. Return a `Deprecation` header
3. Be removed after 6 months
