import { describe, expect, test } from "vitest";
import { isFirstIssue, isFirstPullRequest } from "../src/evaluate.js";

describe("isFirstIssue", () => {
  test("returns true when no previous issues exist", () => {
    expect(isFirstIssue([], 10)).toBe(true);
  });

  test("returns true when only issues with higher numbers exist", () => {
    expect(isFirstIssue([{ number: 11 }, { number: 12 }], 10)).toBe(true);
  });

  test("returns false when a previous issue exists", () => {
    expect(isFirstIssue([{ number: 5 }], 10)).toBe(false);
  });

  test("excludes pull requests from the issues list", () => {
    expect(isFirstIssue([{ number: 5, pull_request: {} }], 10)).toBe(true);
  });

  test("returns true when all previous entries are pull requests", () => {
    expect(
      isFirstIssue(
        [
          { number: 1, pull_request: {} },
          { number: 3, pull_request: {} },
        ],
        10,
      ),
    ).toBe(true);
  });

  test("returns false when mix of issues and pull requests includes a previous issue", () => {
    expect(isFirstIssue([{ number: 1, pull_request: {} }, { number: 5 }], 10)).toBe(false);
  });
});

describe("isFirstPullRequest", () => {
  test("returns true when no previous pull requests exist", () => {
    expect(isFirstPullRequest([], 10)).toBe(true);
  });

  test("returns false when a previous pull request exists", () => {
    expect(isFirstPullRequest([{ number: 5 }], 10)).toBe(false);
  });

  test("returns true when only pull requests with higher numbers exist", () => {
    expect(isFirstPullRequest([{ number: 11 }], 10)).toBe(true);
  });

  test("returns false when mix includes a previous pull request", () => {
    expect(isFirstPullRequest([{ number: 1 }, { number: 11 }], 10)).toBe(false);
  });
});
