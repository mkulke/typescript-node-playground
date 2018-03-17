type Reducer<T, V> = (accumulator: T, value: V) => T;

type FilterReducer<T> = Reducer<Array<T>, T>;
function filter<T>(predicate: (t: T) => boolean): FilterReducer<T> {
  return function(accumulator, value) {
    if (predicate(value)) {
      return [...accumulator, value];
    }
    return accumulator;
  };
}

// return fn returning reducer
type Transducer<T, V> = (r: Reducer<V, T>) => Reducer<V, T>;

function filterT<T, V>(predicate: (t: T) => boolean): Transducer<T, V> {
  return function(reducer: Reducer<V, T>): Reducer<V, T> {
    return function(accumulator, value) {
      if (predicate(value)) {
        return reducer(accumulator, value);
      }
      return accumulator;
    };
  };
}

type MapReducer<T, V> = Reducer<Array<T>, V>;
function map<T, V>(transformer: (v: V) => T): MapReducer<T, V> {
  // return function(accumulator: Array<T>, value: V): Array<T> {
  return function(accumulator, value) {
    const transformed: T = transformer(value);
    return [...accumulator, transformed];
  };
}

function mapT<T, V>(
  transformer: (v: V) => T,
): (r: Reducer<Array<V>, T>) => Reducer<Array<V>, V> {
  return function(reducer: Reducer<Array<V>, T>): Reducer<Array<V>, V> {
    return function(accumulator: Array<V>, value: V): Array<V> {
      const transformed = transformer(value);
      return reducer(accumulator, transformed);
    };
  };
}

const numbers = [1, 2, 3, 4];
const reduced = numbers
  .reduce(filter(v => v > 2), [])
  .reduce(map(v => v.toString()), []);

console.log('reduced %j', reduced);

const identity = map(x => x);
const filterX = filterT(v => v > 1);
const mapX = mapT(v => v.toString());
const transduced = numbers.reduce(filterX(mapX(identity)), []);

console.log('transduced %j', transduced);
