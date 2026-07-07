// ============================================================
// SOLUTIONS: React Testing (exercises/2-react-testing.md)
// ============================================================

import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../../components/Header';
import ParticipantCard from '../../components/ParticipantCard';
import ParticipantList from '../../components/ParticipantList';
import SignUpForm from '../../components/SignUpForm';
import SignUpPage from '../../pages/SignUpPage';
import TournamentPage from '../../pages/TournamentPage';
import type { Participant } from '../../types';

// exercise 1
describe('Exercise 1 – render without crashing', () => {
  test('Header renders without throwing', () => {
    render(<Header title="My Tournament" />);
  });
});

// exercise 2
describe('Exercise 2 – check rendered text', () => {
  test('renders the correct heading text', () => {
    render(<Header title="Season Finals 2026" />);
    expect(
      screen.getByRole('heading', { name: 'Season Finals 2026' })
    ).toBeInTheDocument();
  });
});

// exercise 3
describe('Exercise 3 – check something is NOT in the DOM', () => {
  test('shows the empty-state message when participants is empty', () => {
    render(<ParticipantList participants={[]} onRemove={jest.fn()} />);
    expect(screen.getByTestId('empty-message')).toBeInTheDocument();
  });

  test('does not show the participant list when participants is empty', () => {
    render(<ParticipantList participants={[]} onRemove={jest.fn()} />);
    expect(screen.queryByTestId('participant-list')).not.toBeInTheDocument();
  });
});

// exercise 4
describe('Exercise 4 – rendering with props', () => {
  const participant: Participant = {
    id: 1,
    name: 'Alice Chen',
    email: 'alice@example.com',
    category: 'Advanced',
  };

  test('renders name, email, category and a Remove button', () => {
    render(<ParticipantCard participant={participant} onRemove={jest.fn()} />);

    expect(screen.getByText('Alice Chen')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
  });
});

// exercise 5
describe('Exercise 5 – multiple cards from a list', () => {
  const participants: Participant[] = [
    { id: 1, name: 'Alice', email: 'a@a.com', category: 'Advanced' },
    { id: 2, name: 'Bob', email: 'b@b.com', category: 'Beginner' },
    { id: 3, name: 'Carol', email: 'c@c.com', category: 'Intermediate' },
  ];

  test('does not show the empty-state message', () => {
    render(<ParticipantList participants={participants} onRemove={jest.fn()} />);
    expect(screen.queryByTestId('empty-message')).not.toBeInTheDocument();
  });

  test('renders exactly one card per participant', () => {
    render(<ParticipantList participants={participants} onRemove={jest.fn()} />);
    expect(screen.getAllByTestId('participant-card')).toHaveLength(3);
  });
});

// exercise 6
describe('Exercise 6 – user click interaction', () => {
  test('clicking Remove calls onRemove with the participant id', async () => {
    const user = userEvent.setup();
    const onRemove = jest.fn();
    const participant: Participant = {
      id: 42,
      name: 'Alice',
      email: 'alice@example.com',
      category: 'Advanced',
    };

    render(<ParticipantCard participant={participant} onRemove={onRemove} />);
    await user.click(screen.getByRole('button', { name: /remove/i }));

    expect(onRemove).toHaveBeenCalledWith(42);
  });
});

// exercise 7
describe('Exercise 7 – typing into a form', () => {
  test('calls onSignUp with the typed name and email', async () => {
    const user = userEvent.setup();
    const mockOnSignUp = jest.fn();

    render(<SignUpForm onSignUp={mockOnSignUp} />);
    await user.type(screen.getByLabelText(/name/i), 'Alice Chen');
    await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(mockOnSignUp).toHaveBeenCalledWith({
      name: 'Alice Chen',
      email: 'alice@example.com',
      category: 'Beginner',
    });
  });
});

// exercise 8
describe('Exercise 8 – form does not submit when empty', () => {
  test('does not call onSignUp when no fields are filled', async () => {
    const user = userEvent.setup();
    const mockOnSignUp = jest.fn();

    render(<SignUpForm onSignUp={mockOnSignUp} />);
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(mockOnSignUp).not.toHaveBeenCalled();
  });
});

// exercise 9
describe('Exercise 9 – conditional rendering after interaction', () => {
  test('shows the form before any interaction', () => {
    render(<SignUpPage onSignUp={jest.fn()} onNavigateToTournament={jest.fn()} />);
    expect(screen.getByTestId('signup-form')).toBeInTheDocument();
  });

  test('shows the success message and hides the form after submission', async () => {
    const user = userEvent.setup();
    render(<SignUpPage onSignUp={jest.fn()} onNavigateToTournament={jest.fn()} />);

    await user.type(screen.getByLabelText(/name/i), 'Alice');
    await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
    expect(screen.getByTestId('success-message')).toBeInTheDocument();
  });
});

// exercise 10
describe('Exercise 10 – fake timers and waitFor', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('shows the loading message before the timer fires', () => {
    render(<TournamentPage onNavigateToSignUp={jest.fn()} newParticipant={null} />);
    expect(screen.getByTestId('loading-message')).toBeInTheDocument();
  });

  test('shows all three participants after advancing the timers', async () => {
    render(<TournamentPage onNavigateToSignUp={jest.fn()} newParticipant={null} />);

    act(() => jest.runAllTimers());

    await waitFor(() =>
      expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument()
    );

    expect(screen.getByText('Alice Chen')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.getByText('Carol Davis')).toBeInTheDocument();
  });
});
