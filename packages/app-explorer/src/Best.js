// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Header } from '@polkadot/primitives/header';
import type { I18nProps } from '@polkadot/ui-react-app/types';

import React from 'react';
import headerHash from '@polkadot/primitives-codec/header/hash';
import BestNumber from '@polkadot/rx-react/BestNumber';
import withApiCall from '@polkadot/rx-react/with/apiCall';
import u8aToHexShort from '@polkadot/util/u8a/toHexShort';

import translate from './translate';

type Props = I18nProps & {
  value?: Header
};

function Best ({ className, style, value, t }: Props): React$Node {
  return (
    <div
      className={className}
      style={style}
    >
      <BestNumber
        className='number'
        label={t('app.bestNumber', {
          defaultValue: 'best #'
        })}
      />
      {!value
        ? null
        : (
          <div
            className='hash'
            style={style}
          >
            {u8aToHexShort(headerHash(value))}
          </div>
        )
      }
    </div>
  );
}

export default translate(
  withApiCall({
    method: 'newHead',
    section: 'chain'
  })(Best)
);
