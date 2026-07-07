# Exercises: React Testing

Ten exercises from easy to challenging. You will test the components that already exist in this project.

Create a new file `src/__tests__/exercises-react.test.tsx` and work through them in order. Run `npm test` to check your progress.

---

### Exercise 1 — Render without crashing

Import `Header` from `../components/Header`.

Render it with `title="My Tournament"` and write a test that simply asserts the component renders without throwing an error.

> Completing a `render()` call without error is itself a valid assertion.

---

### Exercise 2 — Check rendered text

Render `Header` with `title="Season Finals 2026"`.

Assert that a heading with the text `"Season Finals 2026"` is present in the document.

> **API:** `screen.getByRole('heading', { name: '...' })`

---

### Exercise 3 — Check something is NOT in the DOM

Import `ParticipantList` from `../components/ParticipantList`.

Render it with an empty `participants` array. Write two tests:

1. The empty-state message **is** in the document.
2. The participant list element is **not** in the document.

> **APIs:** `screen.queryByTestId`, `.not.toBeInTheDocument()`  
> The list has `data-testid="participant-list"`, the empty message has `data-testid="empty-message"`.

---

### Exercise 4 — Rendering with props

Import `ParticipantCard` from `../components/ParticipantCard`.

Create a participant object and render the card. Assert that the **name**, **email**, and **category** are all visible in the document. Also assert a **Remove** button exists.

> **Tip:** Use `screen.getByText` for text and `screen.getByRole('button', { name: /remove/i })` for the button.

---

### Exercise 5 — Multiple cards from a list

Import `ParticipantList` and render it with an array of **three** participants.

Assert:
- The empty-state message is **not** shown
- There are exactly **3** elements with `data-testid="participant-card"`

> **API:** `screen.getAllByTestId`

---

### Exercise 6 — User click interaction

Import `ParticipantCard`.

Create a mock `onRemove` callback. Render the card and use `userEvent` to click the Remove button. Assert that `onRemove` was called with the participant's id.

> ```tsx
> import userEvent from '@testing-library/user-event';
>
> const user = userEvent.setup();
> await user.click(screen.getByRole('button', { name: /remove/i }));
> ```

---

### Exercise 7 — Typing into a form

Import `SignUpForm` from `../components/SignUpForm`.

Render it with a mock `onSignUp`. Using `userEvent`:

1. Type a name into the **Name** field
2. Type an email into the **Email** field
3. Click the **Sign Up** button

Assert that `onSignUp` was called with `{ name, email, category: 'Beginner' }`.

> **API:** `user.type(screen.getByLabelText(/name/i), 'Your Name')`

---

### Exercise 8 — Form does not submit when empty

Render `SignUpForm` with a mock `onSignUp`.

Click the **Sign Up** button immediately without typing anything. Assert that `onSignUp` was **not** called.

> **API:** `expect(mockFn).not.toHaveBeenCalled()`

---

### Exercise 9 — Conditional rendering after interaction

Import `SignUpPage` from `../pages/SignUpPage`.

Write two tests:

1. The form **is** visible before any interaction.
2. After typing a name + email and submitting, the form **disappears** and a success message **appears**.

> The form has `data-testid="signup-form"` and the success message has `data-testid="success-message"`.

---

### Exercise 10 — Testing with fake timers and `waitFor`

Import `TournamentPage` from `../pages/TournamentPage`.

`TournamentPage` uses a `setTimeout` internally to simulate a data load. Use fake timers to control it:

```ts
beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
```

Write two tests:

1. Immediately after rendering (before advancing timers), the loading message **is** visible.
2. After calling `act(() => jest.runAllTimers())` and awaiting `waitFor`, the loading message is **gone** and all three initial participants are in the document.

> ```tsx
> import { render, screen, waitFor, act } from '@testing-library/react';
>
> act(() => jest.runAllTimers());
> await waitFor(() =>
>   expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument()
> );
> ```
