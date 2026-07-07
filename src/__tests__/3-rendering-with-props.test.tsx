// Tests that components correctly display the data passed to
// them as props, and react to different prop values.

import { render, screen } from '@testing-library/react';
import ParticipantCard from '../components/ParticipantCard';
import ParticipantList from '../components/ParticipantList';
import type { Participant } from '../types';

const mockParticipant: Participant = {
    id: 1,
    name: 'Alice Chen',
    email: 'alice@example.com',
    category: 'Advanced',
};

describe('ParticipantCard – rendering with props', () => {
    test('renders the participant name from props', () => {
        render(<ParticipantCard participant={mockParticipant} onRemove={jest.fn()} />);
        expect(screen.getByText('Alice Chen')).toBeInTheDocument();
    });

    test('renders the participant email from props', () => {
        render(<ParticipantCard participant={mockParticipant} onRemove={jest.fn()} />);
        expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    });

    test('renders the participant category from props', () => {
        render(<ParticipantCard participant={mockParticipant} onRemove={jest.fn()} />);
        expect(screen.getByText('Advanced')).toBeInTheDocument();
    });

    test('renders a Remove button', () => {
        render(<ParticipantCard participant={mockParticipant} onRemove={jest.fn()} />);
        expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
    });

    test('renders different content when given different props', () => {
        const otherParticipant: Participant = {
            id: 2,
            name: 'Bob Smith',
            email: 'bob@example.com',
            category: 'Beginner',
        };
        render(<ParticipantCard participant={otherParticipant} onRemove={jest.fn()} />);
        expect(screen.getByText('Bob Smith')).toBeInTheDocument();
        expect(screen.getByText('Beginner')).toBeInTheDocument();
        expect(screen.queryByText('Alice Chen')).not.toBeInTheDocument();
    });
});

describe('ParticipantList – rendering with props', () => {
    test('renders an empty-state message when the participants array is empty', () => {
        render(<ParticipantList participants={[]} onRemove={jest.fn()} />);
        expect(screen.getByTestId('empty-message')).toBeInTheDocument();
    });

    test('does NOT render the empty-state message when there are participants', () => {
        render(<ParticipantList participants={[mockParticipant]} onRemove={jest.fn()} />);
        expect(screen.queryByTestId('empty-message')).not.toBeInTheDocument();
    });

    test('renders one card for each participant in the array', () => {
        const participants: Participant[] = [
            { id: 1, name: 'Alice Chen', email: 'alice@example.com', category: 'Advanced' },
            { id: 2, name: 'Bob Smith', email: 'bob@example.com', category: 'Beginner' },
            { id: 3, name: 'Carol Davis', email: 'carol@example.com', category: 'Intermediate' },
        ];
        render(<ParticipantList participants={participants} onRemove={jest.fn()} />);
        expect(screen.getAllByTestId('participant-card')).toHaveLength(3);
    });

    test('renders the name of every participant', () => {
        const participants: Participant[] = [
            { id: 1, name: 'Alice Chen', email: 'alice@example.com', category: 'Advanced' },
            { id: 2, name: 'Bob Smith', email: 'bob@example.com', category: 'Beginner' },
        ];
        render(<ParticipantList participants={participants} onRemove={jest.fn()} />);
        expect(screen.getByText('Alice Chen')).toBeInTheDocument();
        expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    });
});
