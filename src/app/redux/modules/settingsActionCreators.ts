import {createAsyncActions} from "./baseModule";
import {ITranslations, Language} from "./settingsModule";

// tslint:disable-next-line:export-name
export const setLanguage = createAsyncActions(
  "SETTINGS/SET_LANGUAGE",
  "SETTINGS/SET_LANGUAGE_PENDING",
  "SETTINGS/SET_LANGUAGE_FULFILLED",
  "SETTINGS/SET_LANGUAGE_REJECTED"
)<Language, null, ITranslations, null>();
