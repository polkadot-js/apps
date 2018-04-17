// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '@polkadot/portal/types';

import './Body.css';

import React from 'react';
// import { Observable } from 'rxjs/Observable';
// import { from as fromObservable } from 'rxjs/observable/from';
import Input from 'semantic-ui-react/dist/es/elements/Input';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import Balance from '@polkadot/rx-react/Balance';
import BlockNumber from '@polkadot/rx-react/BlockNumber';
import ContextProvider from '@polkadot/rx-react/ContextProvider';
import withObservableParams from '@polkadot/rx-react/with/observableParams';

import InputAddress from '../InputAddress';
import addrRecipient from '../subject/addrRecipient';
import addrSender from '../subject/addrSender';

type Props = BaseProps & {};

function publicMap (pair: KeyringPair): Uint8Array {
  return pair.publicKey();
}

const RecipientBalance = withObservableParams(Balance, addrRecipient, publicMap);
const SenderBalance = withObservableParams(Balance, addrSender, publicMap);

export default function Body ({ className, style }: Props) {
  return (
    <ContextProvider>
      <div
        className={['testing--Body', className].join(' ')}
        style={style}
      >
        <BlockNumber
          className='testing--Body-BlockNumber'
          label='best block #'
        />

        <div>
          <Label>using the selected account</Label>
          <InputAddress
            placeholder='0x...'
            subject={addrSender}
          />
        </div>

        <div>
          <Label>with an available balance of</Label>
          <SenderBalance className='ui disabled dropdown selection' />
        </div>

        <div>
          <Label>send an amount of</Label>
          <Input />
        </div>

        <div>
          <Label>to the recipient</Label>
          <InputAddress
            placeholder='0x...'
            subject={addrRecipient}
          />
        </div>

        <div>
          <Label>with an available balance of</Label>
          <RecipientBalance className='ui disabled dropdown selection' />
        </div>
      </div>
    </ContextProvider>
  );
}
