import {Button, Modal} from "antd";
import {shallow} from "enzyme";
import * as React from "react";
import {getType} from "typesafe-actions";
import {IStore} from "../redux/IStore";
import {closeErrorModal} from "../redux/modules/userInterfacesActionCreators";
import {mapDispatchToProps, mapStateToProps, UnconnectedErrorModalContainer} from "./ErrorModalContainer";

describe("<ErrorModalContainer/>", () => {
  it("maps state to props correctly", () => {
    const state: Pick<IStore, "settings" | "userInterfaces"> = {
      settings: {
        error: "",
        language: "en",
        loaded: true,
        pending: false,
        translation: {"Ok": "Oke", "Something is wrong": "Something is weird"}
      },
      userInterfaces: {
        errorModalMessage: "Something is wrong",
        isErrorModalOpen: true
      }
    };
    const props = mapStateToProps(state);
    expect(props).toEqual({
      isErrorModalOpen: true,
      translation: {
        error: "Something is weird",
        ok: "Oke"
      }
    });
  });

  it("maps dispatch to props correctly", () => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);
    expect(dispatch).not.toHaveBeenCalled();
    props.closeErrorModal();
    expect(dispatch).toHaveBeenCalledWith({type: getType(closeErrorModal)});
  });

  it("passes closeErrorModal prop to Modal onCancel", () => {
    const closeErrorModalMock = jest.fn();
    const wrapper = shallow(
      <UnconnectedErrorModalContainer
        closeErrorModal={closeErrorModalMock}
        isErrorModalOpen={false}
        translation={{error: "", ok: "Ok"}}
      />
    );
    expect(wrapper.find(Modal)).toHaveProp("onCancel", closeErrorModalMock);
  });

  it("passes isErrorModalOpen prop to Modal's visible", () => {
    const wrapper = shallow(
      <UnconnectedErrorModalContainer
        closeErrorModal={jest.fn()}
        isErrorModalOpen={true}
        translation={{error: "", ok: "Ok"}}
      />
    );
    expect(wrapper.find(Modal)).toHaveProp("visible", true);
  });

  it("calls closeErrorModal when Ok button is clicked", () => {
    const closeErrorModalMock = jest.fn();
    const wrapper = shallow(
      <UnconnectedErrorModalContainer
        closeErrorModal={closeErrorModalMock}
        isErrorModalOpen={false}
        translation={{error: "", ok: "Ok"}}
      />
    );
    expect(closeErrorModalMock).not.toHaveBeenCalled();
    wrapper.find(Button).simulate("click");
    expect(closeErrorModalMock).toHaveBeenCalled();
  });
});
