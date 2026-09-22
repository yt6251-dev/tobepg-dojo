import { describe, it, expect, expectTypeOf } from "vitest";
import { groupBy, pick, uniqueBy } from "./starter";

type Ev = { id: string; section: "開発部" | "営業部"; title: string };
const evs: Ev[] = [
  { id: "1", section: "開発部", title: "a" },
  { id: "2", section: "営業部", title: "b" },
  { id: "3", section: "開発部", title: "c" },
];

describe("groupBy", () => {
  it("キーごとに配列にまとめる", () => {
    const g = groupBy(evs, (e) => e.section);
    expect(g["開発部"].map((e) => e.id)).toEqual(["1", "3"]);
    expect(g["営業部"].map((e) => e.id)).toEqual(["2"]);
    expectTypeOf(g).toEqualTypeOf<Record<"開発部" | "営業部", Ev[]>>();
  });
  it("空配列なら空オブジェクト", () => {
    expect(groupBy([] as Ev[], (e) => e.section)).toEqual({});
  });
});

describe("pick", () => {
  it("指定した項目だけ残す", () => {
    const s = { id: "s1", name: "x", password: "secret", passwordHash: "h" };
    const safe = pick(s, ["id", "name"]);
    expect(safe).toEqual({ id: "s1", name: "x" });
    expectTypeOf(safe).toEqualTypeOf<{ id: string; name: string }>();
    // @ts-expect-error 落とした項目は型にも無い
    safe.password;
  });
});

describe("uniqueBy", () => {
  it("最初に出た要素を残す", () => {
    const acc = [{ id: "a", n: 1 }, { id: "b", n: 2 }, { id: "a", n: 3 }];
    expect(uniqueBy(acc, (x) => x.id)).toEqual([{ id: "a", n: 1 }, { id: "b", n: 2 }]);
  });
});
