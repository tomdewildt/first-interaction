export interface GitHubClient {
  listIssues(creator: string): Promise<ReadonlyArray<{ number: number; pull_request?: unknown }>>;
  listPullRequests(creator: string): Promise<ReadonlyArray<{ number: number }>>;
  listComments(issueNumber: number): Promise<ReadonlyArray<{ body?: string | null }>>;
  createComment(issueNumber: number, body: string): Promise<void>;
}

export async function postWelcomeMessage(
  client: GitHubClient,
  issueNumber: number,
  message: string,
  marker: string,
): Promise<void> {
  const comments = await client.listComments(issueNumber);
  const alreadyCommented = comments.some((comment) => comment.body?.includes(marker));

  if (!alreadyCommented) {
    await client.createComment(issueNumber, `${marker}\n${message}`);
  }
}
