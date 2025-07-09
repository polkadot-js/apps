// Copyright 2017-2025 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { AddressMini, Card, styled } from '@polkadot/react-components';

import { useTranslation } from './translate.js';
import usePolkadotPreclaims from './usePolkadotPreclaims.js';

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
      <StyledDiv className={className}>
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
      </StyledDiv>
    </Card>
  );
}

const StyledDiv = styled.div`
  font-size: var(--font-size-h3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 8rem;
  align-items: center;
  margin: 0 1rem;

  .ui--AddressMini-address {
    max-width: 20rem;
  }
`;

export default React.memo(Warning);
