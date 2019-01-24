// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '../types';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import { isUndefined } from '@polkadot/util';

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
        label={
          isUndefined(text)
            ? t('or')
            : text
        }
      />
    );
  }
}

export default translate(ButtonOr);
