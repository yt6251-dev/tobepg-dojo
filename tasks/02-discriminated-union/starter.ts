export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

export function ok<T>(data: T): Result<T> {
  throw new Error("未実装");
}

export function fail(code: string, message: string): Result<never> {
  throw new Error("未実装");
}

export function unwrap<T>(r: Result<T>): T {
  throw new Error("未実装");
}

export function mapResult<T, U>(r: Result<T>, f: (t: T) => U): Result<U> {
  throw new Error("未実装");
}

export function describeError(r: Result<unknown>): string {
  throw new Error("未実装");
}
