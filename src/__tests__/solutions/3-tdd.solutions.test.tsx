// ============================================================
// SOLUTIONS: TDD (exercises/3-tdd.md)
//
// Each test targets a feature added to an existing component.
// The component changes required for each exercise are listed
// in a comment above the describe block.
// ============================================================

import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpForm from '../../components/SignUpForm';
import Header from '../../components/Header';
import ParticipantCard from '../../components/ParticipantCard';
import TournamentPage from '../../pages/TournamentPage';
import type { Participant } from '../../types';

// ─────────────────────────────────────────────────────────────
// exercise 1
// Component change: add <span>{name.length} / 50</span> below the name input in SignUpForm
// ─────────────────────────────────────────────────────────────
describe('Exercise 1 – character counter', () => {
  test('shows the character count as the user types', async () => {
    const user = userEvent.setup();
    render(<SignUpForm onSignUp={jest.fn()} />);

    await user.type(screen.getByLabelText(/name/i), 'Alice');

    expect(screen.getByText('5 / 50')).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────
// exercise 2
// Component change: add nameError state to SignUpForm;
//   set to 'Name is required' on submit when name is empty
// ─────────────────────────────────────────────────────────────
describe('Exercise 2 – empty name validation', () => {
  test('shows "Name is required" and blocks submission', async () => {
    const user = userEvent.setup();
    const mockOnSignUp = jest.fn();
    render(<SignUpForm onSignUp={mockOnSignUp} />);

    await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(mockOnSignUp).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────
// exercise 3
// Component change: add emailError state to SignUpForm;
//   set to 'Please enter a valid email' when email has no '@'
// ─────────────────────────────────────────────────────────────
describe('Exercise 3 – email format validation', () => {
  test('shows an error for an email without @', async () => {
    const user = userEvent.setup();
    render(<SignUpForm onSignUp={jest.fn()} />);

    await user.type(screen.getByLabelText(/name/i), 'Alice');
    await user.type(screen.getByLabelText(/email/i), 'notanemail');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────
// exercise 4
// Component change: add optional count?: number prop to Header;
//   render <span data-testid="count-badge">{count}</span> when provided
// ─────────────────────────────────────────────────────────────
describe('Exercise 4 – participant count badge in Header', () => {
  test('renders the count badge when the prop is provided', () => {
    render(<Header title="Sign-Ups" count={7} />);
    expect(screen.getByTestId('count-badge')).toHaveTextContent('7');
  });

  test('does not render the count badge when the prop is omitted', () => {
    render(<Header title="Sign-Ups" />);
    expect(screen.queryByTestId('count-badge')).not.toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────
// exercise 5
// Component change: add filterCategory state and
//   <select data-testid="category-filter"> to TournamentPage;
//   filter displayedParticipants by selected category
// ─────────────────────────────────────────────────────────────
describe('Exercise 5 – category filter', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('filters the list to show only Beginner participants', async () => {
    const user = userEvent.setup({ delay: null });
    render(<TournamentPage onNavigateToSignUp={jest.fn()} newParticipant={null} />);
    act(() => jest.runAllTimers());
    await waitFor(() =>
      expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument()
    );

    await user.selectOptions(screen.getByTestId('category-filter'), 'Beginner');

    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.queryByText('Alice Chen')).not.toBeInTheDocument();
    expect(screen.queryByText('Carol Davis')).not.toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────
// exercise 6
// Component change: add searchQuery state and
//   <input data-testid="search-input"> to TournamentPage;
//   filter displayedParticipants by name (case-insensitive)
// ─────────────────────────────────────────────────────────────
describe('Exercise 6 – search by name', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('shows only participants whose name matches the search query', async () => {
    const user = userEvent.setup({ delay: null });
    render(<TournamentPage onNavigateToSignUp={jest.fn()} newParticipant={null} />);
    act(() => jest.runAllTimers());
    await waitFor(() =>
      expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument()
    );

    await user.type(screen.getByTestId('search-input'), 'alice');

    expect(screen.getByText('Alice Chen')).toBeInTheDocument();
    expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────
// exercise 7
// Component change: add a <button>Clear All</button> to TournamentPage
//   that calls setParticipants([])
// ─────────────────────────────────────────────────────────────
describe('Exercise 7 – clear all participants', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('removes all cards and shows the empty-state message', async () => {
    const user = userEvent.setup({ delay: null });
    render(<TournamentPage onNavigateToSignUp={jest.fn()} newParticipant={null} />);
    act(() => jest.runAllTimers());
    await waitFor(() =>
      expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument()
    );

    expect(screen.getAllByTestId('participant-card')).toHaveLength(3);

    await user.click(screen.getByRole('button', { name: /clear all/i }));

    expect(screen.queryAllByTestId('participant-card')).toHaveLength(0);
    expect(screen.getByTestId('empty-message')).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────
// exercise 8
// Component change: add existingEmails?: string[] prop to SignUpForm;
//   on submit, if email is in existingEmails show
//   'This email is already registered' and block onSignUp
// ─────────────────────────────────────────────────────────────
describe('Exercise 8 – prevent duplicate email', () => {
  test('blocks submission and shows an error for a duplicate email', async () => {
    const user = userEvent.setup();
    const mockOnSignUp = jest.fn();
    render(
      <SignUpForm
        onSignUp={mockOnSignUp}
        existingEmails={['alice@example.com']}
      />
    );

    await user.type(screen.getByLabelText(/name/i), 'Alice Chen');
    await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(screen.getByText('This email is already registered')).toBeInTheDocument();
    expect(mockOnSignUp).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────
// exercise 9
// Component change: add confirmBeforeRemove?: boolean prop to ParticipantCard;
//   when true, clicking Remove first shows "Are you sure?" with
//   Confirm and Cancel buttons instead of calling onRemove directly
// ─────────────────────────────────────────────────────────────
describe('Exercise 9 – confirmation before removing', () => {
  const p: Participant = { id: 1, name: 'Alice', email: 'alice@example.com', category: 'Advanced' };

  test('clicking Remove shows the confirmation prompt', async () => {
    const user = userEvent.setup();
    render(<ParticipantCard participant={p} onRemove={jest.fn()} confirmBeforeRemove />);

    await user.click(screen.getByRole('button', { name: /remove/i }));

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  test('clicking Cancel hides the prompt without calling onRemove', async () => {
    const user = userEvent.setup();
    const mockOnRemove = jest.fn();
    render(<ParticipantCard participant={p} onRemove={mockOnRemove} confirmBeforeRemove />);

    await user.click(screen.getByRole('button', { name: /remove/i }));
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
    expect(mockOnRemove).not.toHaveBeenCalled();
  });

  test('clicking Confirm calls onRemove with the participant id', async () => {
    const user = userEvent.setup();
    const mockOnRemove = jest.fn();
    render(<ParticipantCard participant={p} onRemove={mockOnRemove} confirmBeforeRemove />);

    await user.click(screen.getByRole('button', { name: /remove/i }));
    await user.click(screen.getByRole('button', { name: /confirm/i }));

    expect(mockOnRemove).toHaveBeenCalledWith(1);
  });
});

// ─────────────────────────────────────────────────────────────
// exercise 10
// Component change: add maxParticipants?: number prop to TournamentPage;
//   when participants.length >= maxParticipants, disable the
//   "Go to Sign Up" button and change its label to "Tournament Full"
// ─────────────────────────────────────────────────────────────
describe('Exercise 10 – max participant limit', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('disables the button and shows "Tournament Full" when the limit is reached', async () => {
    render(
      <TournamentPage
        onNavigateToSignUp={jest.fn()}
        newParticipant={null}
        maxParticipants={3}
      />
    );
    act(() => jest.runAllTimers());
    await waitFor(() =>
      expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument()
    );

    const button = screen.getByRole('button', { name: /tournament full/i });
    expect(button).toBeDisabled();
  });

  test('button is enabled and shows "Go to Sign Up" when under the limit', async () => {
    render(
      <TournamentPage
        onNavigateToSignUp={jest.fn()}
        newParticipant={null}
        maxParticipants={5}
      />
    );
    act(() => jest.runAllTimers());
    await waitFor(() =>
      expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument()
    );

    const button = screen.getByRole('button', { name: /go to sign up/i });
    expect(button).not.toBeDisabled();
  });
});
