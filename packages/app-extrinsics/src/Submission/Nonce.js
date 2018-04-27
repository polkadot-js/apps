// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type BN from 'bn.js';
import type { BareProps } from '../types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import RxNonce from '@polkadot/rx-react/Nonce';
import withObservableParams from '@polkadot/rx-react/with/observableParams';

type Props = BareProps & {
  label: string,
  subject: rxjs$BehaviorSubject<BN>,
  value: rxjs$BehaviorSubject<Uint8Array>
};

export default function Nonce ({ className, label, style, subject, t, value }: Props): React$Node {
  const SenderNonce = withObservableParams(value)(RxNonce);

  return (
    <div
      className={['extrinsics--split', className].join(' ')}
      style={style}
    >
      <div className='small'>
        <Label>{label}</Label>
        <SenderNonce
          className='ui disabled dropdown selection'
          classNameUpdated='hasUpdated'
          subject={subject}
        />
      </div>
    </div>
  );
}
