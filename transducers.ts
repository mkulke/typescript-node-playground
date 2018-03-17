type FilterRdcr<V> = (a: V[], v: V) => V[];
function buildFilterRdcr<T>(predicateFn: (t: T) => boolean): FilterRdcr<T> {
  return (acc, val) => (predicateFn(val) ? [...acc, val] : acc);
  // return function(accumulator, value) {
  //   if (predicate(value)) {
  //     return [...accumulator, value];
  //   }
  //   return accumulator;
  // };
}

type FilterTdcr<V> = (r: FilterRdcr<V>) => FilterRdcr<V>;
type PredicateFn<V> = (v: V) => boolean;
function buildFilterTdcr<V>(predicateFn: PredicateFn<V>): FilterTdcr<V> {
  return rdcr => (acc, val) => (predicateFn(val) ? rdcr(acc, val) : acc);
}

type MapRdcr<I, O> = (a: O[], v: I) => O[];
function buildMapRdcr<I, O>(transformFn: (v: I) => O): (a: O[], v: I) => O[] {
  return (acc, val) => [...acc, transformFn(val)];
  // return function(acc: O[], val: I): O[] {
  //   const transformed: O = transformFn(val);
  //   return [...acc, transformed];
  // };
}

type MapTdcr<I, O, X> = (m: MapRdcr<O, X>) => MapRdcr<I, X>;
function buildMapTdcr<I, O, X>(transformFn: (i: I) => O): MapTdcr<I, O, X> {
  return rdcr => (acc, val) => rdcr(acc, transformFn(val));
  // return function(rdcr: MapRdcr<O, X>): MapRdcr<I, X> {
  //   return function(acc: X[], val: I): X[] {
  //     const transformed: O = transformFn(val);
  //     const result: X[] = rdcr(acc, transformed);
  //     return result;
  //   };
  // };
}

const numbers = [1, 2, 3, 4];
const reduced = numbers
  .reduce(buildFilterRdcr(v => v > 2), [])
  .reduce(buildMapRdcr(v => v.toString()), []);

console.log('reduced %j', reduced);

const identityRdcr = buildMapRdcr(x => x);
const filterTdcr = buildFilterTdcr(v => v > 1);
const mapTdcr = buildMapTdcr(v => v.toString());
const transduced = numbers.reduce(filterTdcr(mapTdcr(identityRdcr)), []);

console.log('transduced %j', transduced);
