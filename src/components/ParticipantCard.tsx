import type { Participant } from '../types';

interface ParticipantCardProps {
    participant: Participant;
    onRemove: (id: number) => void;
}

export default function ParticipantCard({ participant, onRemove }: ParticipantCardProps) {
    return (
        <div data-testid="participant-card">
            <h3>{participant.name}</h3>
            <p>{participant.email}</p>
            <span>{participant.category}</span>
            <button onClick={() => onRemove(participant.id)}>Remove</button>
        </div>
    );
}
