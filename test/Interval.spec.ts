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
