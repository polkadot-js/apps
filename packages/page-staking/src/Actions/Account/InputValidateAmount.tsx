// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { AmountValidateState } from '../types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Icon } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  accountId: string | null;
  currentAmount?: BN | null;
  onError: (state: AmountValidateState | null) => void;
  value?: BN | null;
}

function ValidateAmount ({ accountId, currentAmount, onError, value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances.all, [accountId]);
  const [{ error, warning }, setResult] = useState<AmountValidateState>({ error: null, warning: null });

  useEffect((): void => {
    // don't show an error if the selected controller is the default
    // this applies when changing controller
    if (allBalances && value) {
      let newError: string | null = null;
      let newWarning: string | null = null;
      const check = value.add(currentAmount || BN_ZERO);

      if (check.gte(allBalances.freeBalance)) {
        newError = t<string>('The specified value is greater than your free balance. The node will bond the maximum amount available.');
      } else if (check.gt(allBalances.freeBalance.muln(95).divn(100))) {
        newWarning = t<string>('The specified value is greater than the recommended amount. You may not be adequately protected against slashing events or have funds for future fees.');
      }

      setResult((state): AmountValidateState => {
        const error = state.error !== newError ? newError : state.error;
        const warning = state.warning !== newWarning ? newWarning : state.warning;

        onError((error || warning) ? { error, warning } : null);

        return { error, warning };
      });
    }
  }, [allBalances, currentAmount, onError, t, value]);

  if (error || warning) {
    return (
      <article className={error ? 'error' : 'warning'}>
        <div><Icon name='warning sign' />{error || warning}</div>
      </article>
    );
  }

  return null;
}

export default React.memo(ValidateAmount);
