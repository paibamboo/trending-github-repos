import {ActionType, getType} from "typesafe-actions";
import {IGithubRepo} from "../../models/GithubRepoInterfaces";
import {IBaseState} from "./baseModule";
import * as githubReposActionCreators from "./githubReposActionCreators";

export interface IGithubReposState extends IBaseState {
  githubRepos: IGithubRepo[];
  hasMore: boolean;
  page: number;
  perPage: number;
}

const initialState: IGithubReposState = {
  error: "",
  githubRepos: [],
  hasMore: true,
  loaded: false,
  page: 0,
  pending: false,
  perPage: 0
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
        hasMore: action.payload.hasMore,
        loaded: true,
        page: action.payload.page,
        pending: false,
        perPage: action.payload.perPage
      };
    case getType(githubReposActionCreators.searchGithubRepos.setRejected):
      return {
        ...state,
        error: action.message,
        hasMore: false,
        loaded: true,
        pending: false
      };
    default:
      return state;
  }
}
