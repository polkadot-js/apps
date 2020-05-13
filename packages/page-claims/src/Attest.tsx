// Copyright 2017-2020 @polkadot/app-claims authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { Button, Card, TxButton } from '@polkadot/react-components';

import { useTranslation } from './translate';
import { addrToChecksum } from './util';

interface Props {
  accountId: string;
  className?: string;
}

function Attest({ accountId, className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <Card>
      <div className={className}>
        {t('By signing this transaction, you agree with attestation available at the following address: XXX')}
        <h3>{addrToChecksum(accountId)}</h3>
        <Button.Group>
          <TxButton
            accountId={accountId}
            icon='send'
            isPrimary
            label={t('Attest')}
            params={['Default']} // Replace with actual
            tx='claims.attest'
          />
        </Button.Group>
      </div>
    </Card>
  );
}

// FIXME Same styles as ./Claim.tsx
export default React.memo(styled(Attest)`
  font-size: 1.15rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 12rem;
  align-items: center;
  margin: 0 1rem;

  h3 {
    font-family: monospace;
    font-size: 1.5rem;
    max-width: 100%;
    margin: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  h2 {
    margin: 0.5rem 0 2rem;
    font-family: monospace;
    font-size: 2.5rem;
    font-weight: 200;
  }
`);
