import {ActionType, getType} from "typesafe-actions";
import {IGithubRepo} from "../../models/GithubRepoInterfaces";
import {IBaseState} from "./baseModule";
import * as githubReposActionCreators from "./githubReposActionCreators";

export interface IGithubReposState extends Omit<IBaseState, "loaded"> {
  githubRepos: IGithubRepo[];
  hasMore: boolean;
  page: number;
  perPage: number;
}

const initialState: IGithubReposState = {
  error: "",
  githubRepos: [],
  hasMore: true,
  page: 0,
  pending: false,
  perPage: 30
};

export function githubReposReducer(
  state: IGithubReposState = initialState,
  action: ActionType<typeof githubReposActionCreators>
): IGithubReposState {
  switch (action.type) {
    case getType(githubReposActionCreators.searchGithubRepos.setPending):
      return {
        ...state,
        pending: true
      };
    case getType(githubReposActionCreators.searchGithubRepos.setFulfilled):
      return {
        ...state,
        githubRepos: action.payload.githubRepos,
        page: action.payload.page,
        pending: false,
        perPage: action.payload.perPage
      };
    case getType(githubReposActionCreators.searchGithubRepos.setRejected):
      return {
        ...state,
        error: action.message,
        pending: false
      };
    default:
      return state;
  }
}
