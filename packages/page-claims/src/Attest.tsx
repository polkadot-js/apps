// Copyright 2017-2022 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TxCallback } from '@polkadot/react-components/Status/types';
import type { Option } from '@polkadot/types';
import type { BalanceOf, EthereumAddress, StatementKind } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Button, Card, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { ClaimStyles } from './Claim';
import Statement from './Statement';
import { useTranslation } from './translate';
import { getStatement } from './util';

interface Props {
  accountId: string;
  className?: string;
  ethereumAddress: EthereumAddress | null;
  onSuccess?: TxCallback;
  statementKind?: StatementKind;
  systemChain: string;
}

function Attest ({ accountId, className, ethereumAddress, onSuccess, statementKind, systemChain }: Props): React.ReactElement<Props> | null {
  const accounts = useAccounts();
  const { t } = useTranslation();
  const { api } = useApi();
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

  const statementSentence = useMemo(
    () => getStatement(systemChain, statementKind)?.sentence,
    [systemChain, statementKind]
  );

  if (isBusy || !claimValue) {
    return null;
  }

  const noClaim = claimValue.isZero();

  if (noClaim || !statementSentence) {
    return (
      <Card isError>
        <div className={className}>
          {noClaim && (
            <p>{t<string>('There is no on-chain claimable balance associated with the Ethereum account {{ethereumAddress}}', {
              replace: { ethereumAddress }
            })}</p>
          )}
          {!statementSentence && (
            <p>{t<string>('There is no on-chain attestation statement associated with the Ethereum account {{ethereumAddress}}', {
              replace: { ethereumAddress }
            })}</p>
          )}
        </div>
      </Card>
    );
  }

  if (!accounts.isAccount(accountId)) {
    return (
      <Card isError>
        <div className={className}>
          {t<string>('We found a pre-claim with this Polkadot address. However, attesting requires signing with this account. To continue with attesting, please add this account as an owned account first.')}
          <h3>
            <FormatBalance
              label={t<string>('Account balance:')}
              value={claimValue}
            />
          </h3>
        </div>
      </Card>
    );
  }

  return (
    <Card isSuccess>
      <div className={className}>
        <Statement
          kind={statementKind}
          systemChain={systemChain}
        />
        <h3>
          <FormatBalance
            label={t<string>('Account balance:')}
            value={claimValue}
          />
        </h3>
        <Button.Group>
          <TxButton
            accountId={accountId}
            icon='paper-plane'
            isDisabled={!statementSentence}
            label={t<string>('I agree')}
            onSuccess={onSuccess}
            params={[statementSentence]}
            tx={api.tx.claims.attest}
          />
        </Button.Group>
      </div>
    </Card>
  );
}

export default React.memo(styled(Attest)`${ClaimStyles}`);
