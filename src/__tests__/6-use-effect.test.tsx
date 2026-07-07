// Tests that side effects triggered by useEffect run at the
// right time and correctly update what is shown on screen.

import { render, screen, waitFor, act } from '@testing-library/react';
import TournamentPage from '../pages/TournamentPage';

// We use fake timers so we can control setTimeout and immediately
// advance time without waiting in real-time.
describe('useEffect – initial data loading', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    test('shows a loading indicator BEFORE the effect completes', () => {
        render(<TournamentPage onNavigateToSignUp={jest.fn()} newParticipant={null} />);

        // The effect has NOT run yet — we expect the loading state
        expect(screen.getByTestId('loading-message')).toBeInTheDocument();
        expect(screen.queryByTestId('participant-list')).not.toBeInTheDocument();
    });

    test('hides the loading indicator AFTER the effect completes', async () => {
        render(<TournamentPage onNavigateToSignUp={jest.fn()} newParticipant={null} />);

        // Advance all timers so the useEffect's setTimeout fires
        act(() => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument();
        });
    });

    test('renders the participant list once loading is complete', async () => {
        render(<TournamentPage onNavigateToSignUp={jest.fn()} newParticipant={null} />);

        act(() => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            expect(screen.getByTestId('participant-list')).toBeInTheDocument();
        });
    });

    test('populates the list with all initial participants after loading', async () => {
        render(<TournamentPage onNavigateToSignUp={jest.fn()} newParticipant={null} />);

        act(() => {
            jest.runAllTimers();
        });

        // All three seed participants must appear after the effect runs
        await waitFor(() => {
            expect(screen.getByText('Alice Chen')).toBeInTheDocument();
        });
        expect(screen.getByText('Bob Smith')).toBeInTheDocument();
        expect(screen.getByText('Carol Davis')).toBeInTheDocument();
    });
});

describe('useEffect – reacting to prop changes', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    test('adds a new participant when the newParticipant prop changes', async () => {
        const { rerender } = render(
            <TournamentPage onNavigateToSignUp={jest.fn()} newParticipant={null} />
        );

        // Wait for initial load
        act(() => {
            jest.runAllTimers();
        });
        await waitFor(() => {
            expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument();
        });

        // Simulate the parent passing a new participant (i.e., after form submission)
        rerender(
            <TournamentPage
                onNavigateToSignUp={jest.fn()}
                newParticipant={{ name: 'Grace Liu', email: 'grace@example.com', category: 'Advanced' }}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Grace Liu')).toBeInTheDocument();
        });
    });

    test('does NOT add a participant when newParticipant remains null', async () => {
        render(<TournamentPage onNavigateToSignUp={jest.fn()} newParticipant={null} />);

        act(() => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            expect(screen.getByTestId('participant-list')).toBeInTheDocument();
        });

        // Exactly 3 initial cards — no extras
        expect(screen.getAllByTestId('participant-card')).toHaveLength(3);
    });
});
