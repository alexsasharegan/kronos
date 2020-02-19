/**
 * Unit of time `U`.
 */
const enum U {
  Microsecond = 1,
  Millisecond,
  Second,
  Minute,
  Hour,
  Day,
  Week,
}

/**
 * Time units `T` in milliseconds.
 */
const enum T {
  Millisecond = 1,
  Microsecond = T.Millisecond / 1000,
  Second = T.Millisecond * 1000,
  Minute = T.Second * 60,
  Hour = T.Minute * 60,
  Day = T.Hour * 24,
  Week = T.Day * 7,
}

const enum StringTag {
  Microsecond = "Microsecond",
  Millisecond = "Millisecond",
  Second = "Second",
  Minute = "Minute",
  Hour = "Hour",
  Day = "Day",
  Week = "Week",
}

export type Interval = {
  /**
   * Indicates the Interval unit base.
   */
  readonly unit: U;
  /**
   * The raw value of the Interval.
   */
  readonly value: number;

  /**
   * Perform a transform on the raw value
   * returning a new Interval of the same Unit.
   */
  map(operation: (value: number) => number): Interval;

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

  /**
   * Custom string coercion behavior.
   */
  toString(options?: {
    mode?: keyof typeof unitLabels;
    separator?: string;
  }): string;
  /**
   * Custom primitive type casting behavior.
   */
  valueOf(): number;
  [Symbol.toPrimitive](hint: string): number | string;
  [Symbol.toStringTag]: StringTag;
};

export type CreateInterval = (value?: number) => Interval;

const unitLabels = {
  verbose: {
    [U.Microsecond]: "microsecond",
    [U.Millisecond]: "millisecond",
    [U.Second]: "second",
    [U.Minute]: "minute",
    [U.Hour]: "hour",
    [U.Day]: "day",
    [U.Week]: "week",
  },
  abbreviated: {
    [U.Microsecond]: "µs",
    [U.Millisecond]: "ms",
    [U.Second]: "sec",
    [U.Minute]: "min",
    [U.Hour]: "hr",
    [U.Day]: "d",
    [U.Week]: "wk",
  },
};

export const Microsecond: CreateInterval = (n = 0) =>
  Interval(n, U.Microsecond);
export const Millisecond: CreateInterval = (n = 0) =>
  Interval(n, U.Millisecond);
export const Second: CreateInterval = (n = 0) => Interval(n, U.Second);
export const Minute: CreateInterval = (n = 0) => Interval(n, U.Minute);
export const Hour: CreateInterval = (n = 0) => Interval(n, U.Hour);
export const Day: CreateInterval = (n = 0) => Interval(n, U.Day);
export const Week: CreateInterval = (n = 0) => Interval(n, U.Week);

function Interval(value: number, unit: U): Interval {
  if (Number.isNaN(value)) {
    throw new TypeError(`Cannot create an Interval from NaN`);
  }

  const interval: Interval = {
    unit,
    value,

    map: (op) => Interval(op(value), unit),

    toMicroseconds: () => Microsecond((value * base(unit)) / T.Microsecond),
    toMilliseconds: () => Millisecond((value * base(unit)) / T.Millisecond),
    toSeconds: () => Second((value * base(unit)) / T.Second),
    toMinutes: () => Minute((value * base(unit)) / T.Minute),
    toHours: () => Hour((value * base(unit)) / T.Hour),
    toDays: () => Day((value * base(unit)) / T.Day),
    toWeeks: () => Week((value * base(unit)) / T.Week),

    toString(options = {}) {
      const mode = options.mode || "verbose";
      // Use a provided separator or
      // use a space for verbose string or
      // use no space for abbreviated string.
      const separator =
        typeof options.separator === "string"
          ? options.separator
          : mode === "verbose"
          ? " "
          : "";

      const label = unitLabels[mode || "verbose"][unit];

      return value.toString(10) + separator + label;
    },

    valueOf: () => value,
    [Symbol.toPrimitive]: (hint: any) => {
      switch (hint) {
        case "string":
          return interval.toString();
        case "number":
        case "default":
        default:
          return value;
      }
    },
    [Symbol.toStringTag]: tag(unit),
  };

  return interval;
}

/**
 * Convert a unit into a time base.
 */
function base(unit: U): T {
  switch (unit) {
    case U.Microsecond:
      return T.Microsecond;

    case U.Millisecond:
      return T.Millisecond;

    case U.Second:
      return T.Second;

    case U.Minute:
      return T.Minute;

    case U.Hour:
      return T.Hour;

    case U.Day:
      return T.Day;

    case U.Week:
      return T.Week;
  }
}

function tag(unit: U): StringTag {
  switch (unit) {
    case U.Microsecond:
      return StringTag.Microsecond;

    case U.Millisecond:
      return StringTag.Millisecond;

    case U.Second:
      return StringTag.Second;

    case U.Minute:
      return StringTag.Minute;

    case U.Hour:
      return StringTag.Hour;

    case U.Day:
      return StringTag.Day;

    case U.Week:
      return StringTag.Week;
  }
}
