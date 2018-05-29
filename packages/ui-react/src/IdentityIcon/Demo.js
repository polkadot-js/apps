// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import React from 'react';
import randomAsU8a from '@polkadot/util-crypto/random/asU8a';
import addressEncode from '@polkadot/util-keyring/address/encode';

import Container from '../Container/Demo';
import IdentityIcon from './index';

export default function Demo () {
  const identities = [new Uint8Array(32)];

  while (identities.length !== 10) {
    identities.push(
      addressEncode(randomAsU8a(32))
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
