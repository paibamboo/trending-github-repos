import {IGithubRepo} from "../../models/GithubRepoInterfaces";
import {createAsyncActions} from "./baseModule";

export interface ISearchGithubReposPayload {
  order: "desc" | "asc";
  page: number;
  perPage: number;
  q: string;
  sort: "stars" | "forks" | "help-wanted-issues" | "updated";
}

export interface ISearchGithubReposFulfilled {
  githubRepos: IGithubRepo[];
  hasMore: boolean;
  page: number;
}

// tslint:disable-next-line:export-name
export const searchGithubRepos = createAsyncActions(
  "GITHUB_REPOS/SEARCH_GITHUB_REPOS",
  "GITHUB_REPOS/SEARCH_GITHUB_REPOS_PENDING",
  "GITHUB_REPOS/SEARCH_GITHUB_REPOS_FULFILLED",
  "GITHUB_REPOS/SEARCH_GITHUB_REPOS_REJECTED"
)<ISearchGithubReposPayload, null, ISearchGithubReposFulfilled, null>();
