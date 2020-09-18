// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { AccountId, StakingLedger } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { Option } from '@polkadot/types';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';

interface Props {
  accountId: string | null;
  controllerId: string | null;
  defaultController?: string;
  onError: (error: string | null, isFatal: boolean) => void;
}

interface ErrorState {
  error: string | null;
  isFatal: boolean;
}

const transformBonded = {
  transform: (value: Option<AccountId>): string | null =>
    value.isSome
      ? value.unwrap().toString()
      : null
};

const transformStash = {
  transform: (value: Option<StakingLedger>): string | null =>
    value.isSome
      ? value.unwrap().stash.toString()
      : null
};

function ValidateController ({ accountId, controllerId, defaultController, onError }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const bondedId = useCall<string | null>(controllerId ? api.query.staking.bonded : null, [controllerId], transformBonded);
  const stashId = useCall<string | null>(controllerId ? api.query.staking.ledger : null, [controllerId], transformStash);
  const allBalances = useCall<DeriveBalancesAll>(controllerId ? api.derive.balances.all : null, [controllerId]);
  const [{ error, isFatal }, setError] = useState<ErrorState>({ error: null, isFatal: false });

  useEffect((): void => {
    // don't show an error if the selected controller is the default
    // this applies when changing controller
    if (defaultController !== controllerId) {
      let newError: string | null = null;
      let isFatal = false;

      if (bondedId && (controllerId !== accountId)) {
        isFatal = true;
        newError = t('A controller account should not map to another stash. This selected controller is a stash, controlled by {{bondedId}}', { replace: { bondedId } });
      } else if (stashId) {
        isFatal = true;
        newError = t('A controller account should not be set to manage multiple stashes. The selected controller is already controlling {{stashId}}', { replace: { stashId } });
      } else if (allBalances?.freeBalance.isZero()) {
        isFatal = true;
        newError = t('The controller does no have sufficient funds available to cover transaction fees. Ensure that a funded controller is used.');
      } else if (controllerId === accountId) {
        newError = t('Distinct stash and controller accounts are recommended to ensure fund security. You will be allowed to make the transaction, but take care to not tie up all funds, only use a portion of the available funds during this period.');
      }

      onError(newError, isFatal);
      setError((state) => state.error !== newError ? { error: newError, isFatal } : state);
    }
  }, [accountId, allBalances, bondedId, controllerId, defaultController, onError, stashId, t]);

  if (!error || !accountId) {
    return null;
  }

  return (
    <article className={isFatal ? 'error' : 'warning'}>
      <div>{error}</div>
    </article>
  );
}

export default React.memo(ValidateController);
