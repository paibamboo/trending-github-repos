import {runSaga} from "redux-saga";
import * as ReduxSagaEffects from "redux-saga/effects";
import {getType} from "typesafe-actions";
import {searchGithubRepos} from "../redux/modules/githubReposActionCreators";
import {GithubReposSaga} from "./GithubReposSaga";

describe("GithubReposSaga", () => {
  describe("fetchGithubRepos", () => {
    it("gets githubRepos, increments page by 1, and sets hasMore to true", () => {
      expect.assertions(1);
      const dispatched = [];
      const originalItems = Array.from({length: 10}, (_, i) => (
        {description: "d", forksCount: i, id: i, language: "Python", name: "n", stargazersCount: i}
      ));
      const newItems = Array.from({length: 10}, (_, i) => (
        {description: "d", forksCount: i + 10, id: i + 10, language: "Python", name: "n", stargazersCount: i + 10}
      ));
      const octokitMock = {
        search: {
          repos: () => new Promise((resolve) => resolve({data: {items: newItems}}))
        }
      };
      return runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({githubRepos: originalItems})
        },
        (new GithubReposSaga(octokitMock as any)).fetchGithubRepos,
        {
          payload: {order: "desc", page: 0, perPage: 10, q: "created:>2019-01-01", sort: "stars"},
          type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS"
        }
      ).toPromise().then(() => {
        expect(dispatched).toEqual([
          {payload: null, type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS_PENDING"},
          {
            payload: {
              githubRepos: [...originalItems, ...newItems],
              hasMore: true,
              page: 1
            },
            type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS_FULFILLED"
          }
        ]);
      });
    });

    it("gets githubRepos, increments page by 1, and sets hasMore to false", () => {
      expect.assertions(1);
      const dispatched = [];
      const originalItems = Array.from({length: 10}, (_, i) => (
        {description: "d", forksCount: i, id: i, language: "Python", name: "n", stargazersCount: i}
      ));
      const newItems = Array.from({length: 9}, (_, i) => (
        {description: "d", forksCount: i + 10, id: i + 10, language: "Python", name: "n", stargazersCount: i + 10}
      ));
      const octokitMock = {
        search: {
          repos: () => new Promise((resolve) => resolve({data: {items: newItems}}))
        }
      };
      return runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({githubRepos: originalItems})
        },
        (new GithubReposSaga(octokitMock as any)).fetchGithubRepos,
        {
          payload: {order: "desc", page: 0, perPage: 10, q: "created:>2019-01-01", sort: "stars"},
          type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS"
        }
      ).toPromise().then(() => {
        expect(dispatched).toEqual([
          {payload: null, type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS_PENDING"},
          {
            payload: {
              githubRepos: [...originalItems, ...newItems],
              hasMore: false,
              page: 1
            },
            type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS_FULFILLED"
          }
        ]);
      });
    });

    it("gets rejected and sets rejected", () => {
      expect.assertions(1);
      const dispatched = [];
      const octokitMock = {
        search: {
          repos: () => new Promise((_, rejected) => rejected(new Error("Error!")))
        }
      };
      return runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({githubRepos: []})
        },
        (new GithubReposSaga(octokitMock as any)).fetchGithubRepos,
        {
          payload: {order: "desc", page: 0, perPage: 10, q: "created:>2019-01-01", sort: "stars"},
          type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS"
        }
      ).toPromise().then(() => {
        expect(dispatched).toEqual([
          {payload: null, type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS_PENDING"},
          {message: "Error!", payload: null, type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS_REJECTED"}
        ]);
      });
    });
  });

  describe("registerListeners", () => {
    it("listens for searchGithubRepos INVOKED and calls fetchGithubRepos", () => {
      const spied = jest.spyOn(ReduxSagaEffects, "fork");
      const githubReposSaga = new GithubReposSaga(null);
      githubReposSaga.watch();
      const gen = (spied.mock.calls[0][0] as any)();
      expect(
        gen.next().value
      ).toEqual(ReduxSagaEffects.takeLatest(getType(searchGithubRepos.invoke), githubReposSaga.fetchGithubRepos));
    });
  });
});
