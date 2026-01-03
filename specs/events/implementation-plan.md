# Implementation Plan: MedellinJS Events Platform

**Date**: January 3, 2026
**Spec**: [medellinjs-events-platform.md](./medellinjs-events-platform.md)

## Summary

Build a centralized events platform for MedellinJS using PayloadCMS as the headless CMS. The platform will replace hardcoded event data with a dynamic system where organizers can manage events through an admin interface (`/admin`), while the public accesses events via two routes: `/events` (listing) and `/events/:slug` (detail). The system will use Payload CMS for content management, Next.js App Router for the frontend, and PostgreSQL (existing Neon DB) for data persistence.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20+
**Framework**: Next.js 14.2.20 (App Router)
**CMS**: PayloadCMS 3.x (latest stable)
**Primary Dependencies**:
- `payload` - Headless CMS
- `@payloadcms/db-postgres` - PostgreSQL adapter
- `@payloadcms/richtext-lexical` - Rich text editor
- `@payloadcms/next` - Next.js integration utilities
- `next`, `react` (already installed)

**Storage**: PostgreSQL via Neon DB (already configured via `@neondatabase/serverless`)
**Authentication**: Payload's built-in auth system for admin users
**Testing**: Manual testing + browser validation for SEO (Google Rich Results Test)
**Target Platform**: Web (Next.js SSR/ISR)
**Performance Goals**:
- LCP < 3s for all pages
- ISR revalidation every 60 seconds
- Handle 500+ concurrent users

**Constraints**:
- No breaking changes to existing routes
- Must work with existing NextAuth setup
- Zero downtime deployment
- Must support image optimization for event previews

**Scale/Scope**:
- ~100-200 events total (past + future)
- 5-10 active organizers
- 500-2000 active community members

## Project Structure

### Documentation (this feature)

```text
specs/events/
├── implementation-plan.md      # This file
└── medellinjs-events-platform.md   # Feature specification
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (payload)/
│   │   └── admin/
│   │       └── [[...segments]]/
│   │           └── page.tsx           # Payload Admin UI
│   ├── api/
│   │   └── [...slug]/
│   │       └── route.ts               # Payload REST API handler
│   └── events/
│       ├── page.tsx                   # Events listing (public)
│       └── [slug]/
│           └── page.tsx               # Event detail (public)
│
├── components/
│   └── events/
│       ├── EventCard.tsx              # Event card for listing
│       ├── EventDetail.tsx            # Event detail view
│       ├── SpeakerList.tsx            # Speaker grid with images/links
│       ├── AttendeeList.tsx           # Attendee avatars
│       └── EventSchema.tsx            # JSON-LD structured data
│
├── lib/
│   ├── payload/
│   │   ├── getPayload.ts             # Payload instance helper
│   │   └── queries.ts                # Reusable event/speaker queries
│   └── types/
│       ├── event.ts                  # Event type definitions
│       └── speaker.ts                # Speaker type definitions
│
├── payload.config.ts                  # Payload CMS configuration
├── payload-types.ts                   # Auto-generated types (gitignored)
│
└── collections/
    ├── Events.ts                      # Event collection definition
    ├── Speakers.ts                    # Speaker collection definition
    ├── Media.ts                       # Media collection definition
    └── Users.ts                       # Admin users collection

public/
└── uploads/                           # Event/speaker images (created by Payload)
```

**Structure Decision**: Using Next.js App Router structure with dedicated `/events` route for public pages and `/(payload)/admin` route group for admin interface. Payload collections (Events, Speakers, Media, Users) are defined in separate files for maintainability. Speakers are managed as a standalone collection with N-N relationship to Events, enabling speaker reuse across multiple events and future speaker profile pages. This follows Next.js 14 conventions and Payload 3.x best practices.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and configure Payload CMS with PostgreSQL

