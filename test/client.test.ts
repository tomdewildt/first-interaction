import { beforeEach, describe, expect, test } from "vitest";
import { postWelcome, type GitHubClient } from "../src/client.js";

class FakeGitHubClient implements GitHubClient {
  createdComments: Array<{ issueNumber: number; body: string }> = [];
  existingComments: Array<{ body?: string | null }> = [];
  issues: Array<{ number: number; pull_request?: unknown }> = [];
  pullRequests: Array<{ number: number }> = [];

  async listIssues(): Promise<ReadonlyArray<{ number: number; pull_request?: unknown }>> {
    return this.issues;
  }

  async listPullRequests(): Promise<ReadonlyArray<{ number: number }>> {
    return this.pullRequests;
  }

  async listComments(): Promise<ReadonlyArray<{ body?: string | null }>> {
    return this.existingComments;
  }

  async createComment(issueNumber: number, body: string): Promise<void> {
    this.createdComments.push({ issueNumber, body });
  }
}

describe("postWelcome", () => {
  let client: FakeGitHubClient;
  const marker = "<!-- first-interaction -->";
  const message = "Welcome to the project!";

  beforeEach(() => {
    client = new FakeGitHubClient();
  });

  test("posts comment with marker prefix", async () => {
    await postWelcome(client, 42, marker, message);

    expect(client.createdComments).toEqual([{ issueNumber: 42, body: `${marker}\n${message}` }]);
  });

  test("skips comment when an existing comment already contains the marker", async () => {
    client.existingComments = [{ body: `${marker}\nold message` }];

    await postWelcome(client, 42, marker, message);

    expect(client.createdComments).toEqual([]);
  });

  test("treats unrelated comments without the marker as not duplicates", async () => {
    client.existingComments = [
      { body: "This comment is unrelated." },
      { body: null },
      { body: undefined },
    ];

    await postWelcome(client, 42, marker, message);

    expect(client.createdComments).toEqual([{ issueNumber: 42, body: `${marker}\n${message}` }]);
  });
});
