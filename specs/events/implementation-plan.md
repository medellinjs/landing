# Implementation Plan: Event Attendee Registration

**Date**: January 4, 2026
**Spec**: [event-attendee-registration.md](./event-attendee-registration.md)

## Summary

Implement a streamlined event registration system that allows users to register for MedellinJS events using LinkedIn authentication. New users will complete a one-time member registration form, while existing members can register with a single click. The system will prevent duplicate registrations and enforce event capacity limits.

**Technical Approach**:
- Leverage existing NextAuth LinkedIn integration
- Reuse MigrationPage form component pattern for new member registration
- Create server actions for event attendee management
- Implement client-side registration state detection
- Use Payload CMS Local API for data persistence

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 14 (App Router)
**Primary Dependencies**:
- Payload CMS 3.x (mongooseAdapter)
- NextAuth.js (LinkedIn OAuth)
- React Hook Form + Zod validation
- TailwindCSS + shadcn/ui components

**Storage**: Postgres via Payload CMS collections (members, events)
**Testing**: Playwright (E2E), Vitest (integration/unit)
**Target Platform**: Web (Next.js App Router - Server + Client Components)
**Project Type**: Full-stack web application (Next.js unified structure)
**Performance Goals**:
- Registration flow completion < 3 minutes for new members
- < 2 second response time for registration actions
- < 10 seconds for existing member registration

**Constraints**:
- LinkedIn OAuth only (no other providers for this feature)
- Must prevent duplicate registrations
- Must enforce maxAttendees capacity
- Must prevent registration for past events
- Member data immutable after creation

**Scale/Scope**:
- ~500-1000 community members
- ~12-20 events per year
- ~30-100 attendees per event
- Single event registration page

## Project Structure

### Documentation (this feature)

```text
specs/events/
├── implementation-plan.md       # This file
└── event-attendee-registration.md  # Feature specification
```

### Source Code (repository root)

```text
src/
├── actions/
│   ├── member.ts               # [MODIFY] Add member lookup by email
│   └── event.ts                # [CREATE] Event attendee management actions
├── app/
│   ├── (frontend)/
│   │   └── events/
│   │       └── [slug]/
│   │           └── page.tsx    # [MODIFY] Pass event ID to EventDetail
│   └── api/
│       └── events/
│           └── register/
│               └── route.ts    # [CREATE] Optional API endpoint
├── collections/
│   ├── Events.ts               # [EXISTING] Has attendees array field
│   └── Members.ts              # [EXISTING] Member schema
├── components/
│   ├── auth/
│   │   └── AttendButton.tsx    # [MODIFY] Add registration logic
│   ├── events/
│   │   ├── EventDetail.tsx     # [MODIFY] Use real attendees, pass event ID
│   │   ├── AttendeeList.tsx    # [EXISTING] Display component
│   │   └── EventRegistrationForm.tsx  # [CREATE] Member registration form
│   └── MigrationPage.tsx       # [REFERENCE] Form pattern to reuse
├── lib/
│   └── types/
│       ├── member.ts           # [EXISTING] Member schema
│       └── event.ts            # [CREATE] Event registration types
└── hooks/
    └── useEventRegistration.ts # [CREATE] Registration state management

tests/
├── e2e/
│   └── event-registration.e2e.spec.ts  # [CREATE] E2E tests
└── int/
    └── event-registration.int.spec.ts  # [CREATE] Integration tests
```

**Structure Decision**: Using Next.js App Router unified structure where frontend and backend coexist. Server Actions handle backend logic, avoiding separate API routes unless needed for external integrations. Client Components for interactive UI, Server Components for data fetching.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and shared utilities

- [ ] **T001** Create event registration type definitions in `src/lib/types/event.ts`
  - AttendeeInput type: `{ name: string; avatarUrl?: string }`
  - EventRegistrationResult type for action responses
  - EventRegistrationError enum for error handling

