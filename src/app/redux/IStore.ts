import {RouterState} from "redux-router5";
import {IGithubReposState} from "./modules/githubReposModule";
import {ISettingsState} from "./modules/settingsModule";

export interface IStore {
  githubRepos: IGithubReposState;
  router: RouterState;
  settings: ISettingsState;
}
