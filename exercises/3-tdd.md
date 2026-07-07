# Exercises: Test-Driven Development

In TDD you always write the **test first** — the test should fail because the feature doesn't exist yet. Then you write the minimum code to make it pass.

Each exercise follows the same three steps:

> **RED** → write the test, watch it fail  
> **GREEN** → implement the feature, watch it pass  
> **REFACTOR** → clean up if needed

Create a new file `src/__tests__/exercises-tdd.test.tsx` for your tests. Run `npm test` after each step.

---

### Exercise 1 — Character counter in the name field

**Feature:** As the user types in the Name field, a `<span>` below it shows how many characters have been typed (e.g. `"5 / 50"`).

**RED — write this test first:**

```
Render SignUpForm. Type "Alice" into the Name field.
Assert that the text "5 / 50" appears in the document.
```

**GREEN — make it pass:**

In `SignUpForm.tsx`, add a `<span>` below the name input that displays `{name.length} / 50`.

---

### Exercise 2 — Empty-name validation message

**Feature:** If the user clicks Sign Up without entering a name, an error message `"Name is required"` appears below the name field.

**RED — write this test first:**

```
Render SignUpForm with a mock onSignUp.
Type an email but leave the name empty.
Click Sign Up.
Assert the text "Name is required" is in the document.
Assert onSignUp was NOT called.
```

**GREEN — make it pass:**

Add a `nameError` state to `SignUpForm`. Set it to `'Name is required'` when submit is attempted without a name, and render it as a `<p>` below the input.

---

### Exercise 3 — Email format validation

**Feature:** If the submitted email does not contain `@`, an error message `"Please enter a valid email"` appears.

**RED — write this test first:**

```
Render SignUpForm.
Type a name and type "notanemail" (no @) into the email field.
Click Sign Up.
Assert "Please enter a valid email" is in the document.
```

**GREEN — make it pass:**

Add an `emailError` state. Validate the email on submit (check for `@`) and render the error below the email input if invalid.

---

### Exercise 4 — Participant count badge in the Header

**Feature:** `Header` accepts an optional `count?: number` prop. When provided, it renders a `<span data-testid="count-badge">` next to the title showing the number.

**RED — write this test first:**

```
Render <Header title="Sign-Ups" count={7} />.
Assert an element with data-testid="count-badge" shows the text "7".
```

Then write a second test:

```
Render <Header title="Sign-Ups" /> (no count prop).
Assert the count badge is NOT in the document.
```

**GREEN — make it pass:**

Update `Header` to accept `count?: number` and conditionally render `<span data-testid="count-badge">{count}</span>`.

---

### Exercise 5 — Category filter on the tournament page

**Feature:** A `<select data-testid="category-filter">` above the participant list lets users filter by category. Selecting `"Beginner"` shows only Beginner participants.

**RED — write this test first:**

```
Render TournamentPage, advance timers to load participants.
Use userEvent.selectOptions to pick "Beginner" from the filter select.
Assert only participants with category "Beginner" are visible.
Assert "Advanced" participants are NOT in the document.
```

**GREEN — make it pass:**

Add a `filterCategory` state to `TournamentPage`. Render a `<select>` with options for each category plus an "All" option. Filter the `participants` array before passing it to `ParticipantList`.

---

### Exercise 6 — Search by name

**Feature:** A text input with `data-testid="search-input"` on the tournament page filters the list to show only participants whose name includes the typed text (case-insensitive).

**RED — write this test first:**

```
Render TournamentPage and advance timers.
Type "alice" into the search input.
Assert "Alice Chen" is in the document.
Assert "Bob Smith" is NOT in the document.
```

**GREEN — make it pass:**

Add a `searchQuery` state. Render a text input that updates it. Filter participants by `name.toLowerCase().includes(searchQuery.toLowerCase())` before rendering the list.

---

### Exercise 7 — Clear all participants

**Feature:** A `<button>Clear All</button>` on the tournament page removes every participant from the list.

**RED — write this test first:**

```
Render TournamentPage and advance timers.
Assert there are 3 participant cards.
Click "Clear All".
Assert there are now 0 participant cards and the empty-state message is visible.
```

**GREEN — make it pass:**

Add a Clear All button to `TournamentPage` that calls `setParticipants([])`.

---

### Exercise 8 — Prevent duplicate email sign-up

**Feature:** If a participant with the same email already exists in the list, `SignUpForm` shows `"This email is already registered"` and does not call `onSignUp`.

This feature requires `SignUpForm` to know about existing participants, so add an `existingEmails: string[]` prop.

**RED — write this test first:**

```
Render SignUpForm with existingEmails={['alice@example.com']} and a mock onSignUp.
Type "Alice Chen" and "alice@example.com" into the fields.
Click Sign Up.
Assert "This email is already registered" is in the document.
Assert onSignUp was NOT called.
```

**GREEN — make it pass:**

Add `existingEmails: string[]` to `SignUpFormProps` (default `[]`). On submit, check whether the entered email is in `existingEmails`; if so, show the error and return early.

---

### Exercise 9 — Confirmation before removing a participant

**Feature:** Clicking Remove on a `ParticipantCard` first shows an inline confirmation: `"Are you sure?"` with a **Confirm** and a **Cancel** button. Only clicking Confirm calls `onRemove`.

**RED — write these tests first:**

```
1. Click Remove → "Are you sure?" text appears.
2. Click Remove then Cancel → "Are you sure?" disappears, onRemove NOT called.
3. Click Remove then Confirm → onRemove IS called with the participant's id.
```

**GREEN — make it pass:**

Add a `confirming` boolean state to `ParticipantCard`. The Remove button sets it to `true`. When `confirming` is `true`, hide Remove and show the confirmation UI instead.

---

### Exercise 10 — Max participant limit

**Feature:** `TournamentPage` accepts a `maxParticipants?: number` prop (default unlimited). Once the list reaches the limit, the **Go to Sign Up** button is disabled and shows the label `"Tournament Full"`.

**RED — write these tests first:**

```
1. Render with maxParticipants={3}, advance timers (loads 3 participants).
   Assert the "Go to Sign Up" button is disabled.
   Assert its text content is "Tournament Full".

2. Render with maxParticipants={5}, advance timers (loads 3 participants).
   Assert the button is NOT disabled.
   Assert its text content is "Go to Sign Up".
```

> **API:** `expect(button).toBeDisabled()` / `expect(button).not.toBeDisabled()`

**GREEN — make it pass:**

Add `maxParticipants?: number` to `TournamentPageProps`. In the JSX, compute `const isFull = maxParticipants !== undefined && participants.length >= maxParticipants` and apply it to the button.
