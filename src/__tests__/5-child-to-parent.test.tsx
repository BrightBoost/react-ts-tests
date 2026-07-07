// Tests that a child component calls its callback prop with
// the correct arguments to send data back up to its parent.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ParticipantCard from '../components/ParticipantCard';
import type { Participant } from '../types';

const mockParticipant: Participant = {
    id: 42,
    name: 'Frank Green',
    email: 'frank@example.com',
    category: 'Intermediate',
};

describe('Child-to-Parent Communication', () => {
    test('calls the onRemove callback when the Remove button is clicked', async () => {
        const user = userEvent.setup();
        const mockOnRemove = jest.fn();

        render(<ParticipantCard participant={mockParticipant} onRemove={mockOnRemove} />);

        await user.click(screen.getByRole('button', { name: /remove/i }));

        expect(mockOnRemove).toHaveBeenCalled();
    });

    test('passes the correct participant id back to the parent', async () => {
        const user = userEvent.setup();
        const mockOnRemove = jest.fn();

        render(<ParticipantCard participant={mockParticipant} onRemove={mockOnRemove} />);

        await user.click(screen.getByRole('button', { name: /remove/i }));

        // The child must send its own id (42) — not a hardcoded value
        expect(mockOnRemove).toHaveBeenCalledWith(42);
    });

    test('calls onRemove exactly once per click', async () => {
        const user = userEvent.setup();
        const mockOnRemove = jest.fn();

        render(<ParticipantCard participant={mockParticipant} onRemove={mockOnRemove} />);

        await user.click(screen.getByRole('button', { name: /remove/i }));

        expect(mockOnRemove).toHaveBeenCalledTimes(1);
    });

    test('passes the correct id on every click when clicked multiple times', async () => {
        const user = userEvent.setup();
        const mockOnRemove = jest.fn();

        render(<ParticipantCard participant={mockParticipant} onRemove={mockOnRemove} />);

        const removeButton = screen.getByRole('button', { name: /remove/i });
        await user.click(removeButton);
        await user.click(removeButton);

        expect(mockOnRemove).toHaveBeenCalledTimes(2);
        expect(mockOnRemove).toHaveBeenNthCalledWith(1, 42);
        expect(mockOnRemove).toHaveBeenNthCalledWith(2, 42);
    });

    test('different card instances send their own ids to the parent', async () => {
        const user = userEvent.setup();

        const firstOnRemove = jest.fn();
        const secondOnRemove = jest.fn();

        const participantA: Participant = { id: 1, name: 'Alice', email: 'a@a.com', category: 'Beginner' };
        const participantB: Participant = { id: 2, name: 'Bob', email: 'b@b.com', category: 'Advanced' };

        const { unmount } = render(
            <ParticipantCard participant={participantA} onRemove={firstOnRemove} />
        );
        await user.click(screen.getByRole('button', { name: /remove/i }));
        expect(firstOnRemove).toHaveBeenCalledWith(1);
        unmount();

        render(<ParticipantCard participant={participantB} onRemove={secondOnRemove} />);
        await user.click(screen.getByRole('button', { name: /remove/i }));
        expect(secondOnRemove).toHaveBeenCalledWith(2);
    });
});
