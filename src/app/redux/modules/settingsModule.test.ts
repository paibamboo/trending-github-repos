import {setLanguage} from "./settingsActionCreators";
import {ISettingsState, settingsReducer} from "./settingsModule";

describe("settingsModule", () => {
  describe("reducer", () => {
    it("returns initial state when state and action type are undefined", () => {
      const initialState: ISettingsState = {
        error: "",
        language: "en",
        loaded: false,
        pending: false,
        translation: {}
      };
      expect(settingsReducer(undefined, {type: undefined})).toEqual(initialState);
    });

    it("handles invoke action", () => {
      const state: ISettingsState = {
        error: "",
        language: "en",
        loaded: false,
        pending: false,
        translation: {}
      };
      expect(settingsReducer(state, setLanguage.invoke("th"))).toEqual({
        error: "",
        language: "th",
        loaded: false,
        pending: false,
        translation: {}
      });
    });

    it("handles pending action", () => {
      const state: ISettingsState = {
        error: "",
        language: "en",
        loaded: false,
        pending: false,
        translation: {}
      };
      expect(settingsReducer(state, setLanguage.setPending(null))).toEqual({
        error: "",
        language: "en",
        loaded: false,
        pending: true,
        translation: {}
      });
    });

    it("handles fulfilled action", () => {
      const state: ISettingsState = {
        error: "",
        language: "th",
        loaded: false,
        pending: true,
        translation: {}
      };
      expect(settingsReducer(state, setLanguage.setFulfilled({Hello: "Hallo"}))).toEqual({
        error: "",
        language: "th",
        loaded: true,
        pending: false,
        translation: {Hello: "Hallo"}
      });
    });

    it("handles rejected action", () => {
      const state: ISettingsState = {
        error: "",
        language: "th",
        loaded: false,
        pending: true,
        translation: {}
      };
      expect(settingsReducer(state, setLanguage.setRejected(null, "Error"))).toEqual({
        error: "Error",
        language: "th",
        loaded: true,
        pending: false,
        translation: {}
      });
    });

    it("handles actions with unknown type", () => {
      const state: ISettingsState = {
        error: "",
        language: "en",
        loaded: false,
        pending: false,
        translation: {Hello: "Hallo"}
      };
      expect(settingsReducer(state, {type: "unknown"} as any)).toBe(state);
    });
  });
});
