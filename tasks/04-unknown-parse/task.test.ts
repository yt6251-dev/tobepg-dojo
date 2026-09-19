import { describe, it, expect } from "vitest";
import { parseAccount, parseAccounts } from "./starter";

const good = { id: "motomachi", email: "a@b.c", servePerms: { bokuyouView: true }, draftSections: ["s1"] };

describe("parseAccount", () => {
  it("正しい形は通る", () => {
    expect(parseAccount(good)).toEqual({ ok: true, data: good });
  });
  it("draftSections が無ければ []", () => {
    const { draftSections, ...rest } = good;
    const r = parseAccount(rest);
    expect(r.ok && r.data.draftSections).toEqual([]);
  });
  it.each([
    [null, "NOT_OBJECT"],
    ["x", "NOT_OBJECT"],
    [{ ...good, id: "" }, "BAD_ID"],
    [{ ...good, id: 1 }, "BAD_ID"],
    [{ ...good, email: "nope" }, "BAD_EMAIL"],
    [{ ...good, servePerms: { a: "false" } }, "BAD_PERMS"],
    [{ ...good, servePerms: null }, "BAD_PERMS"],
    [{ ...good, draftSections: "s1" }, "BAD_SECTIONS"],
    [{ ...good, draftSections: [1] }, "BAD_SECTIONS"],
  ])("不正 %j → %s", (input, code) => {
    const r = parseAccount(input);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe(code);
  });
});

describe("parseAccounts", () => {
  it("配列でもオブジェクトでも受ける", () => {
    expect(parseAccounts([good, { id: "" }])).toHaveLength(1);
    expect(parseAccounts({ a: good, b: 3 })).toHaveLength(1);
  });
  it("それ以外は空", () => {
    expect(parseAccounts(null)).toEqual([]);
    expect(parseAccounts("x")).toEqual([]);
  });
});
