import { describe, it, expect, expectTypeOf } from "vitest";
import { ok, fail, unwrap, mapResult, describeError, type Result } from "./starter";

describe("Result", () => {
  it("ok / fail が形を作る", () => {
    expect(ok(1)).toEqual({ ok: true, data: 1 });
    expect(fail("NOT_SIGNED_IN", "sign in first")).toEqual({ ok: false, error: { code: "NOT_SIGNED_IN", message: "sign in first" } });
  });
  it("unwrap は成功なら中身 失敗なら例外", () => {
    expect(unwrap(ok("a"))).toBe("a");
    expect(() => unwrap(fail("X", "boom"))).toThrow("boom");
  });
  it("mapResult は成功だけ変換する", () => {
    expect(mapResult(ok(2), (n) => n * 10)).toEqual({ ok: true, data: 20 });
    const f = fail("E", "m");
    expect(mapResult(f, (n: number) => n * 10)).toBe(f);
    expectTypeOf(mapResult(ok(1), String)).toEqualTypeOf<Result<string>>();
  });
  it("describeError", () => {
    expect(describeError(ok(null))).toBe("ok");
    expect(describeError(fail("E1", "bad"))).toBe("E1: bad");
  });
  it("失敗側で data に触ると型エラー", () => {
    const r: Result<number> = fail("E", "m");
    if (!r.ok) {
      // @ts-expect-error data は成功側にしか無い
      r.data;
      expect(r.error.code).toBe("E");
    }
  });
});
