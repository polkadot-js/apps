// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '../types';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/es/elements/Button';

import translate from '../translate';

type Props = I18nProps & {
  text?: string
};

function ButtonOr ({ className, style, t, text }: Props): React$Node {
  // flowlint-next-line sketchy-null-string:off
  const _text = text || t('button.or', {
    defaultValue: 'or'
  });

  return (
    <SUIButton.Or text={_text} />
  );
}

export default translate(ButtonOr);
