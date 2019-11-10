import Octokit from "@octokit/rest";
import {all, AllEffect} from "redux-saga/effects";
import {GithubReposSaga} from "./GithubReposSaga";
import {SettingsSaga} from "./SettingsSaga";

export default function* rootSaga(): IterableIterator<AllEffect<any>> {
  const octokit = new Octokit();
  yield all([
    (new GithubReposSaga(octokit)).watch(),
    (new SettingsSaga(octokit)).watch()
  ]);
}