- [ ] **T002** Add TypeScript types for extended session user
  - Extend NextAuth types to include user.id, user.image
  - Add to `src/auth.ts` or separate types file

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core server actions and data operations that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] **T003** [P] Create `checkEventRegistration` server action in `src/actions/event.ts`
  - Input: eventId (string), userId (string)
  - Query event by ID
  - Check if attendees array contains user (match by name/email)
  - Return: `{ isRegistered: boolean; attendee?: Attendee }`
  - Add logging for all operations

- [ ] **T004** [P] Create `registerAttendeeToEvent` server action in `src/actions/event.ts`
  - Input: eventId (string), attendee (AttendeeInput)
  - Validate event exists and isPublished
  - Validate event is in the future (startDate > now)
  - Check maxAttendees capacity if specified
  - Check for duplicate registration (by name or avatarUrl)
  - Add attendee to events.attendees array using Payload update
  - Return success/error result
  - Add comprehensive error handling and logging

- [ ] **T005** [P] Create `getEventById` server action in `src/actions/event.ts`
  - Input: eventId (string)
  - Fetch event with populated speakers and attendees
  - Return event data or null
  - Cache appropriately for performance

- [ ] **T006** [P] Modify `retrieveMember` in `src/actions/member.ts`
  - Add overload to retrieve by email as alternative to nextAuthId
  - Add `retrieveMemberByEmail(email: string)` function
  - Maintain backward compatibility

- [ ] **T007** Create integration tests for foundational actions in `tests/int/event-actions.int.spec.ts`
  - Test checkEventRegistration with registered/unregistered users
  - Test registerAttendeeToEvent success cases
  - Test registerAttendeeToEvent validation failures
  - Test capacity limits enforcement
  - Test past event registration prevention

**Checkpoint**: Foundation ready - all server actions tested and working

---

## Phase 3: User Story 1 - New Member Registers for Event (Priority: P1)

**Goal**: First-time visitor can authenticate with LinkedIn, complete member registration form, and be registered for the event in one flow

**Independent Test**: Visit event page as unauthenticated user, click attend button, complete LinkedIn auth and member form, verify user in both members and event attendees

### Tests for User Story 1

- [ ] **T008** [P] [US1] E2E test for new member registration flow in `tests/e2e/event-registration.e2e.spec.ts`
  - Mock LinkedIn OAuth response
  - Navigate to event detail page
  - Click attend button
  - Complete member registration form
  - Verify success message
  - Verify attendee appears in list
  - Verify button state changes

- [ ] **T009** [P] [US1] Integration test for complete registration flow in `tests/int/event-registration.int.spec.ts`
  - Test member creation + event registration atomically
  - Test form validation
  - Test error recovery scenarios

### Implementation for User Story 1

- [ ] **T010** [P] [US1] Create `EventRegistrationForm` component in `src/components/events/EventRegistrationForm.tsx`
  - Client component using React Hook Form + Zod
  - Reuse form pattern from MigrationPage.tsx
  - Fields: fullName, email (disabled), jobPosition, jobLevel
  - Pre-fill with session data (email, name, image)
  - Call createMember server action on submit
  - Handle loading and error states
  - Show success message after registration
  - Accept onSuccess callback prop

- [ ] **T011** [P] [US1] Create `useEventRegistration` hook in `src/hooks/useEventRegistration.ts`
  - Manage registration flow state machine
  - States: checking, needsMemberForm, registering, registered, error
  - Expose: state, checkRegistration, registerToEvent, error
  - Handle session changes
  - Cache registration status

- [ ] **T012** [US1] Create `EventRegistrationModal` component in `src/components/events/EventRegistrationModal.tsx`
  - Modal/Dialog wrapper for EventRegistrationForm
  - Show when user needs to complete member registration
  - Handle success flow: create member → register to event
  - Display appropriate loading states during multi-step process
  - Handle errors gracefully with retry option

