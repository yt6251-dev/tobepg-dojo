import type { Result } from "../02-discriminated-union/starter";

export type Account = {
  id: string;
  email?: string;
  permissions: Record<string, boolean>;
  teamIds: string[];
};

export type AccountErrorCode = "NOT_OBJECT" | "BAD_ID" | "BAD_EMAIL" | "BAD_PERMS" | "BAD_TEAMS";

export function parseAccount(input: unknown): Result<Account> {
  throw new Error("未実装");
}

export function parseAccounts(input: unknown): Account[] {
  throw new Error("未実装");
}
