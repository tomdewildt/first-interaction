export function isFirstIssue(
  issues: ReadonlyArray<{ number: number; pull_request?: unknown }>,
  currentNumber: number,
): boolean {
  return (
    issues
      .filter((issue) => issue.pull_request === undefined)
      .filter((issue) => issue.number < currentNumber).length === 0
  );
}

export function isFirstPullRequest(
  pullRequests: ReadonlyArray<{ number: number; user: { login: string } | null }>,
  login: string,
  currentNumber: number,
): boolean {
  return (
    pullRequests.filter((pr) => pr.user?.login === login).filter((pr) => pr.number < currentNumber)
      .length === 0
  );
}
