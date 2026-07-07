// Tests that SignUpForm gathers user input and calls its
// onSignUp callback with the correct data on submit.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpForm from '../components/SignUpForm';

describe('Form Submission', () => {
    test('calls onSignUp with the values the user typed', async () => {
        const user = userEvent.setup();
        const mockOnSignUp = jest.fn();

        render(<SignUpForm onSignUp={mockOnSignUp} />);

        await user.type(screen.getByLabelText(/name/i), 'Dave Lee');
        await user.type(screen.getByLabelText(/email/i), 'dave@example.com');
        await user.selectOptions(screen.getByLabelText(/category/i), 'Intermediate');
        await user.click(screen.getByRole('button', { name: /sign up/i }));

        expect(mockOnSignUp).toHaveBeenCalledTimes(1);
        expect(mockOnSignUp).toHaveBeenCalledWith({
            name: 'Dave Lee',
            email: 'dave@example.com',
            category: 'Intermediate',
        });
    });

    test('does not call onSignUp when required fields are empty', async () => {
        const user = userEvent.setup();
        const mockOnSignUp = jest.fn();

        render(<SignUpForm onSignUp={mockOnSignUp} />);

        // Click submit without filling anything in
        await user.click(screen.getByRole('button', { name: /sign up/i }));

        expect(mockOnSignUp).not.toHaveBeenCalled();
    });

    test('does not call onSignUp when only the name is missing', async () => {
        const user = userEvent.setup();
        const mockOnSignUp = jest.fn();

        render(<SignUpForm onSignUp={mockOnSignUp} />);

        await user.type(screen.getByLabelText(/email/i), 'someone@example.com');
        await user.click(screen.getByRole('button', { name: /sign up/i }));

        expect(mockOnSignUp).not.toHaveBeenCalled();
    });

    test('resets the form fields to empty after a successful submission', async () => {
        const user = userEvent.setup();

        render(<SignUpForm onSignUp={jest.fn()} />);

        const nameInput = screen.getByLabelText(/name/i);
        await user.type(nameInput, 'Eve Wilson');
        await user.type(screen.getByLabelText(/email/i), 'eve@example.com');
        await user.click(screen.getByRole('button', { name: /sign up/i }));

        expect(nameInput).toHaveValue('');
        expect(screen.getByLabelText(/email/i)).toHaveValue('');
    });

    test('uses "Beginner" as the default category', () => {
        render(<SignUpForm onSignUp={jest.fn()} />);
        expect(screen.getByLabelText(/category/i)).toHaveValue('Beginner');
    });
});
