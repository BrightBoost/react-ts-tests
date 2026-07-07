// core Jest concepts: matchers, mock functions, and exceptions.

describe("Ultimate Basics – matchers", () => {
  test("adds two numbers", () => {
    expect(1 + 1).toBe(2);
  });

  test("subtracts numbers", () => {
    expect(10 - 3).toBe(7);
  });

  test("true is truthy", () => {
    expect(true).toBeTruthy();
  });

  test("null is falsy", () => {
    expect(null).toBeFalsy();
  });

  test("undefined is not defined", () => {
    let value: number | undefined;
    expect(value).toBeUndefined();
  });
});

describe("Ultimate Basics – strings & arrays", () => {
  test("string contains a substring", () => {
    expect("Tournament 2026").toContain("Tournament");
  });

  test("array contains an item", () => {
    const categories = ["Beginner", "Intermediate", "Advanced"];
    expect(categories).toContain("Intermediate");
  });

  test("array has the correct length", () => {
    const participants = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];
    expect(participants).toHaveLength(2);
  });
});

describe("Ultimate Basics – objects", () => {
  test("object matches an expected shape with toEqual", () => {
    const participant = {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      category: "Advanced",
    };
    expect(participant).toEqual({
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      category: "Advanced",
    });
  });

  test("object has a specific property with a specific value", () => {
    const participant = {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      category: "Advanced",
    };
    expect(participant).toHaveProperty("name", "Alice");
  });
});

describe("Ultimate Basics – mock functions", () => {
  test("tracks that a mock function was called", () => {
    const mockCallback = jest.fn();
    mockCallback("hello");
    expect(mockCallback).toHaveBeenCalled();
  });

  test("tracks the arguments a mock was called with", () => {
    const mockCallback = jest.fn();
    mockCallback("hello", 42);
    expect(mockCallback).toHaveBeenCalledWith("hello", 42);
  });

  test("tracks how many times a mock was called", () => {
    const mockCallback = jest.fn();
    mockCallback();
    mockCallback();
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });
});

describe("Ultimate Basics – exceptions", () => {
  function parseId(value: unknown): number {
    if (typeof value !== "number")
      throw new Error("Invalid ID: expected a number");
    return value;
  }

  test("throws an error for invalid input", () => {
    expect(() => parseId("not-a-number")).toThrow("Invalid ID");
  });

  test("does NOT throw for valid input", () => {
    expect(() => parseId(5)).not.toThrow();
  });
});
