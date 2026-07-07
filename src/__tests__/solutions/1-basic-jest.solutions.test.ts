// ============================================================
// SOLUTIONS: Basic Jest (exercises/1-basic-jest.md)
// ============================================================

// exercise 1
describe('Exercise 1 – simple matchers', () => {
  describe('numbers', () => {
    test('2 + 2 equals 4', () => {
      expect(2 + 2).toBe(4);
    });

    test('10 - 3 does not equal 8', () => {
      expect(10 - 3).not.toBe(8);
    });

    test('5 * 5 equals 25', () => {
      expect(5 * 5).toBe(25);
    });
  });
});

// exercise 2
describe('Exercise 2 – strings and arrays', () => {
  test('string contains "Tournament"', () => {
    expect('Hello, Tournament!').toContain('Tournament');
  });

  test('array has length 3', () => {
    expect(['Alice', 'Bob', 'Carol']).toHaveLength(3);
  });

  test('array contains "Bob"', () => {
    expect(['Alice', 'Bob', 'Carol']).toContain('Bob');
  });
});

// exercise 3
describe('Exercise 3 – deep object equality', () => {
  const participant = {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    category: 'Advanced',
  };

  test('object deeply equals expected shape', () => {
    expect(participant).toEqual({
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      category: 'Advanced',
    });
  });

  test('object has property category with value Advanced', () => {
    expect(participant).toHaveProperty('category', 'Advanced');
  });
});

// exercise 4
describe('Exercise 4 – truthiness', () => {
  test('true is truthy', () => {
    expect(true).toBeTruthy();
  });

  test('0 is falsy', () => {
    expect(0).toBeFalsy();
  });

  test('null is falsy', () => {
    expect(null).toBeFalsy();
  });

  test('"hello" is not null', () => {
    expect('hello').not.toBeNull();
  });
});

// exercise 5
describe('Exercise 5 – throwing errors', () => {
  function validateCategory(value: string): void {
    const valid = ['Beginner', 'Intermediate', 'Advanced'];
    if (!valid.includes(value)) {
      throw new Error('Invalid category');
    }
  }

  test('throws for an unknown category', () => {
    expect(() => validateCategory('Expert')).toThrow('Invalid category');
  });

  test('does not throw for a valid category', () => {
    expect(() => validateCategory('Beginner')).not.toThrow();
  });
});

// exercise 6
describe('Exercise 6 – mock function basics', () => {
  test('onRemove is called with the correct id', () => {
    const onRemove = jest.fn();
    onRemove(42);

    expect(onRemove).toHaveBeenCalled();
    expect(onRemove).toHaveBeenCalledWith(42);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

// exercise 7
describe('Exercise 7 – mock return values', () => {
  test('mockReturnValue returns the same value on every call', () => {
    const getDefaultCategory = jest.fn().mockReturnValue('Beginner');

    expect(getDefaultCategory()).toBe('Beginner');
    expect(getDefaultCategory()).toBe('Beginner');
    expect(getDefaultCategory()).toBe('Beginner');
  });

  test('mockReturnValueOnce overrides only the first call', () => {
    const mock = jest
      .fn()
      .mockReturnValueOnce('Advanced')
      .mockReturnValue('Beginner');

    expect(mock()).toBe('Advanced'); // first call
    expect(mock()).toBe('Beginner'); // second call onwards
  });
});

// exercise 8
describe('Exercise 8 – mock implementation', () => {
  test('mockImplementation validates an email address', () => {
    const validateEmail = jest
      .fn()
      .mockImplementation((email: string) => email.includes('@'));

    expect(validateEmail('alice@example.com')).toBe(true);
    expect(validateEmail('notanemail')).toBe(false);
  });
});

// exercise 9
describe('Exercise 9 – async: resolved and rejected', () => {
  test('mockResolvedValue simulates a successful fetch', async () => {
    const api = {
      fetchParticipant: jest.fn().mockResolvedValue({ id: 1, name: 'Alice' }),
    };

    const result = await api.fetchParticipant(1);

    expect(result).toEqual({ id: 1, name: 'Alice' });
    expect(api.fetchParticipant).toHaveBeenCalledWith(1);
  });

  test('mockRejectedValue simulates a failed fetch', async () => {
    const api = {
      fetchParticipant: jest.fn().mockRejectedValue(new Error('Not found')),
    };

    await expect(api.fetchParticipant(99)).rejects.toThrow('Not found');
  });
});

// exercise 10
describe('Exercise 10 – parametrized tests with test.each', () => {
  function isEligible(age: number): boolean {
    return age >= 16;
  }

  test.each<[number, boolean]>([
    [15, false],
    [16, true],
    [17, true],
    [10, false],
    [25, true],
  ])('age %i → eligible: %s', (age, expected) => {
    expect(isEligible(age)).toBe(expected);
  });
});
