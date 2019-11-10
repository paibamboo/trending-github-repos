import {ColumnProps} from "antd/lib/table";
import {shallow} from "enzyme";
import * as React from "react";
import {IGithubRepo} from "../models/GithubRepoInterfaces";
import {GithubReposInfiniteTable, IGithubReposInfiniteTableTranslation} from "./GithubReposInfiniteTable";
import {InfiniteTable} from "./InfiniteTable";

describe("<GithubReposInfiniteTable/>", () => {
  const translation: IGithubReposInfiniteTableTranslation = {
    description: "description",
    forksCount: "forksCount",
    id: "id",
    language: "language",
    name: "name",
    stargazersCount: "stargazersCount"
  };

  it("passes translation to column.title", () => {
    const wrapper = shallow(
      <GithubReposInfiniteTable
        hasMore={true}
        onLoadMore={jest.fn()}
        translation={translation}
      />
    );
    const translationValues = Object.entries(translation).map((t) => t[1]);
    const columns: ColumnProps<IGithubRepo>[] = wrapper.find(InfiniteTable).prop("columns");
    const titles = columns.map((column) => column.title);
    titles.forEach((title) => {
      if (translationValues.indexOf(title.toString()) === -1) {
        fail(`The column title: ${title} is not in translation prop`);
      }
    });
  });
});
