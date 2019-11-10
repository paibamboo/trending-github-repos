import autobind from "autobind-decorator";
import * as React from "react";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {createSelector} from "reselect";
import {GithubReposInfiniteTable, IGithubReposInfiniteTableTranslation} from "../components/GithubReposInfiniteTable";
import {Translator} from "../models/Translator";
import {ITranslator} from "../models/TranslatorInterfaces";
import {IStore} from "../redux/IStore";
import {
  ISearchGithubReposParams,
  searchGithubRepos as searchGithubReposActionCreator
} from "../redux/modules/githubReposActionCreators";
import {IGithubReposState} from "../redux/modules/githubReposModule";
import {translationsSelector} from "../selectors/translationsSelector";

export const INITIAL_PER_PAGE = 30;
export const SUBSEQUENT_PER_PAGE = 10;
export const FIRST_PAGE = 1;
export const SECOND_PAGE = 4;

export interface IHomePageTranslation extends IGithubReposInfiniteTableTranslation {
  emptyText: string;
}

interface IStateProps extends IGithubReposState {
  translation: IHomePageTranslation;
}

interface IDispatchProps {
  searchGithubRepos: (params: ISearchGithubReposParams) => void;
}

type Props = IStateProps & IDispatchProps;

class HomePage extends React.Component<Props> {
  private readonly thirtyDaysAgo: string;

  constructor(props: Props) {
    super(props);
    const date = new Date();
    date.setDate(date.getDate() - 30);
    this.thirtyDaysAgo = date.toISOString().split("T")[0];
    if (!props.loaded) {
      this.handleLoadMore(FIRST_PAGE, INITIAL_PER_PAGE);
    }
  }

  public render(): JSX.Element {
    const {githubRepos, hasMore, pending, translation} = this.props;
    return (
      <GithubReposInfiniteTable
        dataSource={githubRepos}
        hasMore={hasMore}
        loading={pending}
        locale={translation}
        onLoadMore={this.handleLoadMore}
        rowKey={"id"}
        translation={translation}
      />
    );
  }

  @autobind
  private handleLoadMore(page?: number, perPage?: number): void {
    const {page: pageProps, searchGithubRepos} = this.props;
    searchGithubRepos({
      order: "desc",
      page: typeof page !== "undefined"
        ? page
        : (pageProps === FIRST_PAGE ? SECOND_PAGE : pageProps + 1),
      perPage: typeof perPage !== "undefined"
        ? perPage
        : SUBSEQUENT_PER_PAGE,
      q: `created:>=${this.thirtyDaysAgo}`,
      sort: "stars"
    });
  }
}

const componentTranslationsSelector = createSelector(
  translationsSelector,
  (translations) => {
    const translator: ITranslator = new Translator(translations);
    return {
      description: translator.translate("Description"),
      emptyText: translator.translate("No data"),
      forksCount: translator.translate("Forks count"),
      id: translator.translate("Id"),
      language: translator.translate("Language"),
      name: translator.translate("Name"),
      stargazersCount: translator.translate("Stars count")
    };
  }
);

function mapStateToProps(state: Pick<IStore, "githubRepos" | "settings">): IStateProps {
  return {
    ...state.githubRepos,
    translation: componentTranslationsSelector(state)
  };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
  return {
    searchGithubRepos: (params) => dispatch(searchGithubReposActionCreator.invoke(params))
  };
}

const connected = connect(mapStateToProps, mapDispatchToProps)(HomePage);
export {connected as HomePage, HomePage as UnconnectedHomePage, mapStateToProps, mapDispatchToProps};
