import { useState } from 'react';
import type { Participant } from '../types';

interface SignUpFormProps {
    onSignUp: (participant: Omit<Participant, 'id'>) => void;
    existingEmails?: string[];
}

export default function SignUpForm({ onSignUp, existingEmails = [] }: SignUpFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState('Beginner');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let valid = true;

        if (!name) {
            setNameError('Name is required');
            valid = false;
        } else {
            setNameError('');
        }

        if (email && !email.includes('@')) {
            setEmailError('Please enter a valid email');
            valid = false;
        } else if (email && existingEmails.includes(email)) {
            setEmailError('This email is already registered');
            valid = false;
        } else {
            setEmailError('');
        }

        if (!email) valid = false;

        if (name && email && valid) {
            onSignUp({ name, email, category });
            setName('');
            setEmail('');
            setCategory('Beginner');
            setNameError('');
            setEmailError('');
        }
    }

    return (
        <form onSubmit={handleSubmit} data-testid="signup-form">
            <div>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                />
                <span>{name.length} / 50</span>
                {nameError && <p>{nameError}</p>}
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />
                {emailError && <p>{emailError}</p>}
            </div>
            <div>
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>
            </div>
            <button type="submit">Sign Up</button>
        </form>
    );
}
