// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from './types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import Balance from '@polkadot/rx-react/Balance';
import withObservableParams from '@polkadot/rx-react/with/observableParams';

import translate from './translate';
import InputAddress from './InputAddress';

type Props = BaseProps & {
  label: string,
  subject: rxjs$BehaviorSubject<Uint8Array>
};

function Account ({ className, label, subject, style, t }: Props): React$Node {
  const AccountBalance = withObservableParams(subject)(Balance);

  return (
    <div
      className={['extrinsics--Account', 'extrinsics--split', className].join(' ')}
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
        <Label>
          {t('account.balance', {
            defaultValue: 'with an available balance of'
          })}
        </Label>
        <AccountBalance
          className='ui disabled dropdown selection'
          classNameUpdated='hasUpdated'
        />
      </div>
    </div>
  );
}

export default translate(Account);
