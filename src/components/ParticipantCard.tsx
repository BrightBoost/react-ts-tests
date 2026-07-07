import { useState } from 'react';
import type { Participant } from '../types';

interface ParticipantCardProps {
    participant: Participant;
    onRemove: (id: number) => void;
    confirmBeforeRemove?: boolean;
}

export default function ParticipantCard({
    participant,
    onRemove,
    confirmBeforeRemove = false,
}: ParticipantCardProps) {
    const [confirming, setConfirming] = useState(false);

    function handleRemoveClick() {
        if (confirmBeforeRemove) {
            setConfirming(true);
        } else {
            onRemove(participant.id);
        }
    }

    return (
        <div data-testid="participant-card">
            <h3>{participant.name}</h3>
            <p>{participant.email}</p>
            <span>{participant.category}</span>
            {confirming ? (
                <span>
                    Are you sure?
                    <button onClick={() => { onRemove(participant.id); setConfirming(false); }}>Confirm</button>
                    <button onClick={() => setConfirming(false)}>Cancel</button>
                </span>
            ) : (
                <button onClick={handleRemoveClick}>Remove</button>
            )}
        </div>
    );
}
