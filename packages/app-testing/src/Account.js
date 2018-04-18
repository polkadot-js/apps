// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '@polkadot/portal/types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import Balance from '@polkadot/rx-react/Balance';
import withObservableParams from '@polkadot/rx-react/with/observableParams';

import InputAddress from './InputAddress';

type Props = BaseProps & {
  label: string,
  subject: rxjs$BehaviorSubject
};

export default function Account ({ className, label, subject, style }: Props) {
  const AccountBalance = withObservableParams(Balance, subject, (pair: KeyringPair) => {
    if (!pair) {
      return new Uint8Array([]);
    }

    return pair.publicKey();
  });

  return (
    <div
      className={['testing--Account', 'testing--split', className].join(' ')}
      style={style}
    >
      <div className='large'>
        <Label>{label}</Label>
        <InputAddress
          placeholder='0x...'
          subject={subject}
        />
      </div>
      <div className='small'>
        <Label>with an available balance of</Label>
        <AccountBalance className='ui disabled dropdown selection' />
      </div>
    </div>
  );
}
