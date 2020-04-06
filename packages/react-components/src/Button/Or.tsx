// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import { isUndefined } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  style?: any;
  text?: string;
}

function ButtonOr ({ className, style, text }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SUIButton.Or
      className={className}
      label={
        isUndefined(text)
          ? t('or')
          : text
      }
      style={style}
    />
  );
}

export default React.memo(ButtonOr);
