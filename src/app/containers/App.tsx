import {CommonCss} from "@crazyfactory/frontend-commons";
import {Spin} from "antd";
import * as React from "react";
import {Helmet} from "react-helmet";
import {connect} from "react-redux";
import {createRouteNodeSelector, RouterState} from "redux-router5";
import {State as IRouteState} from "router5";
import {classes, stylesheet} from "typestyle";
import {config as appConfig} from "../../../config";
import {setupCss} from "../helpers/setupCss";
import {HomePage} from "../pages/HomePage";
import {IStore} from "../redux/IStore";
import {RoutePageMap} from "../routes/routes";
import {ErrorModalContainer} from "./ErrorModalContainer";

setupCss();

const classNames = stylesheet({
  container: {
    margin: 0,
    padding: 0,
    textAlign: "center"
  },
  loadingContainer: {
    paddingTop: 100
  }
});

interface IStateProps {
  loaded: boolean;
  route: IRouteState;
}

class App extends React.Component<IStateProps> {
  private components: RoutePageMap = {
    homePage: HomePage
  };
  public render(): JSX.Element {
    const {loaded, route} = this.props;
    if (!loaded) {
      return (
        <div className={classes(classNames.loadingContainer, CommonCss.textAlignCenter)}>
          <Spin size={"large"}/>
        </div>
      );
    }

    const segment = route ? route.name.split(".")[0] : undefined;
    return (
      <section className={classNames.container}>
        <Helmet {...appConfig.app.head}/>
        {renderComponentByRoute(this.components)}
        <ErrorModalContainer/>
      </section>
    );

    function renderComponentByRoute(components: RoutePageMap): JSX.Element {
      if (segment && components[segment]) {
        return React.createElement(components[segment]);
      }
      return (
        <div>404</div>
      );
    }
  }
}

const mapStateToProps = (state: Pick<IStore, "router" | "settings">): IStateProps & Partial<RouterState> => ({
  ...createRouteNodeSelector("")(state),
  loaded: state.settings.loaded
});

const connected = connect(mapStateToProps)(App);

export {classNames, connected as App, App as UnconnectedApp, mapStateToProps};