- [ ] **T013** [US1] Modify `AttendButton` component in `src/components/auth/AttendButton.tsx`
  - Accept eventId and eventSlug props
  - Add registration checking logic on mount (if authenticated)
  - Show different states:
    - "Asistir al evento" (unauthenticated or not registered)
    - "Ya estás registrado" (disabled, if registered)
    - Loading spinner during checks
  - After LinkedIn sign-in, check if member exists
  - If no member, show EventRegistrationModal
  - If member exists, call registerAttendeeToEvent directly
  - Update button state based on registration result

- [ ] **T014** [US1] Add `registerNewMemberToEvent` orchestration action in `src/actions/event.ts`
  - Input: memberData (Member), eventId (string)
  - Step 1: Call createMember
  - Step 2: If successful, call registerAttendeeToEvent with member data
  - Handle partial failures (member created but event registration failed)
  - Return comprehensive result with both operations status
  - Add transaction support if possible with MongoDB

- [ ] **T015** [US1] Update EventDetail component to handle registration in `src/components/events/EventDetail.tsx`
  - Pass event.id to AttendButton
  - Remove hardcoded attendees mock data
  - Use real event.attendees from props
  - Pass session data to components
  - Handle registration state changes

- [ ] **T016** [US1] Modify event detail page to pass event ID in `src/app/(frontend)/events/[slug]/page.tsx`
  - Fetch event by slug (already done)
  - Pass event.id to EventDetail component
  - Pass session to EventDetail if needed

**Checkpoint**: New users can complete full registration flow - member creation + event registration working end-to-end

---

## Phase 4: User Story 2 - Existing Member Registers for Event (Priority: P1)

**Goal**: Existing community members can register for events with a single click without seeing the member form

**Independent Test**: Authenticate as existing member, click attend button, verify immediate registration without form

### Tests for User Story 2

- [ ] **T017** [P] [US2] E2E test for existing member registration in `tests/e2e/event-registration.e2e.spec.ts`
  - Create test member in database
  - Authenticate with that member's credentials
  - Navigate to event page
  - Click attend button
  - Verify immediate registration (no form shown)
  - Verify success message and button state change

- [ ] **T018** [P] [US2] Integration test for existing member flow in `tests/int/event-registration.int.spec.ts`
  - Test member lookup by nextAuthId
  - Test direct event registration
  - Test duplicate registration prevention

### Implementation for User Story 2

- [ ] **T019** [P] [US2] Add member existence check to AttendButton flow in `src/components/auth/AttendButton.tsx`
  - After authentication, call retrieveMember(session.user.id)
  - If member exists, skip form and go directly to event registration
  - Call registerAttendeeToEvent with member's fullName and profileImage
  - Show success toast/message
  - Update button state to "registered"

- [ ] **T020** [US2] Create `registerExistingMemberToEvent` action in `src/actions/event.ts`
  - Input: eventId (string), nextAuthId (string)
  - Step 1: Retrieve member by nextAuthId
  - Step 2: If not found, return error
  - Step 3: Call registerAttendeeToEvent with member data
  - Return result
  - Add logging

- [ ] **T021** [US2] Add optimistic updates to useEventRegistration hook in `src/hooks/useEventRegistration.ts`
  - Update local state immediately on registration
  - Revert on error
  - Show loading state during API call

**Checkpoint**: Existing members can register with single click - no form required

---

## Phase 5: User Story 3 - Already Registered User Views Event (Priority: P2)

**Goal**: Users who are already registered see appropriate UI state and cannot re-register

**Independent Test**: Register for an event, navigate away, return to event page, verify button shows "registered" state

### Tests for User Story 3

- [ ] **T022** [P] [US3] E2E test for registered user viewing event in `tests/e2e/event-registration.e2e.spec.ts`
  - Register user for event (setup)
  - Navigate to event page
  - Verify button shows "Ya estás registrado" (disabled)
  - Verify user's avatar appears in attendees list
  - Verify no registration action can be triggered

- [ ] **T023** [P] [US3] Integration test for registration status check in `tests/int/event-registration.int.spec.ts`
  - Test checkEventRegistration returns true for registered users
  - Test multiple check methods (by nextAuthId, by email)

