// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesAll } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BalanceVoting } from '@polkadot/react-query';
import { formatBalance, isBn } from '@polkadot/util';

import InputBalance from './InputBalance';
import { useTranslation } from './translate';

interface Props {
  accountId?: string | null;
  autoFocus?: boolean;
  onChange: (value: BN) => void;
}

interface ValueState {
  selectedId?: string | null;
  value?: BN | string;
}

function VoteValue ({ accountId, autoFocus, onChange }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const allBalances = useCall<DerivedBalancesAll>(api.derive.balances.all as any, [accountId]);
  const [{ selectedId, value }, setValue] = useState<ValueState>({});

  // TODO This may be useful elsewhere, so figure out a way to make this a utility
  useEffect((): void => {
    // if the set accountId changes and the new balances is for that id, set it
    if (accountId !== selectedId && allBalances?.accountId.eq(accountId)) {
      // format, removing ',' separators
      const formatted = formatBalance(allBalances.lockedBalance, { forceUnit: '-', withSi: false }).replace(',', '');
      // format the balance
      //   - if > 0 just take the significant portion
      //   - if == 0, just display 0
      //   - if < 0, display the 3 decimal formatted value
      const value = allBalances.lockedBalance.gtn(0)
        ? formatted.split('.')[0]
        : allBalances.lockedBalance.eqn(0)
          ? '0'
          : formatted;

      // set both the selected id (for future checks) and the formatted value
      setValue({ selectedId: accountId, value });
    }
  }, [accountId, selectedId, allBalances]);

  // only do onChange to parent when the BN value comes in, not our formatted version
  useEffect((): void => {
    isBn(value) && onChange(value);
  }, [value]);

  const _setValue = useCallback(
    (value?: BN): void => setValue({ selectedId, value }),
    [selectedId]
  );

  return (
    <InputBalance
      autoFocus={autoFocus}
      help={t('The amount that is associated with this vote. This value is is locked for the duration of the vote.')}
      isZeroable
      label={t('vote value')}
      labelExtra={<BalanceVoting label={<label>{t('voting balance')}</label>} params={accountId} />}
      maxValue={allBalances?.votingBalance}
      onChange={_setValue}
      value={value}
    />
  );
}

export default React.memo(VoteValue);
