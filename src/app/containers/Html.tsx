import autobind from "autobind-decorator";
import * as React from "react";
import {Helmet} from "react-helmet";
import serialize from "serialize-javascript";
import {getStyles} from "typestyle";
import {IStore} from "../redux/IStore";

interface IHtmlProps {
  initialState?: Partial<IStore>;
  manifest?: {[key: string]: string};
  markup?: string;
}

export class Html extends React.Component<IHtmlProps> {
  public render(): JSX.Element {
    const head = Helmet.renderStatic();
    const {markup, initialState} = this.props;

    // styles from typestyle
    const renderStyles = <style id="styles-target">{getStyles()}</style>;

    // styles from css files
    const links = this.getFileNames(".css").map(
      (href, i) => <link href={href} key={i} rel="stylesheet" type="text/css"/>
    );

    // scripts
    const scripts = this.getFileNames(".js").map((src, i) => <script key={i} src={src}/>);

    const initialStateScript = (
      <script
        charSet="UTF-8"
        dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__=${serialize(initialState, {isJSON: true})};`}}
      />
    );

    return (
      <html>
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}
          {renderStyles}
          {links}
          <link href="/favicon.ico" rel="shortcut icon"/>
        </head>
        <body>
          {/* tslint:disable-next-line:react-no-dangerous-html */}
          <main dangerouslySetInnerHTML={{__html: markup}} id="app"/>
          {initialStateScript}
          {scripts}
        </body>
      </html>
    );
  }

  @autobind
  private getFileNames(endsWith: string): string[] {
    const {manifest} = this.props;
    const scriptFileNames: string[] = [];
    Object.keys(manifest).forEach((key: string) => {
      if (manifest[key].endsWith(endsWith)) {
        scriptFileNames.push(manifest[key]);
      }
    });
    return scriptFileNames;
  }
}
