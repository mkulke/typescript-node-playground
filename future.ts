type ResolveFn<T> = (t: T) => void;
// type RejectFn<T> = ResolveFn<T>;
// type FutureFn<T, U> = (rj: RejectFn<T>, rs: ResolveFn<U>) => void;
type FutureFn<T> = (rs: ResolveFn<T>) => void;
interface Future<T> {
  fn: FutureFn<T>;
}

function future<T>(fn: FutureFn<T>): Future<T> {
  return { fn };
}

function fork<T, U>(resolve: ResolveFn<U>, future: Future<U>): void {
  future.fn(resolve);
}

const one = future(res => {
  setTimeout(() => res(10), 1000);
});

function map<T, U>(fn: (val: T) => U, fut: Future<T>): Future<U> {
  return future(innerFn => fut.fn(val => innerFn(fn(val))));
}

function flatMap<T, U>(fn: (val: T) => Future<U>, fut: Future<T>): Future<U> {
  return future(innerFn => fut.fn(val => fork(innerFn, fn(val))));
}

function flatten<T>(fut: Future<Future<T>>): Future<T> {
  return flatMap(x => x, fut);
}

const mgns = (val: number) =>
  future(res => {
    setTimeout(() => res(val * 3), 500);
  });

const two = map((x: number) => x * 2, one);
const three = flatMap(mgns, two);
fork(console.log, three);
