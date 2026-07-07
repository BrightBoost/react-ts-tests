import { useState } from 'react';
import type { Participant } from '../types';
import SignUpForm from '../components/SignUpForm';

interface SignUpPageProps {
    onSignUp: (participant: Omit<Participant, 'id'>) => void;
    onNavigateToTournament: () => void;
}

export default function SignUpPage({ onSignUp, onNavigateToTournament }: SignUpPageProps) {
    const [submitted, setSubmitted] = useState(false);

    function handleSignUp(participant: Omit<Participant, 'id'>) {
        onSignUp(participant);
        setSubmitted(true);
    }

    return (
        <div data-testid="signup-page">
            <h2>Sign Up for the Tournament</h2>
            {submitted ? (
                <div data-testid="success-message">
                    <p>You&apos;re signed up! See you at the tournament.</p>
                    <button onClick={onNavigateToTournament}>View All Sign-Ups</button>
                </div>
            ) : (
                <SignUpForm onSignUp={handleSignUp} />
            )}
        </div>
    );
}
