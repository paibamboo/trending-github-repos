import {searchGithubRepos} from "./githubReposActionCreators";
import {githubReposReducer, IGithubReposState} from "./githubReposModule";

describe("githubReposModule", () => {
  describe("reducer", () => {
    it("returns initial state when state and action type are undefined", () => {
      const initialState: IGithubReposState = {
        error: "",
        githubRepos: [],
        hasMore: true,
        loaded: false,
        page: 0,
        pending: false,
        perPage: 10
      };
      expect(githubReposReducer(undefined, {type: undefined})).toEqual(initialState);
    });

    it("returns same sate once searchGithubRepos is invoked", () => {
      const state: IGithubReposState = {
        error: "",
        githubRepos: [{description: "d", forksCount: 10, language: "Java", name: "n", stargazersCount: 2, id: 3}],
        hasMore: false,
        loaded: true,
        page: 1,
        pending: false,
        perPage: 10
      };
      expect(githubReposReducer(state, searchGithubRepos.invoke(null))).toEqual(state);
    });

    it("returns correct state once searchGithubRepos is pending", () => {
      const state: IGithubReposState = {
        error: "",
        githubRepos: [{description: "d", forksCount: 10, language: "Java", name: "n", stargazersCount: 2, id: 3}],
        hasMore: false,
        loaded: true,
        page: 1,
        pending: false,
        perPage: 10
      };
      expect(githubReposReducer(state, searchGithubRepos.setPending(null))).toEqual({
        ...state,
        pending: true
      });
    });

    it("returns correct state once searchGithubRepos is fulfilled", () => {
      const state: IGithubReposState = {
        error: "",
        githubRepos: [],
        hasMore: true,
        loaded: false,
        page: 0,
        pending: true,
        perPage: 10
      };
      expect(githubReposReducer(state, searchGithubRepos.setFulfilled({
        githubRepos: [{description: "d", forksCount: 10, language: "Java", name: "n", stargazersCount: 2, id: 3}],
        hasMore: false,
        page: 1
      }))).toEqual({
        ...state,
        githubRepos: [{description: "d", forksCount: 10, language: "Java", name: "n", stargazersCount: 2, id: 3}],
        hasMore: false,
        loaded: true,
        page: 1,
        pending: false,
        perPage: 10
      });
    });

    it("returns correct state once searchGithubRepos is rejected", () => {
      const state: IGithubReposState = {
        error: "",
        githubRepos: [{description: "d", forksCount: 10, language: "Java", name: "n", stargazersCount: 2, id: 3}],
        hasMore: false,
        loaded: true,
        page: 1,
        pending: false,
        perPage: 10
      };
      expect(githubReposReducer(state, searchGithubRepos.setRejected(null, "Error!"))).toEqual({
        ...state,
        error: "Error!",
        pending: false
      });
    });

    it("handles actions with unknown type", () => {
      const state: IGithubReposState = {
        error: "",
        githubRepos: [{description: "d", forksCount: 10, language: "Java", name: "n", stargazersCount: 2, id: 3}],
        hasMore: true,
        loaded: true,
        page: 1,
        pending: false,
        perPage: 10
      };
      expect(githubReposReducer(state, {type: "unknown"} as any)).toBe(state);
    });
  });
});
