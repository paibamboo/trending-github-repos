import {camelizeKeys, snakenKeys} from "@crazyfactory/frontend-commons";
import {Response, SearchReposParams, SearchReposResponse} from "@octokit/rest";
import autobind from "autobind-decorator";
import {call, CallEffect, ForkEffect, put, PutEffect, select, SelectEffect, takeLatest} from "redux-saga/effects";
import {getType} from "typesafe-actions";
import {IGithubRepo} from "../models/GithubRepoInterfaces";
import {IStore} from "../redux/IStore";
import {searchGithubRepos} from "../redux/modules/githubReposActionCreators";
import {BaseSaga} from "./BaseSaga";
import {dummyApi} from "./dummyApi";

export class GithubReposSaga extends BaseSaga {
  @autobind
  public *fetchGithubRepos(
    action: ReturnType<typeof searchGithubRepos.invoke>
  ): IterableIterator<CallEffect | PutEffect<any> | SelectEffect> {
    try {
      yield put(searchGithubRepos.setPending(null));
      const res: Response<SearchReposResponse> = process.env.BROWSER
        ? yield call(
          this.octokit.search.repos,
          snakenKeys({...action.payload, page: action.payload.page}) as SearchReposParams
        )
        : yield call(dummyApi.searchGithubRepos, {...action.payload, page: action.payload.page});
      const currentGithubRepos: IGithubRepo[] = yield select((store: IStore) => store.githubRepos.githubRepos);
      yield put(searchGithubRepos.setFulfilled({
        githubRepos: [...currentGithubRepos, ...(res.data.items.map((item) => camelizeKeys(item)) as IGithubRepo[])],
        hasMore: res.data.items.length === action.payload.perPage,
        page: action.payload.page,
        perPage: action.payload.perPage
      }));
    } catch (e) {
      yield put(
        searchGithubRepos.setRejected(
          {openErrorModal: true}, e.status ? e.message : "Something went wrong."
        )
      );
      // it's javascript error, throw for easy debug
      if (!e.status) {
        throw e;
      }
    }
  }

  protected *registerListeners(): IterableIterator<ForkEffect> {
    yield takeLatest(getType(searchGithubRepos.invoke), this.fetchGithubRepos);
  }
}
