// Copyright 2017-2020 @polkadot/app-claims authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Card, TxButton } from '@polkadot/react-components';
import { TxCallback } from '@polkadot/react-components/Status/types';
import { useAccounts, useApi } from '@polkadot/react-hooks';
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
  onSuccess?: TxCallback;
  statementKind?: StatementKind;
  systemChain: string;
}

function Attest ({ accountId, className, ethereumAddress, onSuccess, statementKind, systemChain }: Props): React.ReactElement<Props> | null {
  const accounts = useAccounts();
  const { t } = useTranslation();
  const { api } = useApi();
  const [claimValue, setClaimValue] = useState<BalanceOf | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  useEffect((): void => {
    if (!ethereumAddress) {
      return;
    }

    setIsBusy(true);

    api.query.claims
      .claims<Option<BalanceOf>>(ethereumAddress)
      .then((claim): void => {
        setClaimValue(claim.unwrapOr(null));
        setIsBusy(false);
      })
      .catch((): void => setIsBusy(false));
  }, [api, ethereumAddress]);

  if (isBusy) {
    return null;
  }

  const hasClaim = claimValue && claimValue.gten(0);
  const statementSentence = getStatement(systemChain, statementKind)?.sentence;

  if (!hasClaim || !statementSentence) {
    return null;
  }

  // Attesting is impossible if the account is not owned.
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
        <h3><FormatBalance label={t<string>('Account balance:')}
          value={claimValue} /></h3>
        <Button.Group>
          <TxButton
            accountId={accountId}
            icon='paper-plane'
            isDisabled={!statementSentence}
            label={t<string>('I agree')}
            onSuccess={onSuccess}
            params={[statementSentence]}
            tx='claims.attest'
          />
        </Button.Group>
      </div>
    </Card>
  );
}

export default React.memo(styled(Attest)`${ClaimStyles}`);
