import type { Result } from "../02-discriminated-union/starter";

export type Account = {
  id: string;
  email?: string;
  servePerms: Record<string, boolean>;
  draftSections: string[];
};

export type AccountErrorCode = "NOT_OBJECT" | "BAD_ID" | "BAD_EMAIL" | "BAD_PERMS" | "BAD_SECTIONS";

export function parseAccount(input: unknown): Result<Account> {
  throw new Error("未実装");
}

export function parseAccounts(input: unknown): Account[] {
  throw new Error("未実装");
}
