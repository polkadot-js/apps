// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '../types';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/es/elements/Button';

import isUndefined from '@polkadot/util/is/undefined';

import translate from '../translate';

type Props = I18nProps & {
  text?: string
};

function ButtonOr ({ className, style, t, text }: Props): React$Node {
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

export default translate(ButtonOr);
