const enum Unit {
  Microsecond = 1,
  Millisecond,
  Second,
  Minute,
  Hour,
  Day,
  Week,
}

const enum T {
  Millisecond = 1,
  Microsecond = T.Millisecond / 1000,
  Second = T.Millisecond * 1000,
  Minute = T.Second * 60,
  Hour = T.Minute * 60,
  Day = T.Hour * 24,
  Week = T.Day * 7,
}

export type Interval = {
  /**
   * Indicates the Interval unit base.
   */
  readonly unit: Unit;
  /**
   * The raw value of the Interval.
   */
  readonly value: number;

  /**
   * Perform a transform on the raw value
   * returning a new Interval of the same Unit.
   */
  map(op: (value: number) => number): Interval;

  /**
   * Returns the Interval converted to microseconds.
   */
  toMicroseconds(): Interval;
  /**
   * Returns the Interval converted to milliseconds.
   */
  toMilliseconds(): Interval;
  /**
   * Returns the Interval converted to seconds.
   */
  toSeconds(): Interval;
  /**
   * Returns the Interval converted to minutes.
   */
  toMinutes(): Interval;
  /**
   * Returns the Interval converted to hours.
   */
  toHours(): Interval;
  /**
   * Returns the Interval converted to days.
   */
  toDays(): Interval;
  /**
   * Returns the Interval converted to weeks.
   */
  toWeeks(): Interval;

  toString(options?: { mode?: keyof typeof unitLabels }): string;
  valueOf(): number;
};

export type IntervalCtor = (value: number) => Interval;

const unitLabels = {
  verbose: {
    [Unit.Microsecond]: "microsecond",
    [Unit.Millisecond]: "millisecond",
    [Unit.Second]: "second",
    [Unit.Minute]: "minute",
    [Unit.Hour]: "hour",
    [Unit.Day]: "day",
    [Unit.Week]: "week",
  },
  abbreviated: {
    [Unit.Microsecond]: "µs",
    [Unit.Millisecond]: "ms",
    [Unit.Second]: "s",
    [Unit.Minute]: "m",
    [Unit.Hour]: "h",
    [Unit.Day]: "d",
    [Unit.Week]: "wk",
  },
};

export const Microsecond: IntervalCtor = (n) => Interval(n, Unit.Microsecond);
export const Millisecond: IntervalCtor = (n) => Interval(n, Unit.Millisecond);
export const Second: IntervalCtor = (n) => Interval(n, Unit.Second);
export const Minute: IntervalCtor = (n) => Interval(n, Unit.Minute);
export const Hour: IntervalCtor = (n) => Interval(n, Unit.Hour);
export const Day: IntervalCtor = (n) => Interval(n, Unit.Day);
export const Week: IntervalCtor = (n) => Interval(n, Unit.Week);

function Interval(value: number, unit: Unit): Interval {
  if (Number.isNaN(value)) {
    throw new TypeError(`Cannot create an Interval from NaN`);
  }

  return {
    unit,
    value,

    map: (op) => Interval(op(value), unit),

    toMicroseconds: () => Microsecond((value * t(unit)) / T.Microsecond),
    toMilliseconds: () => Millisecond((value * t(unit)) / T.Millisecond),
    toSeconds: () => Second((value * t(unit)) / T.Second),
    toMinutes: () => Minute((value * t(unit)) / T.Minute),
    toHours: () => Hour((value * t(unit)) / T.Hour),
    toDays: () => Day((value * t(unit)) / T.Day),
    toWeeks: () => Week((value * t(unit)) / T.Week),

    toString(options = {}) {
      const { mode } = options;
      const label = unitLabels[mode || "verbose"][unit];
      return `${value} ${label}`;
    },

    valueOf: () => value,
  };
}

/**
 * Convert a unit into a time base.
 */
function t(unit: Unit): T {
  switch (unit) {
    case Unit.Microsecond:
      return T.Microsecond;

    case Unit.Millisecond:
      return T.Millisecond;

    case Unit.Second:
      return T.Second;

    case Unit.Minute:
      return T.Minute;

    case Unit.Hour:
      return T.Hour;

    case Unit.Day:
      return T.Day;

    case Unit.Week:
      return T.Week;
  }
}
