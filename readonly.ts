import * as _ from 'lodash';

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T];

type DeepReadonlyObject<T> = {
    readonly [P in NonFunctionPropertyNames<T>]: DeepReadonly<T[P]>;
};

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonly<T> =
  T extends any[] ? DeepReadonlyArray<T[number]> :
  T extends object ? DeepReadonlyObject<T> :
  T;

interface Step {
  length: number;
}

interface Trip {
  mode: 'TRANSIT' | 'WALK';
  steps: Step[];
}

type Trips = Trip[];

function mgns(trips: DeepReadonly<Trips>): void {
  const trip = trips[0];
  if (trip === undefined) {
    return;
  }
  // readonly error
  // trips.pop();
  // readonly error
  // trip.mode = 'WALK';
  const step = trip.steps[0];
  // readonly error
  // trip.steps.push({ length: 1 });
  if (step === undefined) {
    return;
  }
  // readonly error
  // step.length = 2;
}
