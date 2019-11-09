import {combineReducers, Reducer} from "redux";
import {router5Reducer} from "redux-router5";
import {IStore} from "./IStore";
import {githubReposReducer} from "./modules/githubReposModule";
import {settingsReducer} from "./modules/settingsModule";
import {userInterfacesReducer} from "./modules/userInterfacesModule";

const rootReducer: Reducer<IStore> = combineReducers<IStore>({
  githubRepos: githubReposReducer,
  router: router5Reducer,
  settings: settingsReducer,
  userInterfaces: userInterfacesReducer
});

export default rootReducer;
