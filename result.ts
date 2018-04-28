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
  err: Error;
}

type Result<T> = Ok<T> | Err;

function ok<T>(val: T): Ok<T> {
  return { kind: ResultKind.Ok, val };
}

function err(err: Error): Err {
  return { kind: ResultKind.Err, err };
}

function isOk<T>(val: Result<T>): val is Ok<T> {
  return val.kind === ResultKind.Ok;
}

function flatten<T>(ok: Ok<T>): T {
  return ok.val;
}

export {
  Result,
  flatten,
  isOk,
  ok,
  err,
}
