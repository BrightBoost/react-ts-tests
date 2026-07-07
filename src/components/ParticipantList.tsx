import type { Participant } from '../types';
import ParticipantCard from './ParticipantCard';

interface ParticipantListProps {
    participants: Participant[];
    onRemove: (id: number) => void;
}

export default function ParticipantList({ participants, onRemove }: ParticipantListProps) {
    if (participants.length === 0) {
        return <p data-testid="empty-message">No participants yet. Be the first to sign up!</p>;
    }

    return (
        <ul data-testid="participant-list">
            {participants.map((participant) => (
                <li key={participant.id}>
                    <ParticipantCard participant={participant} onRemove={onRemove} />
                </li>
            ))}
        </ul>
    );
}
