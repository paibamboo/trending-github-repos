import {InfiniteScroll} from "@crazyfactory/react-general-components";
import {Table} from "antd";
import {shallow} from "enzyme";
import * as React from "react";
import {InfiniteTable} from "./InfiniteTable";

describe("InfiniteTable", () => {
  it("passes debounce props to InfiniteScroll", () => {
    const wrapper = shallow(
      <InfiniteTable debounce={99} hasMore={true} loading={false} onLoadMore={jest.fn()} threshold={55}/>
    );
    expect(wrapper.find(InfiniteScroll)).toHaveProp("debounce", 99);
  });

  it("passes hasMore props to InfiniteScroll", () => {
    let wrapper = shallow(
      <InfiniteTable debounce={99} hasMore={true} loading={false} onLoadMore={jest.fn()} threshold={55}/>
    );
    expect(wrapper.find(InfiniteScroll)).toHaveProp("hasMore", true);

    wrapper = shallow(
      <InfiniteTable debounce={99} hasMore={false} loading={false} onLoadMore={jest.fn()} threshold={55}/>
    );
    expect(wrapper.find(InfiniteScroll)).toHaveProp("hasMore", false);
  });

  it("passes loading props to InfiniteScroll", () => {
    let wrapper = shallow(
      <InfiniteTable debounce={99} hasMore={true} loading={true} onLoadMore={jest.fn()} threshold={55}/>
    );
    expect(wrapper.find(InfiniteScroll)).toHaveProp("isLoading", true);

    wrapper = shallow(
      <InfiniteTable debounce={99} hasMore={false} loading={false} onLoadMore={jest.fn()} threshold={55}/>
    );
    expect(wrapper.find(InfiniteScroll)).toHaveProp("isLoading", false);
  });

  it("passes loading.spinning props to InfiniteScroll", () => {
    let wrapper = shallow(
      <InfiniteTable debounce={99} hasMore={true} loading={{spinning: true}} onLoadMore={jest.fn()} threshold={55}/>
    );
    expect(wrapper.find(InfiniteScroll)).toHaveProp("isLoading", true);

    wrapper = shallow(
      <InfiniteTable debounce={99} hasMore={false} loading={{spinning: false}} onLoadMore={jest.fn()} threshold={55}/>
    );
    expect(wrapper.find(InfiniteScroll)).toHaveProp("isLoading", false);
  });

  it("passes onLoadMore props to InfiniteScroll", () => {
    const onLoadMore = jest.fn();
    const wrapper = shallow(
      <InfiniteTable debounce={99} hasMore={true} loading={false} onLoadMore={onLoadMore} threshold={55}/>
    );
    expect(wrapper.find(InfiniteScroll)).toHaveProp("onLoadMore", onLoadMore);
  });

  it("passes threshold props to InfiniteScroll", () => {
    const wrapper = shallow(
      <InfiniteTable debounce={99} hasMore={true} loading={false} onLoadMore={jest.fn()} threshold={55}/>
    );
    expect(wrapper.find(InfiniteScroll)).toHaveProp("threshold", 55);
  });

  it("passes loading props to Table", () => {
    let wrapper = shallow(
      <InfiniteTable debounce={99} hasMore={true} loading={true} onLoadMore={jest.fn()} threshold={55}/>
    );
    expect(wrapper.find(Table)).toHaveProp("loading", true);

    wrapper = shallow(
      <InfiniteTable debounce={99} hasMore={true} loading={false} onLoadMore={jest.fn()} threshold={55}/>
    );
    expect(wrapper.find(Table)).toHaveProp("loading", false);
  });

  it("sets pagination to false", () => {
    const wrapper = shallow(
      <InfiniteTable debounce={99} hasMore={true} loading={true} onLoadMore={jest.fn()} threshold={55}/>
    );
    expect(wrapper.find(Table)).toHaveProp("pagination", false);
  });
});
