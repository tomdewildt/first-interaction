import * as core from "@actions/core";
import * as github from "@actions/github";
import { postWelcome } from "./client.js";
import { isFirstIssue, isFirstPullRequest } from "./evaluate.js";
import { createGitHubClient } from "./github.js";

const MARKER = "<!-- first-interaction -->";

export async function run(): Promise<void> {
  try {
    const token = core.getInput("repo-token", { required: true });
    const issueMessage = core.getInput("issue-message");
    const prMessage = core.getInput("pr-message");

    const { context } = github;
    const item = context.payload.issue ?? context.payload.pull_request;
    if (!item) {
      core.info("No issue or pull request in payload; skipping.");
      return;
    }

    if (context.payload.action !== "opened") {
      core.info("Not an opened event; skipping.");
      return;
    }

    const isPR = !!context.payload.pull_request;
    const issueNumber = item.number as number;
    const login = (item.user?.login as string | undefined) ?? "";

    const message = isPR ? prMessage : issueMessage;
    if (!message) {
      core.info(`No ${isPR ? "pr" : "issue"} message configured; skipping.`);
      return;
    }

    const octokit = github.getOctokit(token);
    const { owner, repo } = context.repo;
    const client = createGitHubClient(octokit, owner, repo);

    if (isPR) {
      const pullRequests = await client.listPullRequests();
      if (!isFirstPullRequest(pullRequests, login, issueNumber)) {
        core.info(`Not @${login}'s first pull request; skipping.`);
        return;
      }
    } else {
      const issues = await client.listIssues(login);
      if (!isFirstIssue(issues, issueNumber)) {
        core.info(`Not @${login}'s first issue; skipping.`);
        return;
      }
    }

    await postWelcome(client, issueNumber, MARKER, message);
    core.info(`Posted welcome on ${isPR ? "PR" : "issue"} #${issueNumber} for @${login}.`);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}
