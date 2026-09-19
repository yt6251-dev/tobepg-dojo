export function groupBy<T, K extends string>(items: T[], key: (t: T) => K): Record<K, T[]> {
  throw new Error("未実装");
}

export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  throw new Error("未実装");
}

export function uniqueBy<T>(items: T[], key: (t: T) => string | number): T[] {
  throw new Error("未実装");
}
