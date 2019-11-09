import {ActionType, getType} from "typesafe-actions";
import * as userInterfacesActionCreator from "./userInterfacesActionCreators";

export interface IUserInterfacesState {
  errorModalMessage: string;
  isErrorModalOpen: boolean;
}

const initialState: IUserInterfacesState = {
  errorModalMessage: "",
  isErrorModalOpen: false
};

export function userInterfacesReducer(
  state: IUserInterfacesState = initialState,
  action: ActionType<typeof userInterfacesActionCreator>
): IUserInterfacesState {
  if (action.type.indexOf("_REJECTED") !== -1 && (action as any).payload && (action as any).payload.openErrorModal) {
    return {
      ...initialState,
      errorModalMessage: (action as any).message,
      isErrorModalOpen: true
    };
  }
  switch (action.type) {
    case getType(userInterfacesActionCreator.closeErrorModal):
      return initialState;
    default:
      return state;
  }
}
