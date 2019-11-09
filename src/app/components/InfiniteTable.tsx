import {InfiniteScroll} from "@crazyfactory/react-general-components";
import {
  IProps as InfiniteScrollProps
} from "@crazyfactory/react-general-components/lib/components/window/InfiniteScroll";
import {Table} from "antd";
import {TableProps} from "antd/lib/table";
import * as React from "react";

export type InfiniteTableProps<T> = Omit<TableProps<T>, "pagination"> & Omit<InfiniteScrollProps, "isLoading">;

export class InfiniteTable<T> extends React.Component<InfiniteTableProps<T>> {
  public render(): JSX.Element {
    const {debounce, hasMore, loading, onLoadMore, threshold, ...rest} = this.props;
    return (
      <InfiniteScroll
        debounce={debounce}
        hasMore={hasMore}
        isLoading={typeof loading === "boolean" ? loading : loading.spinning}
        onLoadMore={onLoadMore}
        threshold={threshold}
      >
        <Table loading={loading} pagination={false} {...rest}/>
      </InfiniteScroll>
    );
  }
}
