// Copyright 2017-2020 @polkadot/app-claims authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressMini, Card } from '@polkadot/react-components';

import React from 'react';
import styled from 'styled-components';

import { useTranslation } from './translate';
import usePolkadotPreclaims from './usePolkadotPreclaims';

export interface Props{
  className?: string;
}

function Warning ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const needsAttest = usePolkadotPreclaims();

  if (!needsAttest.length) {
    return null;
  }

  return (
    <Card isError>
      <div className={className}>
        {
          needsAttest.length > 1
            ? t('You need to sign an attestation for the following accounts:')
            : t('You need to sign an attestation for the following account:')
        }{
          needsAttest.map((address) => (
            <AddressMini
              key={address}
              value={address}
            />
          ))
        }
      </div>
    </Card>
  );
}

export default React.memo(styled(Warning)`
  font-size: 1.15rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 8rem;
  align-items: center;
  margin: 0 1rem;

  .ui--AddressMini-address {
    max-width: 20rem;
  }
`);
