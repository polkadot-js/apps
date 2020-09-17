// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { AmountValidateState } from '../Accounts/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  amount?: BN | null;
  delegatingAccount: string | null;
  onError: (state: AmountValidateState | null) => void;
}

function ValidateAmount ({ amount, delegatingAccount, onError }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const delegatingAccountBalance = useCall<DeriveBalancesAll>(api.derive.balances.all, [delegatingAccount]);
  const [{ error, warning }, setResult] = useState<AmountValidateState>({ error: null, warning: null });

  useEffect((): void => {
    if (delegatingAccountBalance?.freeBalance && amount?.gt(BN_ZERO)) {
      let newError: string | null = null;

      if (amount.gte(delegatingAccountBalance.freeBalance)) {
        newError = t('The maximum amount you can delegate is the amount of funds available on the delegating account.');
      }

      setResult((state): AmountValidateState => {
        const error = state.error !== newError ? newError : state.error;
        const warning = state.warning;

        onError((error || warning) ? { error, warning } : null);

        return { error, warning };
      });
    }
  }, [api, onError, amount, t, delegatingAccountBalance]);

  if (error || warning) {
    return (
      <article className={error ? 'error' : 'warning'}>
        <div>{error || warning}</div>
      </article>
    );
  }

  return null;
}

export default React.memo(ValidateAmount);
