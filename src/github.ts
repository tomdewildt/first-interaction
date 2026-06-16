import { getOctokit } from "@actions/github";
import type { GitHubClient } from "./client.js";

export function createGitHubClient(
  octokit: ReturnType<typeof getOctokit>,
  owner: string,
  repo: string,
): GitHubClient {
  return {
    async listIssues(creator) {
      return octokit.paginate(octokit.rest.issues.listForRepo, {
        owner,
        repo,
        creator,
        state: "all",
        per_page: 100,
      });
    },

    async listPullRequests(creator) {
      const { data } = await octokit.rest.search.issuesAndPullRequests({
        q: `type:pr repo:${owner}/${repo} author:${creator}`,
        per_page: 100,
      });
      return data.items;
    },

    async listComments(number) {
      return octokit.paginate(octokit.rest.issues.listComments, {
        owner,
        repo,
        issue_number: number,
        per_page: 100,
      });
    },

    async createComment(number, body) {
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: number,
        body,
      });
    },
  };
}
