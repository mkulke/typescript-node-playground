enum MaybeKind {
  Some,
  None,
}

interface Some<T> {
  kind: MaybeKind.Some;
  val: T;
}

interface None {
  kind: MaybeKind.None;
}

type Maybe<T> = Some<T> | None;

function some<T>(val: T): Maybe<T> {
  return { kind: MaybeKind.Some, val };
}

function none(): None {
  return { kind: MaybeKind.None };
}

function isSome<T>(maybe: Maybe<T>): maybe is Some<T> {
  return maybe.kind === MaybeKind.Some;
}

function withDefault<T>(maybe: Maybe<T>, def: T): T {
  if (maybe.kind === MaybeKind.Some) {
    return flatten(maybe);
  }
  return def;
}

function flatMap<T, U>(maybe: Maybe<T>, fn: (val: T) => Maybe<U>): Maybe<U> {
  if (maybe.kind === MaybeKind.None) {
    return maybe;
  }
  return fn(flatten(maybe));
}

function map<T, U>(maybe: Maybe<T>, fn: (val: T) => U): Maybe<U> {
  if (maybe.kind === MaybeKind.None) {
    return maybe;
  }
  return some(fn(flatten(maybe)));
}

function flatten<T>(some: Some<T>): T {
  return some.val;
}

export {
  Maybe,
  isSome,
  some,
  none,
  withDefault,
  flatMap,
  map,
  flatten,
}
