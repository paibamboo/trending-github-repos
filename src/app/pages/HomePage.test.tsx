import {shallow} from "enzyme";
import * as React from "react";
import {getType} from "typesafe-actions";
import {GithubReposInfiniteTable} from "../components/GithubReposInfiniteTable";
import {IGithubRepo} from "../models/GithubRepoInterfaces";
import {IStore} from "../redux/IStore";
import {ISearchGithubReposParams, searchGithubRepos} from "../redux/modules/githubReposActionCreators";
import {IGithubReposState} from "../redux/modules/githubReposModule";
import {
  FIRST_PAGE,
  IHomePageTranslation,
  INITIAL_PER_PAGE,
  mapDispatchToProps,
  mapStateToProps,
  SECOND_PAGE,
  SUBSEQUENT_PER_PAGE,
  UnconnectedHomePage
} from "./HomePage";
describe("<HomePage />", () => {
  const rawTranslation = {
    "Description": "Description",
    "Forks count": "Forks count",
    "Id": "Id",
    "Language": "Language",
    "Name": "Name",
    "No data": "No data",
    "Stars count": "Stars count"
  };
  const translation: IHomePageTranslation = {
    description: "Description",
    emptyText: "No data",
    forksCount: "Forks count",
    id: "Id",
    language: "Language",
    name: "Name",
    stargazersCount: "Stars count"
  };
  const date = new Date();
  date.setDate(date.getDate() - 30);
  const thirtyDaysAgo = date.toISOString().split("T")[0];
  const githubRepos: IGithubRepo[] = [
    {description: "d", forksCount: 5, id: 1, language: "Rust", name: "n", stargazersCount: 10}
  ];

  it("maps state to props correctly", () => {
    const githubReposState: IGithubReposState = {
      error: "",
      githubRepos,
      hasMore: false,
      loaded: true,
      page: 1,
      pending: false,
      perPage: 10
    };
    const state: Pick<IStore, "githubRepos" | "settings"> = {
      githubRepos: githubReposState,
      settings: {
        error: "",
        language: "en",
        loaded: true,
        pending: false,
        translation: rawTranslation
      }
    };
    const props = mapStateToProps(state);
    expect(props).toEqual({
      ...githubReposState,
      translation
    });
  });

  it("maps dispatch to props correctly", () => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);
    const searchGithubReposParams: ISearchGithubReposParams = {
      order: "desc",
      page: 5,
      perPage: 10,
      q: `created:>=${this.thirtyDaysAgo}`,
      sort: "stars"
    };
    expect(dispatch).not.toHaveBeenCalled();
    props.searchGithubRepos(searchGithubReposParams);
    expect(dispatch).toHaveBeenCalledWith({
      payload: searchGithubReposParams,
      type: getType(searchGithubRepos.invoke)
    });
  });

  it("passes props to GithubReposInfiniteTable correcty", () => {
    const wrapper = shallow(
      <UnconnectedHomePage
        error={""}
        githubRepos={githubRepos}
        hasMore={false}
        loaded={true}
        page={1}
        pending={false}
        perPage={10}
        searchGithubRepos={jest.fn()}
        translation={translation}
      />
    );
    expect(wrapper.find(GithubReposInfiniteTable)).toHaveProp("dataSource", githubRepos);
    expect(wrapper.find(GithubReposInfiniteTable)).toHaveProp("hasMore", false);
    expect(wrapper.find(GithubReposInfiniteTable)).toHaveProp("loading", false);
    expect(wrapper.find(GithubReposInfiniteTable)).toHaveProp("translation", translation);
  });

  it("loads github repos with FIRST_PAGE and INITIAL_PER_PAGE params once rendered", () => {
    const searchGithubReposMock = jest.fn();
    shallow(
      <UnconnectedHomePage
        error={""}
        githubRepos={githubRepos}
        hasMore={false}
        loaded={false}
        page={0}
        pending={false}
        perPage={0}
        searchGithubRepos={searchGithubReposMock}
        translation={translation}
      />
    );
    expect(searchGithubReposMock).toHaveBeenCalledWith({
      order: "desc",
      page: FIRST_PAGE,
      perPage: INITIAL_PER_PAGE,
      q: `created:>=${thirtyDaysAgo}`,
      sort: "stars"
    });
  });

  it("loads github repos with SECOND_PAGE and SUBSEQUENT_PER_PAGE params on second render", () => {
    const searchGithubReposMock = jest.fn();
    const wrapper = shallow(
      <UnconnectedHomePage
        error={""}
        githubRepos={githubRepos}
        hasMore={false}
        loaded={true}
        page={FIRST_PAGE}
        pending={false}
        perPage={INITIAL_PER_PAGE}
        searchGithubRepos={searchGithubReposMock}
        translation={translation}
      />
    );
    expect(searchGithubReposMock).not.toHaveBeenCalled();
    wrapper.find(GithubReposInfiniteTable).simulate("loadMore");
    expect(searchGithubReposMock).toHaveBeenCalledWith({
      order: "desc",
      page: SECOND_PAGE,
      perPage: SUBSEQUENT_PER_PAGE,
      q: `created:>=${thirtyDaysAgo}`,
      sort: "stars"
    });
  });

  it("loads github repos with page prop plus 1 and SUBSEQUENT_PER_PAGE params on other renders", () => {
    const searchGithubReposMock = jest.fn();
    const wrapper = shallow(
      <UnconnectedHomePage
        error={""}
        githubRepos={githubRepos}
        hasMore={false}
        loaded={true}
        page={5}
        pending={false}
        perPage={INITIAL_PER_PAGE}
        searchGithubRepos={searchGithubReposMock}
        translation={translation}
      />
    );
    expect(searchGithubReposMock).not.toHaveBeenCalled();
    wrapper.find(GithubReposInfiniteTable).simulate("loadMore");
    expect(searchGithubReposMock).toHaveBeenCalledWith({
      order: "desc",
      page: 6,
      perPage: SUBSEQUENT_PER_PAGE,
      q: `created:>=${thirtyDaysAgo}`,
      sort: "stars"
    });
  });
});
