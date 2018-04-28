// function partition<U extends T>(coll: T[], predicate: (v: T) => v is U): [U[],Exclude<T, U>[]] {
//   if (predicate(v)) {
//     return
//   }
// }

// type Without<T, U> = T extends U ? never : T;
// type Pred<T, U extends T> = (v: T) => boolean;
type NumberOrString = number | string;

// function isString<T>(val: T): val is string {
//   return typeof(val) === 'string';
// }

interface Bla {
  kind: 'BLA';
  value: number;
}

interface Blub {
  kind: 'BLUB';
  value: string;
}

type BlaOrBlub = Bla | Blub;

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

function partition<T, U extends T>(coll: T[], pred: Pred<T, U>): Partition<T, U> {
  const first = filter(coll, pred);
  // return [[], first]; // does not compile
  // return [first ,[]];
  const seed: Partition<T, U> = [[], []];
  return coll.reduce((acc: Partition<T, U>, val: T) => {
    const [yes, no] = acc;
    if (pred(val)) {
      // const x: U = val;
      const p: Partition<T, U> = [[...yes, val], no];
      return p;
      // return [[...yes, val], no];
    }
    const p: Partition<T, U> = [yes, [...no, val]];
    return p;
    // const x: Exclude<T, U> = val;
    // return [[...yes, val], no];
    // return acc;
  }, seed);
}

const oks: Ok<number | string>[] = filter(results, isOk);
// const oks: Ok<number | string>[] = filter(results, <T>(r: Result<T>): r is Ok<T> => r.kind === 'OK');
const stringOks: Ok<string>[] = filter(oks, isString);

// type Pred<T, U extends T> = (v: T) => v is U;
// type Pred<T, U extends T> = (v: T) => v is U;
// type Partition<T, U> = [U[], (Exclude<T, U>)[]];
// function partition<T, U extends T>(coll: T[], pred: Pred<T, U>): Partition<U, T> {
//   return coll.reduce(
//     (memo: Partition<U, T>, val: T): Partition<U, T> => {
//       const [fst, lst] = memo;
//       if (pred(val)) {
//         const u: U = val;
//         // fst.push(val);
//         return [[u], []];
//         // return memo;
//       }
//       const t: Extract<T, U> = val;
//       // return [[], [t]];
//       // lst.push(val);
//       return memo;
//     },
//     [[], []],
//   );
// }
//   const fst: U[] = [];
//   const lst: Without<T, U> = [];
//   // const memo = {
//   //   fst: U
//   //   lst: Exclude<T, U>
//   // };
//   const parts = coll.reduce(
//     (memo, val: T) => {
//       if (pred(val)) {
//         const fst = [...memo.fst, val];
//         return { ...memo, fst };
//       }
//       const lst = [...memo.lst, val];
//       return { ...memo, lst };
//     },
//     { fst: [], lst: [] },
//   );

//   return [parts.fst, parts.lst];
// }

// const mixedArray = [2, 'BLA', 1];
// const [strings, numbers] = partition(
//   mixedArray,
//   val => typeof val === 'string',
// );

// console.log('mgns %j %j', strings, numbers);
