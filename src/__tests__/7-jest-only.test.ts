// ============================================================
// TEST FILE 7: JEST-ONLY FEATURES (15 TESTS)
//
// Covers intermediate Jest features: numeric matchers,
// asymmetric matchers, advanced mock APIs, async mocking,
// and parametrized tests.  No React — pure Jest & TypeScript.
// ============================================================

// --- Domain helpers used as test subjects ---

type Category = "Beginner" | "Intermediate" | "Advanced";

interface Participant {
  id: number;
  name: string;
  email: string;
  category: Category;
}

interface ParticipantApi {
  getById: (id: number) => Promise<Participant>;
  logAccess: (id: number) => void;
}

function winRate(wins: number, losses: number): number {
  if (wins + losses === 0) return 0;
  return wins / (wins + losses);
}

function filterByCategory(
  list: Participant[],
  category: Category,
): Participant[] {
  return list.filter((p) => p.category === category);
}

function formatLabel(p: Pick<Participant, "name" | "category">): string {
  return `${p.name} (${p.category})`;
}

const sampleList: Participant[] = [
  {
    id: 1,
    name: "Alice Chen",
    email: "alice@example.com",
    category: "Advanced",
  },
  { id: 2, name: "Bob Smith", email: "bob@example.com", category: "Beginner" },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@example.com",
    category: "Intermediate",
  },
  { id: 4, name: "Dave Lee", email: "dave@example.com", category: "Beginner" },
];

// ─────────────────────────────────────────────────────────────
// 1–3  Numeric matchers
// ─────────────────────────────────────────────────────────────
describe("Numeric matchers", () => {
  test("1. toBeGreaterThan – a winning record produces a rate above 0.5", () => {
    expect(winRate(7, 3)).toBeGreaterThan(0.5);
  });

  test("2. toBeLessThan – a losing record produces a rate below 0.5", () => {
    expect(winRate(2, 8)).toBeLessThan(0.5);
  });

  test("3. toBeCloseTo – handles floating-point imprecision (3/7 ≈ 0.43)", () => {
    // 3 wins, 4 losses → 3/(3+4) = 0.4285... ≈ 0.43 to 1 decimal place
    // toEqual(0.43) would fail; toBeCloseTo handles floating-point safely
    expect(winRate(3, 4)).toBeCloseTo(0.43, 1);
  });
});

// ─────────────────────────────────────────────────────────────
// 4  String matchers
// ─────────────────────────────────────────────────────────────
describe("String matchers", () => {
  test("4. toMatch – email matches a regular expression", () => {
    expect("alice@example.com").toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
});

// ─────────────────────────────────────────────────────────────
// 5–8  Asymmetric matchers
// ─────────────────────────────────────────────────────────────
describe("Asymmetric matchers", () => {
  test("5. expect.any – id is some Number, not one specific value", () => {
    const beginners = filterByCategory(sampleList, "Beginner");
    expect(beginners[0]).toEqual(
      expect.objectContaining({ id: expect.any(Number) }),
    );
  });

  test("6. expect.objectContaining – matches a subset of an object's keys", () => {
    expect(sampleList[0]).toEqual(
      expect.objectContaining({ name: "Alice Chen", category: "Advanced" }),
    );
  });

  test("7. expect.arrayContaining – result includes the expected items (order-independent)", () => {
    const beginners = filterByCategory(sampleList, "Beginner");
    expect(beginners).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Bob Smith" }),
        expect.objectContaining({ name: "Dave Lee" }),
      ]),
    );
  });

  test("8. expect.stringContaining – formatted label contains the participant name", () => {
    const label = formatLabel({ name: "Alice Chen", category: "Advanced" });
    expect(label).toEqual(expect.stringContaining("Alice Chen"));
  });
});

// ─────────────────────────────────────────────────────────────
// 9–12  Advanced mock APIs
// ─────────────────────────────────────────────────────────────
describe("Advanced mock APIs", () => {
  test("9. mockReturnValue – mock consistently returns the same value on every call", () => {
    const mockGetCategory = jest.fn<Category, []>().mockReturnValue("Advanced");

    expect(mockGetCategory()).toBe("Advanced");
    expect(mockGetCategory()).toBe("Advanced"); // still the same on the second call
    expect(mockGetCategory).toHaveBeenCalledTimes(2);
  });

  test("10. mockReturnValueOnce – first call returns a special value, then falls back", () => {
    const mockGetCategory = jest
      .fn<Category, []>()
      .mockReturnValueOnce("Beginner") // overrides only the first call
      .mockReturnValue("Advanced"); // default for all subsequent calls

    expect(mockGetCategory()).toBe("Beginner");
    expect(mockGetCategory()).toBe("Advanced");
    expect(mockGetCategory()).toBe("Advanced");
  });

  test("11. mockImplementation – gives the mock a real function body to execute", () => {
    const mockValidate = jest
      .fn()
      .mockImplementation((email: string) => email.includes("@"));

    expect(mockValidate("alice@example.com")).toBe(true);
    expect(mockValidate("not-an-email")).toBe(false);
  });

  test("12. jest.spyOn – intercepts a method on an existing object without replacing it", () => {
    const api: ParticipantApi = {
      getById: jest.fn(),
      logAccess: (_id: number) => {
        /* real impl would log to a service */
      },
    };

    const spy = jest.spyOn(api, "logAccess");

    api.logAccess(42);

    expect(spy).toHaveBeenCalledWith(42);
    spy.mockRestore(); // restore the original implementation when done
  });
});

// ─────────────────────────────────────────────────────────────
// 13–14  Async mocking
// ─────────────────────────────────────────────────────────────
describe("Async mocking", () => {
  const mockParticipant: Participant = {
    id: 1,
    name: "Alice Chen",
    email: "alice@example.com",
    category: "Advanced",
  };

  test("13. mockResolvedValue – simulates a successful async API response", async () => {
    const api = { getById: jest.fn().mockResolvedValue(mockParticipant) };

    const result = await api.getById(1);

    expect(result).toEqual(mockParticipant);
    expect(api.getById).toHaveBeenCalledWith(1);
  });

  test("14. rejects.toThrow – simulates a failing async API call", async () => {
    const api = {
      getById: jest.fn().mockRejectedValue(new Error("Participant not found")),
    };

    await expect(api.getById(99)).rejects.toThrow("Participant not found");
  });
});

// ─────────────────────────────────────────────────────────────
// 15  Parametrized tests with test.each
// ─────────────────────────────────────────────────────────────
describe("Parametrized tests with test.each", () => {
  // test.each runs the same assertion for every row in the table.
  // Jest reports each row as a separate test in the output.
  test.each<[Category, number]>([
    ["Beginner", 2],
    ["Intermediate", 1],
    ["Advanced", 1],
  ])(
    '15. filterByCategory("%s") returns %i participant(s)',
    (category, expected) => {
      expect(filterByCategory(sampleList, category)).toHaveLength(expected);
    },
  );
});
