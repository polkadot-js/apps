// Copyright 2017-2020 @polkadot/app-claims authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { Button, Card, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { Option } from '@polkadot/types';
import { BalanceOf, EthereumAddress, StatementKind } from '@polkadot/types/interfaces';

import { ClaimStyles } from './Claim';
import Statement from './Statement';
import { useTranslation } from './translate';
import { getStatement } from './util';

interface Props {
  accountId: string;
  className?: string;
  ethereumAddress: EthereumAddress | null;
  statementKind?: StatementKind;
  systemChain: string;
}

function Attest ({ accountId, className, ethereumAddress, statementKind, systemChain }: Props): React.ReactElement<Props> | null {
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
  const statementSentence = getStatement(systemChain, statementKind)?.sentence;

  return (
    <Card isSuccess>
      <div className={className}>
        <Statement
          kind={statementKind}
          systemChain={systemChain}
        />
        {hasClaim &&
          <h3><FormatBalance label={t('Attestation for:')}
            value={claimValue} /></h3>}
        <Button.Group>
          <TxButton
            accountId={accountId}
            icon='send'
            isDisabled={!statementSentence}
            isPrimary
            label={t('Attest')}
            params={[statementSentence]}
            tx='claims.attest'
          />
        </Button.Group>
      </div>
    </Card>
  );
}

// FIXME Same styles as ./Claim.tsx
export default React.memo(styled(Attest)`${ClaimStyles}`);
