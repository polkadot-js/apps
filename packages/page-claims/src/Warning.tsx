// Copyright 2017-2020 @polkadot/app-claims authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '@polkadot/types';
import { EthereumAddress } from '@polkadot/types/interfaces';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { Card } from '@polkadot/react-components';

import React from 'react';
import styled from 'styled-components';

import { useTranslation } from './translate';

export interface Props{
  className?: string;
}

function Warning ({ className }: Props): React.ReactElement<Props> | null {
  const { allAccounts } = useAccounts();
  const { api, isApiReady } = useApi();
  const { t } = useTranslation();

  // Find accounts that need attest. They are accounts that
  // - already preclaimed,
  // - didn't sign the attest yet.
  // `claims.preclaims` returns Some() for these accounts.
  const preclaimsArray = useCall<[Option<EthereumAddress>]>(isApiReady && api.query.claims?.preclaims?.multi, [allAccounts]);
  const needAttestArray: string [] = [];

  const _ = preclaimsArray?.forEach((opt, index) => {
    if (opt.isSome) {
      needAttestArray.push(allAccounts[index]);
    }
  });

  if (!needAttestArray || !needAttestArray.length) {
    return null;
  }

  return (
    <Card isError>
      <div className={className}>
        {
          t(
            'You need to sign an attestation for the following account(s): {{needAttestArray}}',
            { replace: { needAttestArray } }
          )
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
