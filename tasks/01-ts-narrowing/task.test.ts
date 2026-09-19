import { describe as d, it, expect, expectTypeOf } from "vitest";
import { describe, isNonEmptyString, firstDefined } from "./starter";

d("describe", () => {
  it("型ごとに接頭辞を付ける", () => {
    expect(describe("a")).toBe("text:a");
    expect(describe(3)).toBe("number:3");
    expect(describe(true)).toBe("bool:true");
    expect(describe(null)).toBe("empty");
    expect(describe(undefined)).toBe("empty");
  });
  it("空文字も text", () => {
    expect(describe("")).toBe("text:");
  });
});

d("isNonEmptyString", () => {
  it("空でない文字列だけ true", () => {
    expect(isNonEmptyString("x")).toBe(true);
    expect(isNonEmptyString("")).toBe(false);
    expect(isNonEmptyString(0)).toBe(false);
    expect(isNonEmptyString(null)).toBe(false);
  });
  it("型ガードとして働く", () => {
    const v: unknown = "hello";
    if (isNonEmptyString(v)) expectTypeOf(v).toEqualTypeOf<string>();
  });
});

d("firstDefined", () => {
  it("最初の値を返す", () => {
    expect(firstDefined([null, undefined, 0, 1])).toBe(0);
    expect(firstDefined<string>([])).toBeUndefined();
    expect(firstDefined([undefined, "a"])).toBe("a");
  });
  it("戻り値の型が T | undefined", () => {
    expectTypeOf(firstDefined([1, 2])).toEqualTypeOf<number | undefined>();
  });
});
