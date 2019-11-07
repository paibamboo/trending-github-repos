import {ComponentClass} from "react";
import {Action} from "redux";
import {actions} from "redux-router5";

interface IRoute {
  name: RoutablePages;
  path: string;
}
type RoutablePages = "homePage";

type RouteConfig = Record<RoutablePages, Omit<IRoute, "name">>;
export type RoutePageMap = Record<RoutablePages, ComponentClass>;
type RouteNavigate = Record<RoutablePages, (...params: any[]) => Action>;

function getRoutes(routeConfig: RouteConfig): Record<RoutablePages, IRoute> {
  return Object.keys(routeConfig)
    .map((key) => ({
      name: key,
      path: routeConfig[key].path
    }))
    .reduce(
      (a, c) => {
        a[c.name] = c;
        return a;
      },
      {} as any
    );
}

function getNavigateAction<T extends {[key: string]: any}>(routeName: RoutablePages, params?: T): Action {
  return actions.navigateTo(routeName, params);
}

const config: RouteConfig = {
  homePage: {path: "/"}
};

export const routes = getRoutes(config);

export const navigate: RouteNavigate = {
  homePage: () => getNavigateAction(routes.homePage.name)
};