### Implementation for User Story 3

- [ ] **T024** [P] [US3] Implement registration status checking on page load in `src/components/auth/AttendButton.tsx`
  - On component mount, if authenticated, call checkEventRegistration
  - Store result in component state
  - Disable button if already registered
  - Change button text to "Ya estás registrado"
  - Show checkmark icon or similar visual indicator

- [ ] **T025** [US3] Add user avatar highlighting in AttendeeList in `src/components/events/AttendeeList.tsx`
  - Accept currentUserEmail or currentUserId prop
  - Highlight current user's avatar with border or badge
  - Add "Tú" label on current user's avatar
  - Improve visual feedback

- [ ] **T026** [US3] Add registration status to EventDetail component in `src/components/events/EventDetail.tsx`
  - Check registration status on server side if possible
  - Pass registration status to AttendButton
  - Optimize to reduce client-side API calls

**Checkpoint**: Registered users see correct UI state and cannot duplicate registration

---

## Phase 6: User Story 4 - Registration for Past Events Prevented (Priority: P3)

**Goal**: System prevents registration for events that have already occurred

**Independent Test**: Navigate to past event page, verify no registration button is shown

### Tests for User Story 4

- [ ] **T027** [P] [US4] E2E test for past event handling in `tests/e2e/event-registration.e2e.spec.ts`
  - Create past event in database
  - Navigate to past event page
  - Verify no attend button is shown
  - Verify message "Este evento ya finalizó" is displayed

- [ ] **T028** [P] [US4] Integration test for past event validation in `tests/int/event-registration.int.spec.ts`
  - Test registerAttendeeToEvent rejects past events
  - Test proper error message returned

### Implementation for User Story 4

- [ ] **T029** [US4] Add date validation to registerAttendeeToEvent in `src/actions/event.ts`
  - Check if event.startDate < new Date()
  - Return specific error: "EVENT_ALREADY_PASSED"
  - Include in error response

- [ ] **T030** [US4] Add conditional rendering in EventDetail in `src/components/events/EventDetail.tsx`
  - Already has `isUpcomingEvent` check
  - Verify AttendButton only renders for upcoming events
  - Add "Este evento ya finalizó" message for past events
  - Add "Ver fotos y resumen" CTA for past events (future enhancement)

**Checkpoint**: Past events cannot be registered for - validation on both client and server

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] **T031** Add comprehensive error handling and user feedback
  - Create error message mapping in `src/lib/constants/errors.ts`
  - Add toast notifications for all error states
  - Add success animations for completed registrations
  - Add retry mechanisms for failed operations

- [ ] **T032** Add capacity enforcement UI feedback
  - Show "X / Y spots remaining" on event card
  - Show "Event Full" badge when maxAttendees reached
  - Disable button with appropriate message
  - Add waitlist feature (future enhancement placeholder)

- [ ] **T033** Optimize performance
  - Add caching strategy for member lookups
  - Add caching for event registration status
  - Minimize re-renders in AttendButton
  - Add loading skeletons for better perceived performance

- [ ] **T034** Improve accessibility
  - Add ARIA labels to all interactive elements
  - Ensure keyboard navigation works throughout flow
  - Add screen reader announcements for state changes
  - Test with accessibility tools

- [ ] **T035** Add analytics tracking
  - Track registration flow start
  - Track registration completion
  - Track drop-off points
  - Track registration time
  - Add to existing analytics setup

- [ ] **T036** Add admin features in Payload CMS
  - Add custom field to view registration count in Events admin
  - Add bulk export of attendees
  - Add email notification system for new registrations (future)

- [ ] **T037** Documentation updates
  - Update README with event registration flow
  - Add inline code comments for complex logic
  - Create admin guide for managing events
  - Document error codes and handling

- [ ] **T038** Security hardening
  - Add rate limiting to registration endpoints
  - Add CSRF protection verification
  - Validate all user inputs server-side
  - Add logging for suspicious activity

