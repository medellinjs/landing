# Feature Specification: MedellinJS Events Platform

**Created**: January 3, 2026

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Upcoming Events (Priority: P1)

As a community member, I want to see all upcoming MedellinJS events so I can decide which ones to attend.

**Why this priority**: This is the core value proposition - community members need to discover events. Without this, the platform has no purpose.

**Independent Test**: Can be fully tested by navigating to `/events` and verifying that future events are displayed in chronological order with essential information (title, date, venue, image).

**Acceptance Scenarios**:

1. **Scenario**: User views event listing page
   - **Given** there are 5 upcoming events in the database
   - **When** user navigates to `/events`
   - **Then** all 5 events are displayed in chronological order (most recent first)
   - **And** each event card shows: preview image, title, start date, venue name, and "Ver evento" CTA

2. **Scenario**: User distinguishes past from future events
   - **Given** there are 3 past events and 2 future events
   - **When** user views the events page
   - **Then** future events display a visual badge or indicator
   - **And** past events appear visually distinct (e.g., reduced opacity or grayscale)

3. **Scenario**: User accesses events page with no events
   - **Given** no events exist in the system
   - **When** user navigates to `/events`
   - **Then** a friendly message appears: "No hay eventos disponibles en este momento. ¡Vuelve pronto!"

---

### User Story 2 - View Event Details (Priority: P1)

As a community member, I want to see complete information about a specific event so I can make an informed decision to attend.

**Why this priority**: Once users find an interesting event, they need details to decide whether to attend. This completes the discovery journey.

**Independent Test**: Can be fully tested by clicking any event card and verifying all event details are displayed correctly, including rich text description, venue with map link, speaker information, and attendee list.

**Acceptance Scenarios**:

1. **Scenario**: User views complete event details
   - **Given** an event "Construye tu primer agente con LangGraph" exists with full details
   - **When** user clicks "Ver evento" on the event card
   - **Then** user is navigated to `/events/construye-tu-primer-agente-con-langgraph`
   - **And** page displays: hero image, full title, formatted date/time with timezone, venue name, description (rich text), speakers section, and attendee list

2. **Scenario**: User views speaker information
   - **Given** an event has 2 speakers
   - **When** user scrolls to the speakers section
   - **Then** each speaker is displayed with: circular profile image, name, role + company, and external link icon
   - **And** speakers are displayed in a responsive grid layout

3. **Scenario**: User accesses speaker external link
   - **Given** a speaker has a link to their LinkedIn profile
   - **When** user clicks on the external link icon
   - **Then** the speaker's profile opens in a new browser tab

4. **Scenario**: User navigates to venue location
   - **Given** user is viewing an event detail page
   - **When** user clicks on the venue name
   - **Then** Google Maps opens in a new tab with the venue location

5. **Scenario**: User views attendee list
   - **Given** an event has 15 attendees
   - **When** user scrolls to the attendees section
   - **Then** all 15 attendees are displayed with avatar and name
   - **And** avatars are loaded lazily for performance

6. **Scenario**: User accesses invalid event slug
   - **Given** user navigates to `/events/non-existent-event`
   - **When** the page loads
   - **Then** user sees a 404 page with a link back to `/events`

---

### User Story 3 - SEO Discovery (Priority: P2)

As a search engine crawler or social media platform, I want to discover MedellinJS events through structured data so they appear correctly in search results and social shares.

**Why this priority**: Organic discovery increases event attendance. This extends reach beyond the existing community.

**Independent Test**: Can be tested by inspecting page source for JSON-LD Event schema and Open Graph tags, then validating with Google's Rich Results Test.

**Acceptance Scenarios**:

1. **Scenario**: Search engine indexes event
   - **Given** an event detail page exists at `/events/workshop-react-2025`
   - **When** a search engine crawler accesses the page
   - **Then** the page includes JSON-LD structured data with Event schema
   - **And** includes: name, startDate, endDate, location, description, organizer

