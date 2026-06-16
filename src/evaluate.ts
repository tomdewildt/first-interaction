export function isFirstIssue(
  issues: ReadonlyArray<{ number: number; pull_request?: unknown }>,
  currentNumber: number,
): boolean {
  // The API results include the current issue, so an empty list alone doesn't indicate a first contribution.
  // Filter by number < currentNumber to exclude it.
  return (
    issues
      .filter((issue) => issue.pull_request === undefined)
      .filter((issue) => issue.number < currentNumber).length === 0
  );
}

export function isFirstPullRequest(
  pullRequests: ReadonlyArray<{ number: number }>,
  currentNumber: number,
): boolean {
  // The API results include the current PR, so an empty list alone doesn't indicate a first contribution.
  // Filter by number < currentNumber to exclude it.
  return pullRequests.filter((pr) => pr.number < currentNumber).length === 0;
}
