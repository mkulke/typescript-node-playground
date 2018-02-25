import * as assert from 'assert';
import * as _ from 'lodash';

interface Step {
  mode: 'WALK' | 'INTERCHANGE' | 'TRANSIT';
}

function sanitize(steps: Step[]): Step[] {
  return _.reduce(
    steps,
    (sanitizedSteps, step) => {
      const last = _.last(sanitizedSteps);
      const rest = sanitizedSteps.slice(0, -1);
      if (last === undefined) {
        return [step];
      }

      if (last.mode === 'WALK' && step.mode === 'INTERCHANGE') {
        return [...rest, step];
      }

      if (last.mode === 'INTERCHANGE' && step.mode === 'WALK') {
        return [...rest, last];
      }

      if (last.mode === 'WALK' && step.mode === 'WALK') {
        return [...rest, last];
      }

      return [...sanitizedSteps, step];
    },
    [],
  );
}

const a: Step[] = [
  { mode: 'WALK' },
  { mode: 'INTERCHANGE' },
  { mode: 'TRANSIT' },
  { mode: 'WALK' },
];

const aS = sanitize(a);

const abc = _.map(aS, x => x.mode);
assert(_.isEqual(abc, ['INTERCHANGE', 'TRANSIT', 'WALK']), 'no match');
