import * as Maybe from './maybe';

const a = Maybe.some('a')
const b = Maybe.map(a, v => v === 'a' ? 0 : 1);
const c = Maybe.flatMap(b, v => v > 1 ? Maybe.none() : Maybe.some(v === 0))
