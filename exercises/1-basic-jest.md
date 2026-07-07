# Exercises: Basic Jest

Ten exercises from easy to challenging. No React — pure TypeScript and Jest.

Create a new file `src/__tests__/exercises-jest-basics.test.ts` and work through them in order. Run `npm test` to check your progress.

---

### Exercise 1 — Simple matchers

Write three separate tests inside a `describe('numbers')` block:

- `2 + 2` equals `4` (use `toBe`)
- `10 - 3` does **not** equal `8` (use `.not.toBe`)
- `5 * 5` equals `25` (use `toBe`)

> **APIs:** `toBe`, `.not.toBe`

---

### Exercise 2 — Strings and arrays

Write tests that assert:

- The string `'Hello, Tournament!'` contains the substring `'Tournament'`
- The array `['Alice', 'Bob', 'Carol']` has a length of `3`
- The array `['Alice', 'Bob', 'Carol']` contains `'Bob'`

> **APIs:** `toContain`, `toHaveLength`

---

### Exercise 3 — Deep object equality

Create a `participant` object with the fields `id`, `name`, `email`, and `category`. Write a test that asserts the object deeply equals an expected value.

Then write a second test that asserts the object has a property `category` with the value `'Advanced'`.

> **APIs:** `toEqual`, `toHaveProperty`

---

### Exercise 4 — Truthiness

Write four tests (one assertion each):

- `true` is truthy
- `0` is falsy
- `null` is falsy
- `'hello'` is not `null`

> **APIs:** `toBeTruthy`, `toBeFalsy`, `toBeNull`, `.not.toBeNull`

---

### Exercise 5 — Throwing errors

Write a function `validateCategory(value: string)` that throws an `Error('Invalid category')` if the value is not one of `'Beginner'`, `'Intermediate'`, or `'Advanced'`.

Write two tests:

- Calling it with `'Expert'` throws
- Calling it with `'Beginner'` does **not** throw

> **APIs:** `toThrow`, `.not.toThrow`

---

### Exercise 6 — Mock function basics

Create a `jest.fn()` called `onRemove`. Call it with the argument `42`. Write tests asserting:

- It was called
- It was called with `42`
- It was called exactly once

> **APIs:** `jest.fn()`, `toHaveBeenCalled`, `toHaveBeenCalledWith`, `toHaveBeenCalledTimes`

---

### Exercise 7 — Mock return values

Create a mock that represents a function `getDefaultCategory()`.

- Make it return `'Beginner'` on every call
- Call it three times
- Assert each call returned `'Beginner'`

Then create a second mock that returns `'Advanced'` on the **first** call only, and `'Beginner'` on all subsequent calls. Assert the first two return values.

> **APIs:** `mockReturnValue`, `mockReturnValueOnce`

---

### Exercise 8 — Mock implementation

Create a mock `validateEmail` function using `mockImplementation` so that it returns `true` when the string contains `'@'` and `false` otherwise. Write tests for both a valid and invalid email.

> **API:** `jest.fn().mockImplementation((arg) => { ... })`

---

### Exercise 9 — Async: resolved and rejected

Create an object with a method `fetchParticipant(id: number): Promise<{ id: number; name: string }>`.

Write two tests:

1. Make the method resolve with `{ id: 1, name: 'Alice' }` and assert the resolved value.
2. Make the method reject with `new Error('Not found')` and assert the error message is thrown.

> **APIs:** `mockResolvedValue`, `mockRejectedValue`, `await expect(...).rejects.toThrow`

---

### Exercise 10 — Parametrized tests with `test.each`

Write a function `isEligible(age: number): boolean` that returns `true` for ages 16 and above, and `false` below.

Use `test.each` to test at least five age values — a mix of eligible and ineligible — without copy-pasting the same assertion five times.

> **API:**
>
> ```ts
> test.each<[number, boolean]>([
>   [15, false],
>   // add more rows...
> ])("age %i should return %s", (age, expected) => {
>   expect(isEligible(age)).toBe(expected);
> });
> ```
