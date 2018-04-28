enum ResultKind {
  Ok,
  Err,
}

interface Ok<T> {
  kind: ResultKind.Ok;
  val: T;
}

interface Err {
  kind: ResultKind.Err;
  err: string;
}

type Result<T> = Ok<T> | Err;

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

function isOk<T>(val: Result<T>): val is Ok<T> {
  return val.kind === ResultKind.Ok;
}

function isString(ok: Ok<number | string>): ok is Ok<string> {
  return typeof ok.val === 'string';
}

const a: Ok<number> = { kind: ResultKind.Ok, val: 1 };
const b: Ok<number> = { kind: ResultKind.Ok, val: 2 };
const c: Err = { kind: ResultKind.Err, err: 'some err' };
const d: Ok<string> = { kind: ResultKind.Ok, val: 'a' };
const results: Result<number | string>[] = [a, b, c, d];

type Pred<T, U extends T> = (v: T) => v is U;
function filter<T, U extends T>(coll: T[], pred: Pred<T, U>): U[] {
  const seed: U[] = [];
  return coll.reduce((acc: U[], val: T) => {
    if (pred(val)) {
      return [...acc, val];
    }
    return acc;
  }, seed);
}

type Tuple<T, U> = [T, U];
type ArrayTuple<T, U> = Tuple<T[], U[]>;
type Partition<T, U extends T> = ArrayTuple<U, Exclude<T, U>>;

type X = string | number | boolean;
type Y = string | number;
type Z = Exclude<X, Y>
const z: Z = true;
const p: Partition<X, Y> = [['a', 1], [true, false]];

function isY(val: X | Y): val is Y {
  return typeof(val) !== 'boolean';
}

function testXorY(pred: Pred<X, Y>, val: X | Y): string {
  if (pred(val)) {
    return typeof(val) === 'string' ? val : val.toString();
  }
  const x: Z = val;
  return 'nope';
}

function someFn<T, U extends T>(pred: Pred<T, U>, val: U | Exclude<T, U>): void {
  if (pred(val)) {
    const u: U = val;
    console.log(u);
    return;
  }
  const notU: Exclude<T, U> = val;
  console.log(notU);
}

function doSthOnString(val: string | number): void {
  if (typeof val === 'string') {
    console.log(val);
    return;
  }
  const x: number = val;
}

function doSthOnOk<T>(val: Result<T>): void {
  if (val.kind === ResultKind.Ok) {
    console.log(val.val);
    return;
  }
  console.log('err', val.err);
}

type Pred2<T, U> = (v: T | U) => v is T;
function doSth<T, U extends T>(pred: Pred2<U, Exclude<T, U>>, val: U | Exclude<T, U>): void {
  if (pred(val)) {
    const u: U = val;
    console.log(u);
    return;
  }
  const notU: Exclude<T, U> = val;
  console.log(notU);
}

type PartitionPred<T, U extends T> = (v: U | Exclude<T, U>) => v is U;
function partition2<T, U extends T>(coll: T[], pred: PartitionPred<T, U>): Partition<T, U> {
  const seed: Partition<T, U> = [[], []];
  return coll.reduce((acc: Partition<T, U>, val: U | Exclude<T, U>) => {
    const [yes, no] = acc;
    if (pred(val)) {
      const p: Partition<T, U> = [[...yes, val], no];
      return p;
    }
    const p: Partition<T, U> = [yes, [...no, val]];
    return p;
  }, seed);
}

function partition<T, U extends T>(coll: T[], pred: Pred<T, U>): Partition<T, U> {
  const seed: Partition<T, U> = [[], []];
  return coll.reduce((acc: Partition<T, U>, val: U | Exclude<T, U>) => {
    const [yes, no] = acc;
    if (pred(val)) {
      const p: Partition<T, U> = [[...yes, val], no];
      return p;
    }
    const p: Partition<T, U> = [yes, [...no, val]];
    return p;
  }, seed);
}

function first<T>(coll: T[]): Maybe<T> {
  return coll.length
    ? { kind: MaybeKind.Some, val: coll[0] }
    : { kind: MaybeKind.None };
}

const [oks, errs] = partition(results, isOk);
const [stringOks, numberOks] = partition(oks, isString);
// const oks: Ok<number | string>[] = filter(results, isOk);
// const oks: Ok<number | string>[] = filter(results, <T>(r: Result<T>): r is Ok<T> => r.kind === 'OK');
// const stringOks: Ok<string>[] = filter(oks, isString);
const maybeStringOk = first(stringOks);

function withDefault<T>(maybe: Maybe<T>, def: T): T {
  switch(maybe.kind) {
    case MaybeKind.Some:
      return maybe.val;
    case MaybeKind.None:
      return def;
  }
}