2. **Scenario**: User shares event on social media
   - **Given** user shares `/events/workshop-react-2025` on Twitter
   - **When** Twitter fetches the Open Graph metadata
   - **Then** the preview shows: event title, description, and preview image

---

### User Story 4 - Admin Creates New Event (Priority: P1)

As a MedellinJS organizer, I want to create new events through a visual admin interface so I don't need developer help.

**Why this priority**: Without content creation capability, the platform is useless. This enables self-service content management.

**Independent Test**: Can be tested by logging into `/admin`, creating a new event with all required fields, publishing it, and verifying it appears on the public events page.

**Acceptance Scenarios**:

1. **Scenario**: Admin creates complete event
   - **Given** admin is logged into Payload CMS at `/admin`
   - **When** admin clicks "Create Event"
   - **And** fills in: title, slug (auto-generated), description, start date, end date, timezone, uploads preview image, adds venue details
   - **And** clicks "Save & Publish"
   - **Then** event appears immediately on `/events` (after ISR revalidation)

2. **Scenario**: Admin saves draft event
   - **Given** admin is creating a new event
   - **When** admin fills partial information
   - **And** toggles `isPublished` to false
   - **And** saves the event
   - **Then** event is saved but does NOT appear on public `/events` page

3. **Scenario**: Slug uniqueness validation
   - **Given** an event with slug "workshop-react" exists
   - **When** admin tries to create another event with slug "workshop-react"
   - **Then** system shows validation error: "Este slug ya existe. Por favor, elige otro."

---

### User Story 5 - Admin Manages Attendees (Priority: P2)

As a MedellinJS organizer, I want to add attendees to past events so we can showcase community participation.

**Why this priority**: Social proof encourages future attendance. Not critical for launch but important for community building.

**Independent Test**: Can be tested by editing an existing event, adding 5 attendees with names and avatar URLs, saving, and verifying they appear on the public event detail page.

**Acceptance Scenarios**:

1. **Scenario**: Admin adds attendees to event
   - **Given** admin is editing an existing event
   - **When** admin clicks "Add Attendee"
   - **And** enters name: "Cristian Moreno" and avatarUrl: "/team/khriztian.jpeg"
   - **And** repeats for 10 attendees
   - **And** saves the event
   - **Then** all 10 attendees appear on the public event page

2. **Scenario**: Handle large attendee lists
   - **Given** an event has 50 attendees
   - **When** user views the event detail page
   - **Then** only first 30 attendees are rendered initially
   - **And** a "Ver más" button appears
   - **When** user clicks "Ver más"
   - **Then** remaining 20 attendees are loaded

---

### User Story 6 - Admin Manages Speakers (Priority: P1)

As a MedellinJS organizer, I want to manage speakers as a separate collection so I can reuse speaker information across multiple events.

**Why this priority**: Speakers often participate in multiple events. Managing them as a separate entity avoids data duplication and enables future features like speaker profiles.

**Independent Test**: Can be tested by creating a speaker in `/admin`, assigning them to 2 different events, editing the speaker's info once, and verifying changes appear on both event pages.

**Acceptance Scenarios**:

1. **Scenario**: Admin creates new speaker
   - **Given** admin is logged into Payload CMS at `/admin`
   - **When** admin navigates to "Speakers" collection
   - **And** clicks "Create Speaker"
   - **And** fills in: name "Wbert Adrian", role "FullStack Developer", company "SoftServe", uploads profile image, adds link "https://linkedin.com/in/wbert"
   - **And** saves the speaker
   - **Then** speaker is created and available for selection in events

2. **Scenario**: Admin assigns speakers to event
   - **Given** 3 speakers exist in the system: "Wbert Adrian", "Cristian Moreno", "Mafe Serna"
   - **And** admin is creating/editing an event
   - **When** admin selects speakers relationship field
   - **And** chooses "Wbert Adrian" and "Mafe Serna"
   - **And** saves the event
   - **Then** both speakers appear on the public event detail page in the order selected

