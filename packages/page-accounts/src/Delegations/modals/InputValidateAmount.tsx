// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { AmountValidateState } from '../types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Icon } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';

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
    if (delegatingAccountBalance && amount) {
      let newError: string;

      if (amount.gte(delegatingAccountBalance.freeBalance)) {
        newError = t('You cannot delegate more funds thans those available on the delegating account.');
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
        <div><Icon icon='exclamation-triangle' />{error || warning}</div>
      </article>
    );
  }

  return null;
}

export default React.memo(ValidateAmount);
