export interface GitHubClient {
  listIssues(creator: string): Promise<ReadonlyArray<{ number: number; pull_request?: unknown }>>;
  listPullRequests(): Promise<ReadonlyArray<{ number: number; user: { login: string } | null }>>;
  listComments(issueNumber: number): Promise<ReadonlyArray<{ body?: string | null }>>;
  createComment(issueNumber: number, body: string): Promise<void>;
}

export async function postWelcome(
  client: GitHubClient,
  issueNumber: number,
  marker: string,
  message: string,
): Promise<void> {
  const comments = await client.listComments(issueNumber);
  const alreadyCommented = comments.some((comment) => comment.body?.includes(marker));

  if (!alreadyCommented) {
    await client.createComment(issueNumber, `${marker}\n${message}`);
  }
}
