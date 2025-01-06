// Copyright 2017-2025 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { TxCallback } from '@polkadot/react-components/Status/types';
import type { Option } from '@polkadot/types';
import type { BalanceOf, EthereumAddress, EthereumSignature, StatementKind } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useEffect, useState } from 'react';

import { Button, Card, styled, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from './translate.js';
import { addrToChecksum, getStatement } from './util.js';

interface Props {
  accountId: string;
  className?: string;
  ethereumAddress?: EthereumAddress | string | null;
  ethereumSignature?: EthereumSignature | string | null;
  // Do we sign with `claims.claimAttest` (new) instead of `claims.claim` (old)?
  isOldClaimProcess: boolean;
  onSuccess?: TxCallback;
  statementKind?: StatementKind | null;
}

interface ConstructTx {
  params?: unknown[];
  tx?: (...args: unknown[]) => SubmittableExtrinsic<'promise'>;
}

// Depending on isOldClaimProcess, construct the correct tx.
// FIXME We actually want to return the constructed extrinsic here (probably in useMemo)
function constructTx (api: ApiPromise, systemChain: string, accountId: string, ethereumSignature: EthereumSignature | string | undefined | null, kind: StatementKind | undefined | null, isOldClaimProcess: boolean): ConstructTx {
  if (!ethereumSignature) {
    return {};
  }

  return isOldClaimProcess || !kind
    ? { params: [accountId, ethereumSignature], tx: api.tx.claims.claim }
    : { params: [accountId, ethereumSignature, getStatement(systemChain, kind)?.sentence], tx: api.tx.claims.claimAttest };
}

function Claim ({ accountId, className = '', ethereumAddress, ethereumSignature, isOldClaimProcess, onSuccess, statementKind }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api, systemChain } = useApi();
  const [claimValue, setClaimValue] = useState<BN | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  useEffect((): void => {
    if (!ethereumAddress) {
      return;
    }

    setIsBusy(true);

    api.query.claims
      .claims<Option<BalanceOf>>(ethereumAddress)
      .then((claim): void => {
        setClaimValue(claim.unwrapOr(BN_ZERO));
        setIsBusy(false);
      })
      .catch((error): void => {
        console.error(error);

        setIsBusy(false);
      });
  }, [api, ethereumAddress]);

  if (!ethereumAddress || isBusy || !claimValue) {
    return null;
  }

  const hasClaim = claimValue.gt(BN_ZERO);

  return (
    <Card
      isError={!hasClaim}
      isSuccess={hasClaim}
    >
      <StyledDiv className={className}>
        {t('Your Ethereum account')}
        <h2>{addrToChecksum(ethereumAddress.toString())}</h2>
        {hasClaim
          ? (
            <>
              {t('has a valid claim for')}
              <h2><FormatBalance value={claimValue} /></h2>
              <Button.Group>
                <TxButton
                  icon='paper-plane'
                  isUnsigned
                  label={t('Claim')}
                  onSuccess={onSuccess}
                  {...constructTx(api, systemChain, accountId, ethereumSignature, statementKind, isOldClaimProcess)}
                />
              </Button.Group>
            </>
          )
          : (
            <>
              {t('does not appear to have a valid claim. Please double check that you have signed the transaction correctly on the correct ETH account.')}
            </>
          )}
      </StyledDiv>
    </Card>
  );
}

export const ClaimStyles = `
font-size: var(--font-size-h3);
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
  font-weight: var(--font-weight-normal);
}
`;

const StyledDiv = styled.div`${ClaimStyles}`;

export default React.memo(Claim);
