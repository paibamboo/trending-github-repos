// tslint:disable:export-name jsx-no-lambda jsx-no-multiline-js react-this-binding-issue

import {ColumnProps} from "antd/lib/table";
import * as React from "react";
import {withInitialState} from "../helpers/withInitialState";
import {InfiniteTable} from "./InfiniteTable";

export default {
  component: InfiniteTable,
  title: "InfiniteTable"
};

const columns: ColumnProps<any>[] = ["A", "B", "C", "D", "E"].map((v) => ({dataIndex: `column${v}`, title: v}));

export const Simple = ({setState, state}) => (
  <InfiniteTable
    columns={columns}
    dataSource={state.items}
    hasMore={state.hasMore}
    loading={state.loading}
    onLoadMore={() => {
      setState({loading: true});
      if (state.count > 4) {
        setState({loading: false, hasMore: false});
      } else {
        const newItems = Array.from({length: 30}, (_, i) => {
          const seq = i + (30 * state.count);
          return {columnA: `a${seq}`, columnB: `b${seq}`, columnC: `c${seq}`, columnD: `d${seq}`, columnE: `e${seq}`};
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
  >
    {state.items.map((item) => <div key={item}>{item}</div>)}
    {state.loading && <div>Loading...</div>}
  </InfiniteTable>
);

Simple.story = {
  decorators: [withInitialState({
    count: 1,
    hasMore: true,
    items: Array.from(
      {length: 30},
      (_, i) => ({columnA: `a${i}`, columnB: `b${i}`, columnC: `c${i}`, columnD: `d${i}`, columnE: `e${i}`})
    ),
    loading: false
  })]
};
