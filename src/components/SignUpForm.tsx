import { useState } from 'react';
import type { Participant } from '../types';

interface SignUpFormProps {
    onSignUp: (participant: Omit<Participant, 'id'>) => void;
}

export default function SignUpForm({ onSignUp }: SignUpFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState('Beginner');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (name && email) {
            onSignUp({ name, email, category });
            setName('');
            setEmail('');
            setCategory('Beginner');
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
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />
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