- [ ] **T039** Add LinkedIn profile data sync
  - Store LinkedIn profile URL
  - Periodically update profile images
  - Handle profile privacy settings

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase - Primary flow
- **User Story 2 (Phase 4)**: Depends on Foundational phase - Can run parallel with US1 but shares components
- **User Story 3 (Phase 5)**: Depends on US1 and US2 completion - Builds on registration flow
- **User Story 4 (Phase 6)**: Depends on Foundational phase - Can run in parallel with other stories
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**:
  - Foundational phase complete
  - Core flow - most complex
  - Deliverable: New member can register for events

- **User Story 2 (P1)**:
  - Foundational phase complete
  - Shares AttendButton with US1
  - Can be developed after US1 or in parallel with coordination
  - Deliverable: Existing member can register quickly

- **User Story 3 (P2)**:
  - US1 and US2 must be complete
  - Extends registration checking logic
  - Deliverable: No duplicate registrations

- **User Story 4 (P3)**:
  - Only needs Foundational phase
  - Can be done in parallel with others
  - Deliverable: Past event protection

### Task Dependencies Within Phases

**Phase 2 (Foundational)**:
- T003, T004, T005, T006 can run in parallel (different files)
- T007 depends on T003-T006

**Phase 3 (US1)**:
- T008, T009 can run in parallel (test setup)
- T010 (form component) independent
- T011 (hook) independent
- T012 (modal) depends on T010
- T013 (AttendButton) depends on T011, T012
- T014 (orchestration) depends on T004, T006
- T015, T016 depend on T013

**Phase 4 (US2)**:
- T017, T018 can run in parallel
- T019 modifies T013 (AttendButton) from Phase 3
- T020 (action) independent
- T021 modifies T011 from Phase 3

**Phase 5 (US3)**:
- T022, T023 can run in parallel
- T024 modifies AttendButton (T013, T019)
- T025, T026 independent but build on previous work

**Phase 6 (US4)**:
- T027, T028 can run in parallel
- T029, T030 independent

### Critical Path

1. Phase 1 (Setup) → Phase 2 (Foundational) → **T003, T004** (core actions)
2. Phase 3 → **T010, T011, T012, T013, T014** (new member flow)
3. Phase 4 → **T019, T020** (existing member flow)
4. Phase 5 → **T024** (status checking)
5. Phase 6 → **T029, T030** (validation)
6. Phase 7 → **T031, T032** (error handling, UI polish)

### Recommended Execution Strategy

**Week 1**: Phases 1-2
- Complete setup and all foundational actions
- Validate with integration tests
- Checkpoint: All server actions working

**Week 2**: Phase 3
- Build complete new member registration flow
- Focus on happy path first
- Checkpoint: New member can register end-to-end

**Week 3**: Phases 4-5
- Add existing member fast path
- Add duplicate prevention
- Checkpoint: Both member types can register

**Week 4**: Phases 6-7
- Add validation and edge cases
- Polish UI and error handling
- Full testing and documentation
- Checkpoint: Feature complete and polished

## Notes

### Important Considerations

- **[Story]** label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests pass after each phase
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently

### Technical Decisions

- **Server Actions vs API Routes**: Using Server Actions for simplicity and type safety
- **State Management**: React hooks for registration state (no global state needed)
- **Form Handling**: React Hook Form for consistency with existing forms
- **Error Handling**: Return error objects from actions, display with toast notifications
- **Caching**: Use React cache() for deduplication, consider SWR for client-side caching

### Avoid

- Creating new database collections (use existing Events and Members)
- Adding new authentication providers (LinkedIn only for this feature)
- Complex state management libraries (keep it simple with hooks)
- Breaking existing migration page functionality
- Modifying core Payload CMS collections structure unnecessarily

### Future Enhancements (Out of Scope)

- Waitlist functionality when events are full
- Email notifications for registration confirmation
- Calendar integration (.ics file download)
- Event check-in system for organizers
- Attendee networking features
- Event cancellation and refunds
- Multiple events registration (bulk)
