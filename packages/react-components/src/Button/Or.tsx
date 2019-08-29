// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '../types';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import { isUndefined } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  text?: string;
}

function ButtonOr ({ className, style, t, text }: Props): React.ReactElement<Props> {
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

export default translate(ButtonOr);
