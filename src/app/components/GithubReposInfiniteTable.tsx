import {ColumnProps} from "antd/lib/table";
import * as React from "react";
import {IGithubRepo} from "../models/GithubRepoInterfaces";
import {InfiniteTable, InfiniteTableProps} from "./InfiniteTable";

export type IGithubReposInfiniteTableTranslation = Record<keyof IGithubRepo, string>;

export interface IGithubReposInfiniteTableProps extends Omit<InfiniteTableProps<IGithubRepo>, "columns"> {
  translation: IGithubReposInfiniteTableTranslation;
}

export class GithubReposInfiniteTable extends React.Component<IGithubReposInfiniteTableProps> {
  private columns: ColumnProps<IGithubRepo>[] = [
    {
      dataIndex: "name",
      title: this.props.translation.name
    },
    {
      dataIndex: "description",
      title: this.props.translation.description
    },
    {
      dataIndex: "stargazersCount",
      title: this.props.translation.stargazersCount
    },
    {
      dataIndex: "forksCount",
      title: this.props.translation.forksCount
    },
    {
      dataIndex: "language",
      title: this.props.translation.language
    }
  ];

  public render(): JSX.Element {
    return (
      <InfiniteTable
        columns={this.columns}
        {...this.props}
      />
    );
  }
}
