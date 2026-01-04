# Feature Specification: Event Attendee Registration

**Created**: January 4, 2026

## User Scenarios & Testing *(mandatory)*

### User Story 1 - New Member Registers for Event (Priority: P1)

A visitor discovers an upcoming MedellinJS event and wants to attend. They are not yet a member of the community but want to register using their LinkedIn account.

**Why this priority**: This is the primary user flow that enables community growth by allowing new members to join through event registration. It's the most common path for acquiring new community members and must work seamlessly.

**Independent Test**: Can be fully tested by visiting an event detail page as a non-authenticated user, clicking "Asistir al Evento", completing LinkedIn authentication, filling out the member registration form, and verifying the user appears in both the members table and the event's attendees list.

**Acceptance Scenarios**:

1. **Scenario**: First-time visitor registers for an event
   - **Given** an unauthenticated user viewing a future event detail page
   - **And** the user is not registered as an attendee
   - **When** they click the "Asistir al Evento" button
   - **Then** they are redirected to LinkedIn authentication
   - **And** after successful authentication, they see a member registration form pre-filled with LinkedIn data (email, name, profile image)
   - **And** the form requests additional information (job position and job level)

2. **Scenario**: New member completes registration form
   - **Given** a user who just authenticated with LinkedIn and is not in the members table
   - **When** they fill out the required fields (fullName, jobPosition, jobLevel)
   - **And** submit the registration form
   - **Then** a new member record is created with their information
   - **And** they are automatically added to the event's attendees list with name and avatarUrl
   - **And** a success message is displayed: "¡Registro exitoso! Te esperamos en el evento."
   - **And** the "Asistir al Evento" button is replaced with "Ya estás registrado" (disabled state)

3. **Scenario**: Registration form validation
   - **Given** a user filling out the member registration form
   - **When** they attempt to submit with incomplete data
   - **Then** validation errors are displayed for missing required fields
   - **And** the form cannot be submitted until all required fields are valid

---

### User Story 2 - Existing Member Registers for Event (Priority: P1)

A current MedellinJS community member who is already in the members table wants to register for a new event.

**Why this priority**: This is equally critical as P1 because existing members are our most engaged users. They should have a streamlined experience without friction when registering for events.

**Independent Test**: Can be fully tested by authenticating as an existing member, navigating to an event detail page, clicking "Asistir al Evento", and verifying immediate registration without showing the member form.

**Acceptance Scenarios**:

1. **Scenario**: Existing member registers for event with single click
   - **Given** an authenticated user who exists in the members table
   - **And** viewing a future event detail page
   - **And** they are not yet registered as an attendee
   - **When** they click the "Asistir al Evento" button
   - **Then** they are immediately added to the event's attendees list
   - **And** no registration form is shown
   - **And** a success message is displayed: "¡Registro confirmado! Te esperamos en el evento."
   - **And** the button changes to "Ya estás registrado" (disabled state)

2. **Scenario**: Member data is correctly added to event
   - **Given** an existing member registering for an event
   - **When** the registration is completed
   - **Then** the event's attendees array includes an entry with:
     - name: member's fullName
     - avatarUrl: member's profileImage (from LinkedIn)

---

### User Story 3 - Already Registered User Views Event (Priority: P2)

A user who is already registered as an attendee for an event returns to the event detail page.

**Why this priority**: This prevents duplicate registrations and provides clear feedback to users about their registration status. While important for UX, it's less critical than the registration flows themselves.

**Independent Test**: Can be fully tested by registering for an event, then returning to the event detail page and verifying the registration button is not shown or is disabled.

**Acceptance Scenarios**:

1. **Scenario**: Registered attendee views event page
   - **Given** a user who is already in the event's attendees list
   - **When** they visit the event detail page
   - **Then** the "Asistir al Evento" button is not displayed
   - **And** instead, a message is shown: "Ya estás registrado para este evento"
   - **And** their avatar appears in the attendees section

2. **Scenario**: System detects existing registration
   - **Given** an authenticated user viewing an event
   - **When** the page loads
   - **Then** the system checks if the user's email or nextAuthId matches any attendee
   - **And** updates the UI accordingly without requiring user action

---

### User Story 4 - Registration for Past Events Prevented (Priority: P3)

A user attempts to register for an event that has already occurred.

**Why this priority**: This is a defensive measure to prevent edge cases. It's lower priority because past events shouldn't typically be promoted, but it's still important for data integrity.

**Independent Test**: Can be fully tested by navigating to a past event's detail page and verifying no registration button is shown.

**Acceptance Scenarios**:

1. **Scenario**: Past event shows no registration option
   - **Given** a user viewing an event where startDate < current date/time
   - **When** the page renders
   - **Then** no "Asistir al Evento" button is displayed
   - **And** a message indicates "Este evento ya finalizó"

---

### Edge Cases

