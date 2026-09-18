import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import AttendButton from './AttendButton'

const mockUseEventRegistration = vi.fn()

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
  useSession: () => ({ data: null, status: 'unauthenticated' }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}))

vi.mock('@/hooks/useEventRegistration', () => ({
  useEventRegistration: () => mockUseEventRegistration(),
}))

// AttendButton statically imports EventRegistrationModal, which pulls in
// server actions that transitively import '@/auth' (next-auth core, which
// requires 'next/server'). Stub it so the module graph stays test-safe.
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

const registeredHookState = {
  state: 'registered',
  isRegistered: true,
  needsMemberForm: false,
  error: null,
  registerExistingMember: vi.fn(),
  markAsRegistered: vi.fn(),
  checkRegistration: vi.fn(),
}

const notRegisteredHookState = {
  ...registeredHookState,
  state: 'not_registered',
  isRegistered: false,
}

describe('AttendButton — AddToCalendar gating', () => {
  beforeEach(() => {
    // jsdom does not implement IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })) as unknown as typeof IntersectionObserver
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders AddToCalendar when isRegistered is true AND eventStartDate is present', () => {
    mockUseEventRegistration.mockReturnValue(registeredHookState)

    render(
      <AttendButton
        eventId="42"
        eventTitle="MedellínJS Meetup"
        eventStartDate="2026-03-10T23:30:00.000Z"
      />,
    )

    // AddToCalendar renders a Google Calendar link once mounted
    expect(screen.getByLabelText('Agregar evento a Google Calendar')).toBeTruthy()
  })

  it('does NOT render AddToCalendar when isRegistered is false, even with eventStartDate present', () => {
    mockUseEventRegistration.mockReturnValue(notRegisteredHookState)

    render(
      <AttendButton
        eventId="42"
        eventTitle="MedellínJS Meetup"
        eventStartDate="2026-03-10T23:30:00.000Z"
      />,
    )

    expect(screen.queryByLabelText('Agregar evento a Google Calendar')).toBeNull()
  })

  it('does NOT render AddToCalendar when isRegistered is true but eventStartDate is missing', () => {
    mockUseEventRegistration.mockReturnValue(registeredHookState)

    render(<AttendButton eventId="42" eventTitle="MedellínJS Meetup" />)

    expect(screen.queryByLabelText('Agregar evento a Google Calendar')).toBeNull()
  })
})
