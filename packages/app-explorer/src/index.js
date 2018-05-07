// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';

import './index.css';

import React from 'react';
import BestNumber from '@polkadot/ui-react-rx/BestNumber';

import BestHash from './BestHash';
import BlockHeaders from './BlockHeaders';
import translate from './translate';

type Props = I18nProps & {};

function App ({ className, style, t }: Props): React$Node {
  return (
    <div
      className={['explorer--App', className].join(' ')}
      style={style}
    >
      <BestNumber
        className='explorer--BestNumber'
        label={t('app.bestNumber', {
          defaultValue: 'best #'
        })}
      />
      <BestHash />
      <BlockHeaders />
    </div>
  );
}

export default translate(App);
