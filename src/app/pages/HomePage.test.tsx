import {shallow} from "enzyme";
import * as React from "react";
import {GithubReposInfiniteTable} from "../components/GithubReposInfiniteTable";
import {IGithubRepo} from "../models/GithubRepoInterfaces";
import {IStore} from "../redux/IStore";
import {ISearchGithubReposParams} from "../redux/modules/githubReposActionCreators";
import {IGithubReposState} from "../redux/modules/githubReposModule";
import {IHomePageTranslation, mapDispatchToProps, mapStateToProps, UnconnectedHomePage} from "./HomePage";
describe("<HomePage />", () => {
  const rawTranslation = {
    "Description": "Description",
    "Forks count": "Forks count",
    "Id": "Id",
    "Language": "Language",
    "Name": "Name",
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
      type: "GITHUB_REPOS/SEARCH_GITHUB_REPOS"
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

  it("calls searchGithubRepos on load more", () => {
    const searchGithubRepos = jest.fn();
    const wrapper = shallow(
      <UnconnectedHomePage
        error={""}
        githubRepos={githubRepos}
        hasMore={false}
        loaded={true}
        page={5}
        pending={false}
        perPage={5}
        searchGithubRepos={searchGithubRepos}
        translation={translation}
      />
    );
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const thirtyDaysAgo = date.toISOString().split("T")[0];
    expect(searchGithubRepos).not.toHaveBeenCalled();
    wrapper.find(GithubReposInfiniteTable).simulate("loadMore");
    expect(searchGithubRepos).toHaveBeenCalledWith({
      order: "desc",
      page: 5,
      perPage: 5,
      q: `created:>=${thirtyDaysAgo}`,
      sort: "stars"
    });
  });

  it("calls searchGithubRepos once rendered when loaded is false", () => {
    const shouldBeCalled = jest.fn();
    shallow(
      <UnconnectedHomePage
        error={""}
        githubRepos={githubRepos}
        hasMore={false}
        loaded={false}
        page={5}
        pending={false}
        perPage={5}
        searchGithubRepos={shouldBeCalled}
        translation={translation}
      />
    );
    expect(shouldBeCalled).toHaveBeenCalled();
  });
});
