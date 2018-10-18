// Copyright 2017-2018 @polkadot/ui-react authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';
import { encodeAddress } from '@polkadot/keyring';
import { randomAsU8a } from '@polkadot/util-crypto';

import Container from '../Container/Demo';
import IdentityIcon from './index';

export default class Demo extends React.PureComponent {
  render () {
    const identities: Array<string> = [];

    while (identities.length !== 10) {
      identities.push(
        encodeAddress(randomAsU8a(32))
      );
    }

    return (
      <Container
        component='IdentityIcon'
        attrs={{
          size: '<number>',
          value: '{...}'
        }}
        attrsReq={[
          'value'
        ]}
      >
        {
          identities.map((value) => (
            <IdentityIcon
              key={value.toString()}
              value={value}
            />
          ))
        }
      </Container>
    );
  }

}
