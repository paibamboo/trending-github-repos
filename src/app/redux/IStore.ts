import {RouterState} from "redux-router5";
import {IGithubReposState} from "./modules/githubReposModule";
import {ISettingsState} from "./modules/settingsModule";
import {IUserInterfacesState} from "./modules/userInterfacesModule";

export interface IStore {
  githubRepos: IGithubReposState;
  router: RouterState;
  settings: ISettingsState;
  userInterfaces: IUserInterfacesState;
}
