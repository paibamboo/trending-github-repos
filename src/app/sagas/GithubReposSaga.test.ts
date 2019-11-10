jest.mock("./dummyApi");
import {runSaga} from "redux-saga";
import * as ReduxSagaEffects from "redux-saga/effects";
import {getType} from "typesafe-actions";
import {searchGithubRepos} from "../redux/modules/githubReposActionCreators";
import {dummyApi} from "./dummyApi";
import {GithubReposSaga} from "./GithubReposSaga";

describe("GithubReposSaga", () => {
  beforeEach(() => {
    global.process.env.BROWSER = "true";
  });

  describe("fetchGithubRepos", () => {
    it("gets and concats githubRepos, and sets hasMore to true", () => {
      expect.assertions(1);
      const dispatched = [];
      const originalItems = Array.from({length: 2}, (_, i) => (
        {description: "d", forksCount: i, id: i, language: "Python", name: "n", stargazersCount: i}
      ));
      const newItems = Array.from({length: 2}, (_, i) => (
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
          getState: () => ({githubRepos: {githubRepos: originalItems}})
        },
        (new GithubReposSaga(octokitMock as any)).fetchGithubRepos,
        {
          payload: {order: "desc", page: 2, perPage: 2, q: "created:>2019-01-01", sort: "stars"},
          type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS"
        }
      ).toPromise().then(() => {
        expect(dispatched).toEqual([
          {payload: null, type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS_PENDING"},
          {
            payload: {
              githubRepos: [...originalItems, ...newItems],
              hasMore: true,
              page: 2,
              perPage: 2
            },
            type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS_FULFILLED"
          }
        ]);
      });
    });

    it("gets and concats githubRepos, and sets hasMore to false", () => {
      expect.assertions(1);
      const dispatched = [];
      const originalItems = Array.from({length: 2}, (_, i) => (
        {description: "d", forksCount: i, id: i, language: "Python", name: "n", stargazersCount: i}
      ));
      const newItems = Array.from({length: 1}, (_, i) => (
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
          getState: () => ({githubRepos: {githubRepos: originalItems}})
        },
        (new GithubReposSaga(octokitMock as any)).fetchGithubRepos,
        {
          payload: {order: "desc", page: 2, perPage: 2, q: "created:>2019-01-01", sort: "stars"},
          type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS"
        }
      ).toPromise().then(() => {
        expect(dispatched).toEqual([
          {payload: null, type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS_PENDING"},
          {
            payload: {
              githubRepos: [...originalItems, ...newItems],
              hasMore: false,
              page: 2,
              perPage: 2
            },
            type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS_FULFILLED"
          }
        ]);
      });
    });

    it("uses isormorphic fetch on server", () => {
      delete global.process.env.BROWSER;
      expect.assertions(1);
      const dispatched = [];
      const originalItems = Array.from({length: 2}, (_, i) => (
        {description: "d", forksCount: i, id: i, language: "Python", name: "n", stargazersCount: i}
      ));
      const newItems = Array.from({length: 1}, (_, i) => (
        {description: "d", forksCount: i + 10, id: i + 10, language: "Python", name: "n", stargazersCount: i + 10}
      ));
      (dummyApi as any).searchGithubRepos.mockResolvedValue({data: {items: newItems}});
      return runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({githubRepos: {githubRepos: originalItems}})
        },
        (new GithubReposSaga(null)).fetchGithubRepos,
        {
          payload: {order: "desc", page: 2, perPage: 2, q: "created:>2019-01-01", sort: "stars"},
          type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS"
        }
      ).toPromise().then(() => {
        expect(dispatched).toEqual([
          {payload: null, type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS_PENDING"},
          {
            payload: {
              githubRepos: [...originalItems, ...newItems],
              hasMore: false,
              page: 2,
              perPage: 2
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
          repos: () => new Promise((_, reject) => reject({message: "Not authorized", status: 400}))
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
          {
            message: "Not authorized",
            payload: {openErrorModal: true},
            type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS_REJECTED"
          }
        ]);
      });
    });

    it("throw if error contains no status code", () => {
      expect.assertions(1);
      const dispatched = [];
      const octokitMock = {
        search: {
          repos: () => new Promise((_, reject) => reject({message: "Some javascript error"}))
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
      ).toPromise().catch((err) => expect(err).toEqual({message: "Some javascript error"}));
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