- [ ] T001 Install PayloadCMS dependencies: `payload`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`, `@payloadcms/next`
- [ ] T002 Create `.env.local` entries for `PAYLOAD_SECRET` and verify `DATABASE_URL` exists
- [ ] T003 Create `payload.config.ts` with basic configuration (empty collections for now)
- [ ] T004 Create `public/uploads/` directory for media storage
- [ ] T005 Add `payload-types.ts` to `.gitignore`
- [ ] T006 Update `package.json` scripts to include `"generate:types": "payload generate:types"`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Set up Payload collections and admin interface before building public pages

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Create `src/collections/Users.ts` - Admin user collection with email/password auth
- [ ] T008 Create `src/collections/Media.ts` - Media collection with image upload, size variants (thumbnail, card, hero)
- [ ] T009 Create `src/collections/Speakers.ts` - Speaker collection with name, role, company, image, link fields
- [ ] T010 Create `src/collections/Events.ts` - Event collection with all fields (title, slug, description, dates, venue, speakers relationship, attendees, etc.)
- [ ] T011 Update `payload.config.ts` to import and register all four collections
- [ ] T012 Create `src/app/(payload)/admin/[[...segments]]/page.tsx` - Render Payload admin UI
- [ ] T013 Create `src/app/api/[...slug]/route.ts` - Payload REST API handler
- [ ] T014 Run Payload migrations to create database schema: `npx payload migrate:create`
- [ ] T015 Create first admin user via Payload seed script or manually through `/admin`
- [ ] T016 Verify admin login works at `/admin` and all collections (Users, Media, Speakers, Events) are accessible

**Checkpoint**: Foundation ready - Payload CMS admin is fully functional, can create/edit events and speakers

---

## Phase 3: User Story 6 - Admin Manages Speakers (Priority: P1)

**Goal**: Enable organizers to create and manage speaker profiles that can be reused across multiple events

**Independent Test**: Create a speaker, assign them to 2 events, edit speaker info, and verify changes appear on both event pages

### Implementation for User Story 6

- [ ] T017 [P] [US6] Configure Speaker collection with required fields (name, role, image)
- [ ] T018 [P] [US6] Configure optional fields for Speaker (company, link)
- [ ] T019 [P] [US6] Set up access control for Speakers: read public, write admin-only
- [ ] T020 [US6] Add field validations and helpful descriptions in Spanish
- [ ] T021 [US6] Configure relationship field in Events collection: `hasMany: true, relationTo: 'speakers'`
- [ ] T022 [US6] Test: Create 3 speakers through admin interface
- [ ] T023 [US6] Test: Assign multiple speakers to a single event
- [ ] T024 [US6] Test: Assign same speaker to multiple events
- [ ] T025 [US6] Test: Edit speaker info and verify changes propagate to all events

**Checkpoint**: Speakers can be created, managed, and assigned to events with N-N relationships working correctly

---

## Phase 4: User Story 4 - Admin Creates New Event (Priority: P1)

**Goal**: Enable organizers to create and manage events through Payload admin interface without developer help

**Independent Test**: Login to `/admin`, create a new event with all required fields, save it, and verify it's stored in the database

### Implementation for User Story 4

- [ ] T026 [P] [US4] Configure Event collection with field validations (title required, slug unique)
- [ ] T027 [P] [US4] Add auto-slug generation from title using `formatSlug` hook
- [ ] T028 [P] [US4] Configure venue as embedded group field (name, googleMapsUrl, extraInfo)
- [ ] T029 [P] [US4] Configure attendees as array field (name, avatarUrl)
- [ ] T030 [P] [US4] Add `isPublished` boolean field with default `false`
- [ ] T031 [P] [US4] Add `status` select field with options: upcoming, in-progress, completed, cancelled
- [ ] T032 [P] [US4] Add `featured` checkbox for homepage display
- [ ] T033 [P] [US4] Configure timezone select field with default "America/Bogota"
- [ ] T034 [P] [US4] Set up access control: read public, write admin-only
- [ ] T035 [US4] Add admin-side validation messages in Spanish
- [ ] T036 [US4] Test: Create complete event with speakers through admin and verify all fields save correctly

**Checkpoint**: Organizers can create, edit, and delete events through `/admin` interface

---

## Phase 5: User Story 1 - View Upcoming Events (Priority: P1)

**Goal**: Public users can browse all published events in a chronological listing

**Independent Test**: Navigate to `/events` and verify all published events appear in reverse chronological order with preview cards

### Implementation for User Story 1

- [ ] T037 [P] [US1] Create `src/lib/payload/getPayload.ts` - Helper to get Payload instance
- [ ] T038 [P] [US1] Create `src/lib/payload/queries.ts` - Reusable query for fetching published events
- [ ] T039 [P] [US1] Create `src/components/events/EventCard.tsx` - Responsive event card component
- [ ] T040 [P] [US1] Create `src/app/events/page.tsx` - Server component that fetches and displays events
- [ ] T041 [US1] Implement sorting by `startDate DESC`
- [ ] T042 [US1] Add visual distinction for past vs future events (badge/opacity)
- [ ] T043 [US1] Add empty state: "No hay eventos disponibles en este momento"
- [ ] T044 [US1] Configure ISR with `revalidate: 60` seconds
- [ ] T045 [US1] Add page metadata: title "Eventos | MedellinJS"
- [ ] T046 [US1] Style event cards with Tailwind (match existing design system)
- [ ] T047 [US1] Use `next/image` for optimized image loading
- [ ] T048 [US1] Handle missing preview images with placeholder

**Checkpoint**: `/events` page displays all published events correctly, loads in < 3s

---

## Phase 6: User Story 2 - View Event Details (Priority: P1)

**Goal**: Public users can view complete information about a specific event including description, venue, speakers, and attendees

**Independent Test**: Click any event card, navigate to `/events/:slug`, and verify all event details are displayed correctly including speakers with their profile images and links

### Implementation for User Story 2

- [ ] T049 [P] [US2] Create `src/app/events/[slug]/page.tsx` - Dynamic route for event details with depth=2 query
- [ ] T050 [P] [US2] Implement `generateStaticParams()` for past events (ISR for future)
- [ ] T051 [P] [US2] Create `src/components/events/EventDetail.tsx` - Full event detail component
- [ ] T052 [P] [US2] Create `src/components/events/SpeakerList.tsx` - Speaker grid with circular images
- [ ] T053 [P] [US2] Create `src/components/events/AttendeeList.tsx` - Attendee grid with lazy loading
- [ ] T054 [US2] Render rich text description using Payload's lexical serializer
- [ ] T055 [US2] Format dates with timezone using `date-fns` (already installed)
- [ ] T056 [US2] Render venue with Google Maps link (target="_blank")
- [ ] T057 [US2] Render speakers with: circular image, name, role + company, external link icon
- [ ] T058 [US2] Open speaker external links in new tab (target="_blank")
- [ ] T059 [US2] Handle missing speaker data (no link, no company, no image)
- [ ] T060 [US2] Implement lazy loading for attendees when count > 30
- [ ] T061 [US2] Handle invalid slugs with custom 404 page
- [ ] T062 [US2] Add "Back to events" navigation link
- [ ] T063 [US2] Style detail page with hero image, responsive layout
- [ ] T064 [US2] Configure ISR with `revalidate: 60`
- [ ] T065 [US2] Hide speakers section if event has no speakers
- [ ] T066 [US2] Ensure responsive grid layout for speakers (1-2-3 columns depending on screen size)

**Checkpoint**: Event detail pages display all information correctly including speakers, support direct URL access

---

## Phase 7: User Story 3 - SEO Discovery (Priority: P2)

**Goal**: Search engines and social platforms can discover and display events correctly with rich metadata

**Independent Test**: Inspect page source for JSON-LD Event schema and Open Graph tags, validate with Google Rich Results Test

### Implementation for User Story 3

- [ ] T067 [P] [US3] Create `src/components/events/EventSchema.tsx` - JSON-LD Event schema component
- [ ] T068 [P] [US3] Add JSON-LD script to event detail page with all required fields (including speakers)
- [ ] T069 [US3] Generate Open Graph meta tags for event detail pages
- [ ] T070 [US3] Generate Twitter Card meta tags
- [ ] T071 [US3] Add canonical URL meta tag
- [ ] T072 [US3] Generate dynamic meta description from event description (first 160 chars)
- [ ] T073 [US3] Test with Google Rich Results Test tool
- [ ] T074 [US3] Test social sharing on Twitter/LinkedIn
- [ ] T075 [US3] Add sitemap generation for `/events` and `/events/:slug` routes

**Checkpoint**: All event pages pass SEO validation, social shares display correctly

---

## Phase 8: User Story 5 - Admin Manages Attendees (Priority: P2)

**Goal**: Organizers can add attendees to events for social proof

**Independent Test**: Edit an event in admin, add 10 attendees, save, and verify they appear on public event page

### Implementation for User Story 5

- [ ] T076 [P] [US5] Verify attendee array field in Event collection allows unlimited entries
- [ ] T077 [P] [US5] Add helpful descriptions in admin for attendee fields
- [ ] T078 [US5] Test adding 50+ attendees to verify UI performance
- [ ] T079 [US5] Implement "Ver más" button in AttendeeList component for > 30 attendees
- [ ] T080 [US5] Add conditional rendering to hide attendee section if empty

**Checkpoint**: Organizers can easily manage attendee lists, large lists perform well

---

## Phase 9: Integration & Migration

**Purpose**: Integrate with existing homepage and migrate hardcoded event data

- [ ] T081 Update `src/components/Events.tsx` to fetch from Payload instead of hardcoded data
- [ ] T082 Create migration script to import current hardcoded event into Payload
- [ ] T083 Create seed speakers from existing data (if any)
- [ ] T084 Update homepage to use featured events from Payload
- [ ] T085 Test full user flow: admin creates event + speakers → appears on homepage → detail page works
- [ ] T086 Verify no breaking changes to existing routes
- [ ] T087 Test with existing NextAuth session (ensure no conflicts)

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and optimizations

- [ ] T088 Add loading states for event listing and detail pages
- [ ] T089 Add error boundaries for API failures
- [ ] T090 Optimize image sizes - ensure Payload generates correct variants for speakers and events
- [ ] T091 Add analytics tracking for event views (if applicable)
- [ ] T092 Performance audit - verify LCP < 3s on both pages
- [ ] T093 Accessibility audit - ensure WCAG 2.1 AA compliance
- [ ] T094 Add README documentation for organizers on how to use `/admin` (events and speakers)
- [ ] T095 Create backup/restore procedure for event and speaker data
- [ ] T096 Code review and cleanup
- [ ] T097 Deploy to production and verify ISR works correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 6 - Speakers (Phase 3)**: Depends on Foundational - Must complete before events can reference speakers
- **User Story 4 - Events (Phase 4)**: Depends on Phase 3 - Events reference speakers via relationships
- **User Story 1 - Listing (Phase 5)**: Depends on Phase 4 - Displays events
- **User Story 2 - Details (Phase 6)**: Depends on Phases 3, 4, 5 - Displays events with speakers
- **User Story 3 - SEO (Phase 7)**: Depends on Phase 6 - Adds metadata to detail pages
- **User Story 5 - Attendees (Phase 8)**: Depends on Foundational - Independent of other user stories
- **Integration (Phase 9)**: Depends on Phases 5, 6 - Public pages must work
- **Polish (Phase 10)**: Depends on all phases - Final cleanup

### Critical Path

1. Setup → Foundational → Speakers (US6)
2. Speakers (US6) → Events Admin (US4) → Public Listing (US1) → Detail Pages (US2)
3. Detail Pages (US2) → SEO (US3)
4. Public pages ready → Integration → Polish

### Parallel Work Opportunities

After Foundational (Phase 2) is complete:
- Speakers (US6) must complete first (blocking)
After Speakers (Phase 3) is complete:
- Events admin (US4) and Attendees (US5) can be built in parallel
- SEO (US3) can be built in parallel with Attendees (US5)

## Notes

- Use TypeScript strict mode for all new code
- Follow existing code style (ESLint, Prettier configs already in place)
- All Payload collections should have TypeScript types auto-generated
- Commit after each phase checkpoint
- Test admin interface thoroughly before moving to public pages
- Verify ISR revalidation works correctly in production (may differ from dev)
- Keep existing `/events` component as fallback during migration
- Document any environment variables needed in `.env.example`
- Ensure Payload admin is protected and not publicly accessible
- Consider rate limiting for API endpoints if needed
- **Speakers Collection**: Use depth=2 query parameter when fetching events to resolve speaker relationships and media
- **Speaker Reusability**: Speakers are intentionally a separate collection to enable reuse across events - editing speaker info should propagate to all associated events
- **Future Extensibility**: Speaker collection is designed to support future features like order control, isKeynote flag, and speakerTitleOverride per event