3. **Scenario**: Admin reuses speaker across events
   - **Given** speaker "Cristian Moreno" exists
   - **When** admin assigns "Cristian Moreno" to "Event A" and "Event B"
   - **And** later edits speaker's company from "Tiempo" to "Toptal"
   - **Then** the updated company appears on both "Event A" and "Event B" detail pages

4. **Scenario**: Admin manages speaker order
   - **Given** an event has 3 speakers assigned
   - **When** admin drags and reorders the speakers in the relationship field
   - **And** saves the event
   - **Then** speakers appear on the public page in the new order

---

### User Story 7 - Content Revalidation (Priority: P3)

As a MedellinJS organizer, I want public pages to update within 60 seconds after I publish/edit an event so changes appear quickly.

**Why this priority**: Improves content freshness without sacrificing performance. Nice-to-have but not critical.

**Independent Test**: Can be tested by editing an event in admin, noting the time, and verifying the public page reflects changes within 60 seconds.

**Acceptance Scenarios**:

1. **Scenario**: ISR revalidation on edit
   - **Given** an event "Workshop React" is published
   - **When** admin edits the event title to "Workshop React Avanzado"
   - **And** saves changes at 10:00:00
   - **Then** by 10:01:00, `/events/workshop-react` displays the new title

---

### Edge Cases

- What happens when an event has no preview image?
  - Display a default MedellinJS placeholder image

- What happens when venue Google Maps URL is invalid or missing?
  - Display venue name as plain text without link

- What happens when timezone is not set?
  - Default to "America/Bogota"

- What happens when an event has no speakers?
  - Hide the speakers section entirely

- What happens when a speaker has no external link?
  - Display speaker info without the external link icon

- What happens when a speaker has no company?
  - Display only role without company name

- What happens when a speaker's profile image is missing?
  - Display a default avatar placeholder

- What happens when a speaker is deleted but assigned to events?
  - Payload CMS prevents deletion or shows warning; alternative: soft delete and hide from public pages

- What happens when an event has no attendees?
  - Hide the attendees section entirely or show "Asistentes pendientes de confirmar"

- What happens when description is extremely long (>5000 characters)?
  - Truncate in listing view, show full content in detail view

- What happens when startDate is in the past but endDate is in the future?
  - Mark as "En progreso" (edge case: multi-day events)

- What happens if two events have the same startDate?
  - Sort by createdAt DESC as secondary sort

