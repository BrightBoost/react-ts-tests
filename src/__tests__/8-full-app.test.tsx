// ============================================================
// TEST FILE 8: FULL REACT APP EXPANSION
//
// Expands coverage beyond the individual-component tests:
//   • SignUpPage (the full page component, not just the form)
//   • TournamentPage – deeper interaction tests (remove, count)
//   • App – end-to-end navigation and full sign-up flow
// ============================================================

import { render, screen, within, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpPage from '../pages/SignUpPage';
import TournamentPage from '../pages/TournamentPage';
import App from '../App';

// ─────────────────────────────────────────────────────────────
// SignUpPage
// ─────────────────────────────────────────────────────────────
describe('SignUpPage', () => {
    test('renders the page heading', () => {
        render(<SignUpPage onSignUp={jest.fn()} onNavigateToTournament={jest.fn()} />);
        expect(
            screen.getByRole('heading', { name: /sign up for the tournament/i })
        ).toBeInTheDocument();
    });

    test('shows the sign-up form on initial render', () => {
        render(<SignUpPage onSignUp={jest.fn()} onNavigateToTournament={jest.fn()} />);
        expect(screen.getByTestId('signup-form')).toBeInTheDocument();
    });

    test('does NOT show the success message before the form is submitted', () => {
        render(<SignUpPage onSignUp={jest.fn()} onNavigateToTournament={jest.fn()} />);
        expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
    });

    test('hides the form and shows the success message after submission', async () => {
        const user = userEvent.setup();
        render(<SignUpPage onSignUp={jest.fn()} onNavigateToTournament={jest.fn()} />);

        await user.type(screen.getByLabelText(/name/i), 'Eve Wilson');
        await user.type(screen.getByLabelText(/email/i), 'eve@example.com');
        await user.click(screen.getByRole('button', { name: /sign up/i }));

        expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });

    test('calls onSignUp with the participant data when the form is submitted', async () => {
        const user = userEvent.setup();
        const mockOnSignUp = jest.fn();
        render(<SignUpPage onSignUp={mockOnSignUp} onNavigateToTournament={jest.fn()} />);

        await user.type(screen.getByLabelText(/name/i), 'Frank Green');
        await user.type(screen.getByLabelText(/email/i), 'frank@example.com');
        await user.selectOptions(screen.getByLabelText(/category/i), 'Advanced');
        await user.click(screen.getByRole('button', { name: /sign up/i }));

        expect(mockOnSignUp).toHaveBeenCalledWith({
            name: 'Frank Green',
            email: 'frank@example.com',
            category: 'Advanced',
        });
    });

    test('success message has a "View All Sign-Ups" button', async () => {
        const user = userEvent.setup();
        render(<SignUpPage onSignUp={jest.fn()} onNavigateToTournament={jest.fn()} />);

        await user.type(screen.getByLabelText(/name/i), 'Eve Wilson');
        await user.type(screen.getByLabelText(/email/i), 'eve@example.com');
        await user.click(screen.getByRole('button', { name: /sign up/i }));

        expect(
            screen.getByRole('button', { name: /view all sign-ups/i })
        ).toBeInTheDocument();
    });

    test('clicking "View All Sign-Ups" calls onNavigateToTournament', async () => {
        const user = userEvent.setup();
        const mockNavigate = jest.fn();
        render(<SignUpPage onSignUp={jest.fn()} onNavigateToTournament={mockNavigate} />);

        await user.type(screen.getByLabelText(/name/i), 'Eve Wilson');
        await user.type(screen.getByLabelText(/email/i), 'eve@example.com');
        await user.click(screen.getByRole('button', { name: /sign up/i }));
        await user.click(screen.getByRole('button', { name: /view all sign-ups/i }));

        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
});

// ─────────────────────────────────────────────────────────────
// TournamentPage – deeper interaction tests
// ─────────────────────────────────────────────────────────────
describe('TournamentPage – interactions', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    async function renderLoaded() {
        render(<TournamentPage onNavigateToSignUp={jest.fn()} newParticipant={null} />);
        act(() => jest.runAllTimers());
        await waitFor(() =>
            expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument()
        );
    }

    test('"Go to Sign Up" button calls onNavigateToSignUp', async () => {
        const mockNavigate = jest.fn();
        const user = userEvent.setup({ delay: null });
        render(<TournamentPage onNavigateToSignUp={mockNavigate} newParticipant={null} />);

        await user.click(screen.getByRole('button', { name: /go to sign up/i }));

        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    test('displays the correct participant count after loading', async () => {
        await renderLoaded();
        expect(screen.getByTestId('participant-count')).toHaveTextContent('3 participant(s)');
    });

    test('removing a participant removes its card from the DOM', async () => {
        const user = userEvent.setup({ delay: null });
        await renderLoaded();

        // There are 3 Remove buttons — click the one inside Alice's card
        const aliceCard = screen
            .getAllByTestId('participant-card')
            .find((card) => within(card).queryByText('Alice Chen'));

        await user.click(within(aliceCard!).getByRole('button', { name: /remove/i }));

        expect(screen.queryByText('Alice Chen')).not.toBeInTheDocument();
        expect(screen.getAllByTestId('participant-card')).toHaveLength(2);
    });

    test('participant count decrements after a removal', async () => {
        const user = userEvent.setup({ delay: null });
        await renderLoaded();

        const [firstRemoveButton] = screen.getAllByRole('button', { name: /remove/i });
        await user.click(firstRemoveButton);

        expect(screen.getByTestId('participant-count')).toHaveTextContent('2 participant(s)');
    });
});

// ─────────────────────────────────────────────────────────────
// App – full end-to-end integration
// ─────────────────────────────────────────────────────────────
describe('App – end-to-end integration', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    test('renders the tournament page by default', () => {
        render(<App />);
        expect(screen.getByTestId('tournament-page')).toBeInTheDocument();
    });

    test('clicking the nav "Sign Up" button navigates to the sign-up page', async () => {
        const user = userEvent.setup({ delay: null });
        render(<App />);

        await user.click(screen.getByRole('button', { name: 'Sign Up' }));

        expect(screen.getByTestId('signup-page')).toBeInTheDocument();
        expect(screen.queryByTestId('tournament-page')).not.toBeInTheDocument();
    });

    test('clicking "All Sign-Ups" from the sign-up page navigates back', async () => {
        const user = userEvent.setup({ delay: null });
        render(<App />);

        await user.click(screen.getByRole('button', { name: 'Sign Up' }));
        await user.click(screen.getByRole('button', { name: 'All Sign-Ups' }));

        expect(screen.getByTestId('tournament-page')).toBeInTheDocument();
    });

    test('full flow: new participant appears in the list after sign-up', async () => {
        const user = userEvent.setup({ delay: null });
        render(<App />);

        // 1. Wait for initial tournament data to load
        act(() => jest.runAllTimers());
        await waitFor(() =>
            expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument()
        );
        expect(screen.getAllByTestId('participant-card')).toHaveLength(3);

        // 2. Navigate to sign-up page via the nav button
        await user.click(screen.getByRole('button', { name: 'Sign Up' }));

        // 3. Fill in and submit the form
        //    Use `within` to target the form's submit button specifically,
        //    since the nav also has a "Sign Up" button.
        await user.type(screen.getByLabelText(/name/i), 'Grace Liu');
        await user.type(screen.getByLabelText(/email/i), 'grace@example.com');
        await user.click(
            within(screen.getByTestId('signup-form')).getByRole('button', { name: /sign up/i })
        );

        // 4. Success screen is shown
        expect(screen.getByTestId('success-message')).toBeInTheDocument();

        // 5. Navigate back to the tournament page
        await user.click(screen.getByRole('button', { name: /view all sign-ups/i }));

        // 6. TournamentPage remounts — advance timers for the reload
        act(() => jest.runAllTimers());
        await waitFor(() =>
            expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument()
        );

        // 7. Grace now appears alongside the original three participants
        expect(screen.getByText('Grace Liu')).toBeInTheDocument();
        expect(screen.getAllByTestId('participant-card')).toHaveLength(4);
    });
});
