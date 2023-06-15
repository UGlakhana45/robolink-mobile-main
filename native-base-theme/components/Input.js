// @flow

import variable from './../variables/platform';
import { I18nManager } from 'react-native'

export default (variables /* : * */ = variable) => {
  const inputTheme = {
    '.multiline': {
      height: null
    },
    height: variables.inputHeightBase,
    color: variables.inputColor,
    paddingLeft: 5,
    paddingRight: I18nManager.isRTL ? 15 : 5,
    flex: 1,
    fontSize: variables.inputFontSize
  };

  return inputTheme;
};
