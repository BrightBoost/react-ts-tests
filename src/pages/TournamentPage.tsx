import { useState, useEffect } from 'react';
import type { Participant } from '../types';
import ParticipantList from '../components/ParticipantList';

const INITIAL_PARTICIPANTS: Participant[] = [
    { id: 1, name: 'Alice Chen', email: 'alice@example.com', category: 'Advanced' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', category: 'Beginner' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', category: 'Intermediate' },
];

interface TournamentPageProps {
    onNavigateToSignUp: () => void;
    newParticipant: Omit<Participant, 'id'> | null;
}

export default function TournamentPage({ onNavigateToSignUp, newParticipant }: TournamentPageProps) {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Simulates fetching the initial participant list from an API
    useEffect(() => {
        const timer = setTimeout(() => {
            setParticipants(INITIAL_PARTICIPANTS);
            setIsLoading(false);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Reacts when a new participant is added from the sign-up page.
    // Waits for isLoading to be false so the initial load does not
    // overwrite the new entry when the page remounts.
    useEffect(() => {
        if (newParticipant && !isLoading) {
            setParticipants((prev) => [
                ...prev,
                { ...newParticipant, id: prev.length + 1 },
            ]);
        }
    }, [newParticipant, isLoading]);

    function handleRemove(id: number) {
        setParticipants((prev) => prev.filter((p) => p.id !== id));
    }

    return (
        <div data-testid="tournament-page">
            <h2>Tournament Sign-Ups</h2>
            {isLoading ? (
                <p data-testid="loading-message">Loading participants...</p>
            ) : (
                <>
                    <p data-testid="participant-count">{participants.length} participant(s) signed up</p>
                    <ParticipantList participants={participants} onRemove={handleRemove} />
                </>
            )}
            <button onClick={onNavigateToSignUp}>Go to Sign Up</button>
        </div>
    );
}
