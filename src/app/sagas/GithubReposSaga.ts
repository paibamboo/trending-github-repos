import {camelizeKeys, snakenKeys} from "@crazyfactory/frontend-commons";
import {Response, SearchReposParams, SearchReposResponse} from "@octokit/rest";
import autobind from "autobind-decorator";
import {call, CallEffect, ForkEffect, put, PutEffect, select, SelectEffect, takeLatest} from "redux-saga/effects";
import {getType} from "typesafe-actions";
import {IGithubRepo} from "../models/GithubRepoInterfaces";
import {IStore} from "../redux/IStore";
import {searchGithubRepos} from "../redux/modules/githubReposActionCreators";
import {BaseSaga} from "./BaseSaga";

export class GithubReposSaga extends BaseSaga {
  @autobind
  public *fetchGithubRepos(
    action: ReturnType<typeof searchGithubRepos.invoke>
  ): IterableIterator<CallEffect | PutEffect<any> | SelectEffect> {
    try {
      yield put(searchGithubRepos.setPending(null));
      const res: Response<SearchReposResponse> = yield call(
        this.octokit.search.repos,
        snakenKeys({...action.payload, page: action.payload.page + 1}) as SearchReposParams
      );
      const currentGithubRepos: IGithubRepo[] = yield select((store: IStore) => store.githubRepos);
      yield put(searchGithubRepos.setFulfilled({
        githubRepos: [...currentGithubRepos, ...(res.data.items.map((item) => camelizeKeys(item)) as IGithubRepo[])],
        hasMore: res.data.items.length === action.payload.perPage,
        page: action.payload.page + 1
      }));
    } catch (e) {
      yield put(searchGithubRepos.setRejected(null, e.message));
    }
  }

  protected *registerListeners(): IterableIterator<ForkEffect> {
    yield takeLatest(getType(searchGithubRepos.invoke), this.fetchGithubRepos);
  }
}
