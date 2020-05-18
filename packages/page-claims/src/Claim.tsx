// Copyright 2017-2020 @polkadot/app-claims authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '@polkadot/types';
import { BalanceOf, EthereumAddress, StatementKind } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Card, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from './translate';
import { addrToChecksum, getStatement } from './util';

interface Props {
  accountId: string;
  className?: string;
  ethereumAddress: EthereumAddress | null;
  ethereumSignature: string | null;
  // Do we sign with `claims.claimAttest` (new) instead of `claims.claim` (old)?
  isOldClaimProcess: boolean;
  statementKind?: StatementKind;
}

interface ConstructTx {
  params?: any[];
  tx?: string;
}

// Depending on isOldClaimProcess, construct the correct tx.
function constructTx (accountId: string, ethereumSignature: string | null, kind: StatementKind | undefined, isOldClaimProcess: boolean): ConstructTx {
  if (!ethereumSignature || !kind) {
    return {};
  }

  return isOldClaimProcess
    ? { params: [accountId, ethereumSignature], tx: 'claims.claim' }
    : { params: [accountId, ethereumSignature, getStatement(kind)], tx: 'claims.claimAttest' };
}

function Claim ({ accountId, className, ethereumAddress, ethereumSignature, isOldClaimProcess, statementKind }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [claimValue, setClaimValue] = useState<BalanceOf | null>(null);
  const [claimAddress, setClaimAddress] = useState<EthereumAddress | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const _fetchClaim = useCallback(
    (address: EthereumAddress): void => {
      setIsBusy(true);

      api.query.claims
        .claims<Option<BalanceOf>>(address)
        .then((claim): void => {
          setClaimValue(claim.unwrapOr(null));
          setIsBusy(false);
        })
        .catch((): void => setIsBusy(false));
    },
    [api]
  );

  useEffect((): void => {
    setClaimAddress(ethereumAddress);

    ethereumAddress && _fetchClaim(ethereumAddress);
  }, [_fetchClaim, ethereumAddress]);

  if (isBusy || !claimAddress) {
    return null;
  }

  const hasClaim = claimValue && claimValue.gten(0);

  return (
    <Card
      isError={!hasClaim}
      isSuccess={!!hasClaim}
    >
      <div className={className}>
        {t('Your Ethereum account')}
        <h3>{addrToChecksum(claimAddress.toString())}</h3>
        {hasClaim && claimValue
          ? (
            <>
              {t('has a valid claim for')}
              <h2><FormatBalance value={claimValue} /></h2>
              <Button.Group>
                <TxButton
                  accountId={accountId}
                  icon='send'
                  isPrimary
                  isUnsigned
                  label={t('Claim')}
                  {...constructTx(accountId, ethereumSignature, statementKind, isOldClaimProcess)}
                />
              </Button.Group>
            </>
          )
          : (
            <>
              {t('does not appear to have a valid claim. Please double check that you have signed the transaction correctly on the correct ETH account.')}
            </>
          )}
      </div>
    </Card>
  );
}

export default React.memo(styled(Claim)`
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
