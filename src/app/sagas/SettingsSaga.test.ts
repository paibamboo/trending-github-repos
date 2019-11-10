jest.mock("./dummyApi");
import {runSaga} from "redux-saga";
import * as ReduxSagaEffects from "redux-saga/effects";
import {getType} from "typesafe-actions";
import {setLanguage} from "../redux/modules/settingsActionCreators";
import {dummyApi} from "./dummyApi";
import {SettingsSaga} from "./SettingsSaga";

describe("SettingsSaga", () => {
  describe("fetchTranslations", () => {
    it("gets translation and sets fulfilled", () => {
      expect.assertions(1);
      const dispatched = [];
      (dummyApi as any).getTranslations.mockResolvedValue({"Translation Key": "Translation Value"});
      return runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        (new SettingsSaga(null)).fetchTranslations,
        {
          payload: "en",
          type: getType(setLanguage.invoke)
        }
      ).toPromise().then(() => {
        expect(dispatched).toEqual([
          {payload: null, type: getType(setLanguage.setPending)},
          {payload: {"Translation Key": "Translation Value"}, type: getType(setLanguage.setFulfilled)}
        ]);
      });
    });

    it("gets rejected and sets rejected", () => {
      expect.assertions(1);
      const dispatched = [];
      (dummyApi as any).getTranslations.mockRejectedValue("Error");
      return runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        (new SettingsSaga(null)).fetchTranslations,
        {
          payload: "en",
          type: getType(setLanguage.invoke)
        }
      ).toPromise().then(() => {
        expect(dispatched).toEqual([
          {payload: null, type: getType(setLanguage.setPending)},
          {message: "Error", payload: null, type: getType(setLanguage.setRejected)}
        ]);
      });
    });
  });

  describe("registerListeners", () => {
    it("listens for setLanguage INVOKED and calls fetchTranslations", () => {
      const spied = jest.spyOn(ReduxSagaEffects, "fork");
      const settingsSaga = new SettingsSaga(null);
      settingsSaga.watch();
      const gen = (spied.mock.calls[0][0] as any)();
      expect(
        gen.next().value
      ).toEqual(ReduxSagaEffects.takeLatest(getType(setLanguage.invoke), settingsSaga.fetchTranslations));
    });
  });
});