- **What happens when LinkedIn authentication fails?**
  - System displays error message: "No se pudo conectar con LinkedIn. Por favor, intenta nuevamente."
  - User can retry authentication
  - No partial data is saved

- **What happens if a user closes the browser during member registration?**
  - LinkedIn authentication is preserved in NextAuth session
  - User can return and complete registration later
  - No member record is created until form submission is successful

- **What happens when event reaches maxAttendees capacity?**
  - Registration button is disabled with message: "Evento lleno - capacidad máxima alcanzada"
  - Button shows "Lista de espera" if waitlist feature is available (future enhancement)

- **What happens if two users try to register simultaneously for the last spot?**
  - System uses database transaction to ensure atomic registration
  - First successful commit wins
  - Second user sees capacity reached message

- **What happens if LinkedIn profile has no image?**
  - System uses a default placeholder avatar URL
  - User's name is still captured and displayed

- **What happens when a user's LinkedIn data changes between sessions?**
  - Member data is only created once at first registration
  - Subsequent logins use existing member record
  - Profile updates should be done through profile management (future feature)

- **What happens if member registration succeeds but event registration fails?**
  - Member record is created (irreversible)
  - Error message displayed: "Registro de miembro exitoso, pero hubo un error al registrarte en el evento. Por favor, intenta asistir al evento nuevamente."
  - User can retry event registration without re-registering as member

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate users via LinkedIn OAuth before allowing event registration
- **FR-002**: System MUST check if authenticated user exists in members table by nextAuthId
- **FR-003**: System MUST display member registration form if user does not exist in members table
- **FR-004**: System MUST pre-fill member registration form with LinkedIn data (email, fullName, profileImage)
- **FR-005**: System MUST validate all required member fields (fullName, email, jobPosition, jobLevel) before submission
- **FR-006**: System MUST create member record with data: nextAuthId, fullName, email, jobPosition, profileImage, jobLevel, role
- **FR-007**: System MUST add user to event's attendees array with name and avatarUrl after member registration
- **FR-008**: System MUST add existing member to event's attendees array immediately upon registration (without showing form)
- **FR-009**: System MUST hide or disable registration button if user is already in event's attendees list
- **FR-010**: System MUST prevent registration for events where startDate has passed
- **FR-011**: System MUST prevent registration when event has reached maxAttendees capacity (if specified)
- **FR-012**: System MUST display appropriate success messages after successful registration
- **FR-013**: System MUST display appropriate error messages when registration fails
- **FR-014**: System MUST match existing attendees by comparing nextAuthId or email to determine registration status
- **FR-015**: System MUST persist member data to Payload CMS members collection
- **FR-016**: System MUST persist attendee data to Payload CMS events collection

### Key Entities

- **Member**: Represents a community member who can attend events
  - nextAuthId (string, unique, required): LinkedIn/NextAuth user identifier
  - fullName (string, required): Full name from LinkedIn or user input
  - email (string, unique, required): Email from LinkedIn
  - jobPosition (string, required): Current job title/role
  - jobLevel (enum, required): JUNIOR, MID_LEVEL, SENIOR, LEAD
  - profileImage (string, optional): LinkedIn profile image URL
  - role (enum): MEMBER, ADMIN (defaults to MEMBER)

- **Event Attendee** (nested in Event): Represents a user registered for a specific event
  - name (string, required): Attendee's full name (copied from member)
  - avatarUrl (string, optional): Attendee's profile image URL (copied from member)
  - Relationship: Linked to Event via attendees array field

- **Event**: Represents a MedellinJS event (existing collection)
  - attendees (array): List of attendee objects with name and avatarUrl
  - maxAttendees (number, optional): Maximum capacity for event
  - startDate (date, required): Event start date/time
  - isPublished (boolean): Whether event is visible to public

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: New members can complete registration and event signup in under 3 minutes from landing on event page
- **SC-002**: Existing members can register for events in under 10 seconds (single click)
- **SC-003**: System correctly prevents duplicate registrations 100% of the time
- **SC-004**: 95% of registration attempts are successful without requiring support intervention
- **SC-005**: Registration form validation catches 100% of invalid inputs before submission
- **SC-006**: Event capacity limits are enforced with zero over-booking incidents
- **SC-007**: LinkedIn authentication success rate is above 98%
- **SC-008**: Registration confirmation messages are displayed within 2 seconds of completion

### User Experience Goals

- **UX-001**: User understands their registration status immediately upon viewing event page
- **UX-002**: Registration process feels seamless with minimal friction
- **UX-003**: Error messages are clear and actionable
- **UX-004**: Success states are celebratory and engaging

### Technical Goals

- **TG-001**: Registration operations are atomic (all or nothing)
- **TG-002**: Database operations use proper transactions to prevent race conditions
- **TG-003**: Authentication state is properly managed across navigation
- **TG-004**: Component re-renders are minimized for performance

