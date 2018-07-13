// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '../types';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';

import isUndefined from '@polkadot/util/is/undefined';

import translate from '../translate';

type Props = I18nProps & {
  text?: string
};

class ButtonOr extends React.PureComponent<Props> {
  render () {
    const { className, style, t, text } = this.props;

    return (
      <SUIButton.Or
        className={className}
        style={style}
        text={
          isUndefined(text)
            ? t('button.or', {
              defaultValue: 'or'
            })
            : text
        }
      />
    );
  }
}

export default translate(ButtonOr);
