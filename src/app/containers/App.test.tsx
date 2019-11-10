import {Spin} from "antd";
import {shallow} from "enzyme";
import * as React from "react";
import {State as IRouteState} from "router5";
import {HomePage} from "../pages/HomePage";
import {ISettingsState} from "../redux/modules/settingsModule";
import {routes} from "../routes/routes";
import {classNames, mapStateToProps, UnconnectedApp} from "./App";

describe("<App />", () => {
  const route: IRouteState = {
    meta: {id: 1, params: {}, options: {}, redirected: false},
    name: routes.homePage.name,
    params: {},
    path: "/"
  };
  const routeUnavailable: IRouteState = {
    name: "unavailable",
    params: {},
    path: "/"
  };
  const settings: ISettingsState = {
    error: "",
    language: "en",
    loaded: true,
    pending: false,
    translation: {"Not found": "Not Found"}
  };

  it("maps state to props correctly", () => {
    const props = mapStateToProps({
      router: {route, previousRoute: route, transitionRoute: null, transitionError: null},
      settings
    });
    expect(props.route).toEqual(route);
  });

  it("renders with correct style", () => {
    const wrapper = shallow(<UnconnectedApp loaded={true} route={route}/>);
    expect(wrapper.find("section")).toHaveClassName(classNames.container);
  });

  it("renders HomePage", () => {
    const wrapper = shallow(<UnconnectedApp loaded={true} route={route}/>);
    expect(wrapper.find(HomePage).length).toBe(1);
  });

  it("renders Not Found when route is null", () => {
    const wrapper = shallow(<UnconnectedApp loaded={true} route={null}/>);
    expect(wrapper.find("div")).toHaveText("404");
  });

  it("renders Not Found when segment is undefined", () => {
    const wrapper = shallow(<UnconnectedApp loaded={true} route={routeUnavailable}/>);
    expect(wrapper.find("div")).toHaveText("404");
  });

  it("renders Spin if loaded is false", () => {
    const wrapper = shallow(<UnconnectedApp loaded={false} route={routeUnavailable}/>);
    expect(wrapper.find(Spin)).toHaveLength(1);
  });
});
