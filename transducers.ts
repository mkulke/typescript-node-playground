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

type MapReducer<T, V> = Reducer<Array<T>, V>;
function map<T, V>(transformer: (v: V) => T): MapReducer<T, V> {
  // return function(accumulator: Array<T>, value: V): Array<T> {
  return function(accumulator, value) {
    const transformed: T = transformer(value);
    return [...accumulator, transformed];
  };
}

const numbers = [1, 2, 3, 4];
const strings = numbers
  .reduce(filter(v => v > 2), [])
  .reduce(map(v => v.toString()), []);

console.log('mgns %j', strings);
