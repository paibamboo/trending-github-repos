// tslint:disable:export-name jsx-no-lambda jsx-no-multiline-js react-this-binding-issue

import * as React from "react";
import {withInitialState} from "../helpers/withInitialState";
import {IGithubRepo} from "../models/GithubRepoInterfaces";
import {GithubReposInfiniteTable} from "./GithubReposInfiniteTable";

export default {
  component: GithubReposInfiniteTable,
  title: "GithubReposInfiniteTable"
};

export const Simple = ({setState, state, mockedTranslation}) => (
  <GithubReposInfiniteTable
    dataSource={state.items}
    hasMore={state.hasMore}
    loading={state.loading}
    onLoadMore={() => {
      setState({loading: true});
      if (state.count > 4) {
        setState({loading: false, hasMore: false});
      } else {
        const newItems = Array.from<any, IGithubRepo>({length: 30}, (_, i) => {
          const seq = i + (30 * state.count);
          return {
            description: `Description ${seq}`,
            forksCount: seq,
            id: seq,
            language: ["Scala", "Python", "R"][Math.floor(Math.random() * 3)],
            name: `Name ${seq}`,
            stargazersCount: seq
          };
        });
        setTimeout(
          () => {
            setState({
              count: state.count + 1,
              items: [...state.items, ...newItems],
              loading: false
            });
          },
          1000
        );
      }
    }}
    rowKey={"id"}
    translation={mockedTranslation}
  />
);

Simple.story = {
  decorators: [withInitialState({
    count: 1,
    hasMore: true,
    items: Array.from<any, IGithubRepo>(
      {length: 30},
      (_, i) => ({
        description: `Description ${i}`,
        forksCount: i,
        id: i,
        language: ["Scala", "Python", "R"][Math.floor(Math.random() * 3)],
        name: `Name ${i}`,
        stargazersCount: i
      })
    ),
    loading: false
  })]
};
