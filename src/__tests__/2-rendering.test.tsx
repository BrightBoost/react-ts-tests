// Tests that a component renders without crashing and produces
// the expected HTML structure in the DOM.

import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

describe('Component Rendering', () => {
    test('renders without throwing an error', () => {
        // If render() completes without throwing, the test passes
        render(<Header title="Welcome" />);
    });

    test('renders the correct heading text', () => {
        render(<Header title="Tournament 2026" />);
        // getByRole throws if the element isn't found, so this also
        // implicitly asserts the element exists
        expect(screen.getByRole('heading', { name: 'Tournament 2026' })).toBeInTheDocument();
    });

    test('renders an <h1> element', () => {
        render(<Header title="Test Title" />);
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading.tagName).toBe('H1');
    });

    test('renders a <header> landmark', () => {
        render(<Header title="Hello" />);
        // The semantic <header> element is accessible as a "banner" landmark
        expect(screen.getByRole('banner')).toBeInTheDocument();
    });
});
