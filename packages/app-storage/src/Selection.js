// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import InputStorage from '@polkadot/ui-react-app/src/InputStorage';

import translate from './translate';

type Props = I18nProps & {};

function Selection ({ className, style, t }: Props): React$Node {
  return (
    <div
      className={['storage--Selection', 'ui--form', className].join(' ')}
      style={style}
    >
      <div className='full'>
        <Label>{t('selection.label', {
          defaultValue: 'storage area for query'
        })}</Label>
        <InputStorage />
      </div>
    </div>
  );
}

export default translate(Selection);
