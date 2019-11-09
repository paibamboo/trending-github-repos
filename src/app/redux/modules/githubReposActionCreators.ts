import {IGithubRepo} from "../../models/GithubRepoInterfaces";
import {createAsyncActions} from "./baseModule";

export interface ISearchGithubReposPayload {
  order: string;
  page: number;
  perPage: number;
  q: string;
  sort: string;
}

export interface ISearchGithubReposFulfilled {
  githubRepos: IGithubRepo[];
  page: number;
  perPage: number;
}

// tslint:disable-next-line:export-name
export const searchGithubRepos = createAsyncActions(
  "GITHUB_REPOS/SEARCH_GITHUB_REPOS",
  "GITHUB_REPOS/SEARCH_GITHUB_REPOS_PENDING",
  "GITHUB_REPOS/SEARCH_GITHUB_REPOS_FULFILLED",
  "GITHUB_REPOS/SEARCH_GITHUB_REPOS_REJECTED"
)<ISearchGithubReposPayload, null, ISearchGithubReposFulfilled, null>();
