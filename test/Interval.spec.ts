import {
  Millisecond,
  Day,
  Hour,
  Microsecond,
  Minute,
  Second,
  Week,
} from "../src/Interval";

const TruthTable = {
  Microsecond: {
    Microsecond: 1,
    Millisecond: 1 / 1000,
    Second: 1 / (1000 * 1000),
    Minute: 1 / (60 * 1000 * 1000),
    Hour: 1 / (60 * 60 * 1000 * 1000),
    Day: 1 / (24 * 60 * 60 * 1000 * 1000),
    Week: 1 / (7 * 24 * 60 * 60 * 1000 * 1000),
  },
  Millisecond: {
    Microsecond: 1000,
    Millisecond: 1,
    Second: 1 / 1000,
    Minute: 1 / (60 * 1000),
    Hour: 1 / (60 * 60 * 1000),
    Day: 1 / (24 * 60 * 60 * 1000),
    Week: 1 / (7 * 24 * 60 * 60 * 1000),
  },
  Second: {
    Microsecond: 1 * 1000 * 1000,
    Millisecond: 1 * 1000,
    Second: 1,
    Minute: 1 / 60,
    Hour: 1 / (60 * 60),
    Day: 1 / (24 * 60 * 60),
    Week: 1 / (7 * 24 * 60 * 60),
  },
  Minute: {
    Microsecond: 1 * 60 * 1000 * 1000,
    Millisecond: 1 * 60 * 1000,
    Second: 1 * 60,
    Minute: 1,
    Hour: 1 / 60,
    Day: 1 / (24 * 60),
    Week: 1 / (7 * 24 * 60),
  },
  Hour: {
    Microsecond: 1 * 60 * 60 * 1000 * 1000,
    Millisecond: 1 * 60 * 60 * 1000,
    Second: 1 * 60 * 60,
    Minute: 1 * 60,
    Hour: 1,
    Day: 1 / 24,
    Week: 1 / (7 * 24),
  },
  Day: {
    Microsecond: 1 * 24 * 60 * 60 * 1000 * 1000,
    Millisecond: 1 * 24 * 60 * 60 * 1000,
    Second: 1 * 24 * 60 * 60,
    Minute: 1 * 24 * 60,
    Hour: 1 * 24,
    Day: 1,
    Week: 1 / 7,
  },
  Week: {
    Microsecond: 1 * 7 * 24 * 60 * 60 * 1000 * 1000,
    Millisecond: 1 * 7 * 24 * 60 * 60 * 1000,
    Second: 1 * 7 * 24 * 60 * 60,
    Minute: 1 * 7 * 24 * 60,
    Hour: 1 * 7 * 24,
    Day: 1 * 7,
    Week: 1,
  },
} as const;

const RootTestTable = [
  {
    label: "Microsecond",
    interval: Microsecond(1),
    table: TruthTable.Microsecond,
  },
  {
    label: "Millisecond",
    interval: Millisecond(1),
    table: TruthTable.Millisecond,
  },
  {
    label: "Second",
    interval: Second(1),
    table: TruthTable.Second,
  },
  {
    label: "Minute",
    interval: Minute(1),
    table: TruthTable.Minute,
  },
  {
    label: "Hour",
    interval: Hour(1),
    table: TruthTable.Hour,
  },
  {
    label: "Day",
    interval: Day(1),
    table: TruthTable.Day,
  },
  {
    label: "Week",
    interval: Week(1),
    table: TruthTable.Week,
  },
];

for (const { interval, table, label } of RootTestTable) {
  describe(label, () => {
    test(`${label}#valueOf`, () => {
      expect(interval.valueOf()).toBe(interval.value);
      expect(+interval).toBe(interval.value);
    });
    test(`${label}#toString`, () => {
      expect(interval.toString()).toMatchSnapshot(`${label} default`);
      expect(interval.toString({ mode: "abbreviated" })).toMatchSnapshot(
        `${label} abbreviated`
      );
      expect(interval.toString({ mode: "verbose" })).toMatchSnapshot(
        `${label} verbose`
      );
    });

    const tt = [
      { actual: interval.toMicroseconds(), expected: table.Microsecond },
      { actual: interval.toMilliseconds(), expected: table.Millisecond },
      { actual: interval.toSeconds(), expected: table.Second },
      { actual: interval.toMinutes(), expected: table.Minute },
      { actual: interval.toHours(), expected: table.Hour },
      { actual: interval.toDays(), expected: table.Day },
      { actual: interval.toWeeks(), expected: table.Week },
    ];

    for (const { actual, expected } of tt) {
      test(`${actual.toString({ mode: "verbose" })}`, () => {
        expect(actual.value).toBe(expected);
      });
    }
  });
}

test("Interval type coercion", () => {
  // unequal
  expect(Day(7) == Week(1).toDays()).toBe(false);
  // Loosely equal
  expect(+Day(7) === +Week(1).toDays()).toBe(true);

  {
    const dayInWks: any = Day(1).toWeeks();
    const t = Week(1).map((n) => n + dayInWks);
    const d = t.toDays();
    expect(d.value).toBe(8);
  }
});

describe("Symbol.toStringTag", () => {
  const tt = [
    [Microsecond(), "[object Microsecond]"],
    [Millisecond(), "[object Millisecond]"],
    [Second(), "[object Second]"],
    [Minute(), "[object Minute]"],
    [Hour(), "[object Hour]"],
    [Day(), "[object Day]"],
    [Week(), "[object Week]"],
  ] as const;

  const StringTag = Object.prototype.toString;

  for (const [interval, tag] of tt) {
    test(tag, () => {
      expect(StringTag.call(interval)).toBe(tag);
    });
  }
});

describe("Default initializers", () => {
  const tt = [Microsecond, Millisecond, Second, Minute, Hour, Day, Week];

  for (const Interval of tt) {
    test(Interval.name, () => {
      expect(Interval).not.toThrow();
      expect(Interval().value).toBe(0);
    });
  }
});
