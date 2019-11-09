import {ActionType, getType} from "typesafe-actions";
import {IBaseState} from "./baseModule";
import * as settingsActionCreators from "./settingsActionCreators";

export type Language = "en" | "th";

export interface ITranslations {
  [key: string]: string;
}

export interface ISettingsState extends IBaseState {
  language: Language;
  translation: ITranslations;
}

const initialState: ISettingsState = {
  error: "",
  language: "en",
  loaded: false,
  pending: false,
  translation: {}
};

export function settingsReducer(
  state: ISettingsState = initialState,
  action: ActionType<typeof settingsActionCreators>
): ISettingsState {
  switch (action.type) {
    case getType(settingsActionCreators.setLanguage.invoke):
      return {
        ...state,
        language: action.payload
      };
    case getType(settingsActionCreators.setLanguage.setPending):
      return {
        ...state,
        pending: true
      };
    case getType(settingsActionCreators.setLanguage.setFulfilled):
      return {
        ...state,
        error: "",
        loaded: true,
        pending: false,
        translation: action.payload
      };
    case getType(settingsActionCreators.setLanguage.setRejected):
      return {
        ...state,
        error: action.message,
        loaded: true,
        pending: false
      };
    default:
      return state;
  }
}
