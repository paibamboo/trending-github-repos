import {all, AllEffect} from "redux-saga/effects";
import {SettingsSaga} from "./SettingsSaga";

export default function* rootSaga(): IterableIterator<AllEffect<any>> {
  yield all([
    (new SettingsSaga()).watch()
  ]);
}
