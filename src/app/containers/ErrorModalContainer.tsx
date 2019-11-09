import {CommonCss} from "@crazyfactory/frontend-commons";
import {Button, Icon, Modal} from "antd";
import * as React from "react";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {createSelector} from "reselect";
import {classes} from "typestyle";
import {FontSize} from "../constants";
import {Color} from "../constants/Color";
import {Translator} from "../models/Translator";
import {ITranslator} from "../models/TranslatorInterfaces";
import {IStore} from "../redux/IStore";
import {closeErrorModal as closeErrorModalActionCreator} from "../redux/modules/userInterfacesActionCreators";
import {translationsSelector} from "../selectors/translationsSelector";

interface IStateProps {
  isErrorModalOpen: boolean;
  translation: {
    error: string;
    ok: string;
  };
}

interface IDispatchProps {
  closeErrorModal: () => void;
}

class ErrorModalContainer extends React.Component<IStateProps & IDispatchProps> {
  public render(): JSX.Element {
    const {closeErrorModal, isErrorModalOpen, translation} = this.props;
    return (
      <Modal
        footer={null}
        onCancel={closeErrorModal}
        visible={isErrorModalOpen}
      >
        <Icon
          style={{color: Color.RED, fontSize: FontSize.LARGE, verticalAlign: "middle"}}
          type="close-circle"
        />
        <span className={classes(CommonCss.moveRight2, CommonCss.verticalMiddle)}>
          {translation.error}
        </span>
        <div className={classes(CommonCss.pullDown2, CommonCss.textAlignRight)}>
          <Button onClick={closeErrorModal}>
            {translation.ok}
          </Button>
        </div>
      </Modal>
    );
  }
}

const errorMessageSelector = (state: Pick<IStore, "userInterfaces">) => state.userInterfaces.errorModalMessage;

const componentTranslationsSelector = createSelector(
  translationsSelector,
  errorMessageSelector,
  (translations, errorMessage) => {
    const translator: ITranslator = new Translator(translations);
    return {
      // tslint:disable-next-line:language
      error: translator.translate(errorMessage),
      ok: translator.translate("Ok")
    };
  }
);

function mapStateToProps(state: Pick<IStore, "settings" | "userInterfaces">): IStateProps {
  return {
    isErrorModalOpen: state.userInterfaces.isErrorModalOpen,
    translation: componentTranslationsSelector(state)
  };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
  return {
    closeErrorModal: () => dispatch(closeErrorModalActionCreator())
  };
}

const connected = connect(mapStateToProps, mapDispatchToProps)(ErrorModalContainer);
export {
  connected as ErrorModalContainer,
  ErrorModalContainer as UnconnectedErrorModalContainer,
  mapStateToProps,
  mapDispatchToProps
};