- What happens when user manually edits slug to create URL conflicts?
  - Payload CMS validates uniqueness; shows error before save

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all published events at `/events` in reverse chronological order (most recent first)
- **FR-002**: System MUST render individual event details at `/events/:slug` where slug is unique per event
- **FR-003**: System MUST display the following on event listing cards: preview image, title, formatted start date, venue name, and CTA button
- **FR-004**: System MUST display the following on event detail pages: hero image, title, start/end date with timezone, venue with Google Maps link, rich text description, and attendee list
- **FR-005**: System MUST visually distinguish between past and future events on the listing page
- **FR-006**: System MUST generate SEO-friendly metadata including page title "Eventos | MedellinJS" and auto-generated meta descriptions
- **FR-007**: System MUST include JSON-LD structured data (Event schema) on event detail pages for search engines
- **FR-008**: System MUST handle missing preview images by displaying a default placeholder
- **FR-009**: System MUST lazy-load attendee avatars when list exceeds 30 attendees
- **FR-010**: System MUST use Next.js Image component for optimized image loading
- **FR-011**: System MUST open venue Google Maps links in new browser tab
- **FR-012**: System MUST return 404 page for non-existent event slugs
- **FR-013**: System MUST revalidate static pages every 60 seconds (ISR)
- **FR-014**: System MUST restrict write access to events collection to authenticated admin users only
- **FR-015**: System MUST allow public read access to published events via REST/GraphQL API
- **FR-016**: Admin interface MUST auto-generate slug from title (editable before save)
- **FR-017**: Admin interface MUST validate slug uniqueness before saving
- **FR-018**: Admin interface MUST provide rich text editor for event descriptions
- **FR-019**: Admin interface MUST provide date picker with time selection for start/end dates
- **FR-020**: Admin interface MUST provide `isPublished` toggle for draft/published states
- **FR-021**: System MUST persist all events data with timestamps (createdAt, updatedAt)
- **FR-022**: System MUST default timezone to "America/Bogota" if not specified
- **FR-023**: Admin interface MUST support image upload for preview images with automatic optimization
- **FR-024**: System MUST display venue information as embedded group (not separate collection)
- **FR-025**: System MUST display attendees as embedded array within event document
- **FR-026**: System MUST manage speakers as a separate collection with N-N relationship to events
- **FR-027**: System MUST display speakers on event detail page with: profile image (circular), name, role, company (if present), and external link icon (if present)
- **FR-028**: System MUST open speaker external links in new browser tab
- **FR-029**: System MUST allow admin to reuse speakers across multiple events via relationship field
- **FR-030**: System MUST preserve speaker order as defined by admin in event relationship field
- **FR-031**: System MUST fetch speaker data with depth=2 query parameter to resolve relationships
- **FR-032**: Admin interface MUST validate speaker name and role as required fields
- **FR-033**: Admin interface MUST validate speaker image as required field
- **FR-034**: Admin interface MUST allow optional company and link fields for speakers
- **FR-035**: System MUST display speakers in responsive grid layout on event detail page
- **FR-036**: System MUST hide speakers section if event has no speakers assigned
- **FR-037**: System MUST handle missing speaker images by displaying default avatar placeholder
- **FR-038**: System MUST restrict write access to speakers collection to authenticated admin users only
- **FR-039**: System MUST allow public read access to speakers via REST/GraphQL API

### Key Entities

- **Event**: Represents a MedellinJS community event (past or future). Contains all information needed to promote and document the event including title, description (rich text), dates with timezone, venue details, preview image, speaker relationships, and list of attendees. Each event has a unique slug used for URL routing. Has N-N relationship with Speaker collection.

- **Speaker** (collection): Represents a person who presents at MedellinJS events. Contains name, role, optional company, profile image, and optional external link (Twitter, LinkedIn, GitHub, website). Speakers can participate in multiple events and are managed independently to enable reuse and future features like public speaker profiles. Related to Events via N-N relationship.

- **Venue** (embedded): Represents the physical location of an event. Contains venue name, Google Maps URL for navigation, and optional extra information (e.g., "Auditorio Bloque X"). Embedded within Event to avoid unnecessary joins.

- **Attendee** (embedded): Represents a community member who attended an event. Contains only display information: name and avatar URL. This is NOT a user profile - it's a simple visual representation for social proof. Stored as an array within Event document.

- **Media**: Represents uploaded images (event previews, speaker profile photos, attendee avatars). Managed by Payload CMS with automatic size optimization (thumbnail, card, hero variants).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Public users can view the complete event listing and access any event detail page in under 3 seconds (LCP < 3s)

- **SC-002**: Organizers can create a new event from scratch and publish it in under 5 minutes without developer assistance

- **SC-003**: Event detail pages achieve 90+ score on Google PageSpeed Insights (mobile)

- **SC-004**: All event detail pages pass Google Rich Results Test for Event schema validation

- **SC-005**: System successfully handles concurrent access by 500+ users during event announcement periods without performance degradation

- **SC-006**: 100% of published events are accessible via both web UI and REST API within 60 seconds of publication

- **SC-007**: Zero broken images on event pages (all missing images fallback to placeholder)

- **SC-008**: Event pages are successfully crawled and indexed by Google within 48 hours of publication

- **SC-009**: Social media shares (Twitter, LinkedIn) correctly display event preview image and description 95% of the time

- **SC-010**: Admin interface has 95% task completion rate for event creation (organizers successfully publish without errors)

- **SC-011**: Organizers can create a speaker profile and assign it to multiple events in under 3 minutes, with changes to speaker info reflecting across all associated events within 60 seconds

