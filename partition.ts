import * as Result from './result';
import * as Maybe from './maybe';

const a = Result.ok(1);
const b = Result.ok(2);
const c = Result.err(new Error('some err'));
const d = Result.ok('a');
const results: Result.Result<number | string>[] = [a, b, c, d];

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

function first<T>(coll: T[]): Maybe.Maybe<T> {
  return coll.length ? Maybe.some(coll[0]) : Maybe.none();
}

// const oks: Ok<number | string>[] = filter(results, Result.isOk);
const [oks, errs] = partition(results, Result.isOk);
const values = oks.map(Result.flatten);
const [strings, numbers] = partition(
  values,
  (v: string | number): v is string => typeof v === 'string',
);

const maybeStr = first(strings);
const str = Maybe.withDefault(maybeStr, ':(');
console.log('str: %j', str);
