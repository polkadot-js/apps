// Copyright 2017-2025 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Preimage } from '@polkadot/react-hooks/types';

import React, { useMemo } from 'react';

import { TxButton } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  value: Preimage;
}

function Free ({ className, value: { count, deposit, proposalHash, status } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const isAvailable = useMemo(
    () => count === 0 && status && status.isUnrequested && deposit && allAccounts.includes(deposit.who),
    [allAccounts, count, deposit, status]
  );

  if (!isAvailable || !deposit) {
    return null;
  }

  return (
    <TxButton
      accountId={deposit.who}
      className={className}
      icon='minus'
      label={t('Unnote')}
      params={[proposalHash]}
      tx={api.tx.preimage.unnotePreimage}
    />
  );
}

export default React.memo(Free);
