// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { withCalls } from '@polkadot/react-api';
import { InputBalance } from '@polkadot/react-components';
import { BalanceVoting } from '@polkadot/react-query';
import { formatBalance, isBn } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  accountId?: string | null;
  allBalances?: DerivedBalances;
  onChange: (value: BN) => void;
}

interface ValueState {
  selectedId?: string | null;
  value?: BN | string;
}

function VoteValue ({ accountId, allBalances, onChange, t }: Props): React.ReactElement<Props> | null {
  const [{ selectedId, value }, setValue] = useState<ValueState>({});

  useEffect((): void => {
    // if the set accountId changes and the new balances is for that id, set it
    if (accountId !== selectedId && allBalances?.accountId.eq(accountId)) {
      const formatted = formatBalance(allBalances.lockedBalance, { forceUnit: '-', withSi: false }).replace(',', '');
      const value = allBalances.lockedBalance.gtn(0)
        ? formatted.split('.')[0]
        : allBalances.lockedBalance.eqn(0)
          ? '0'
          : formatted;
      setValue({
        selectedId: accountId,
        value
      });
    }
  }, [accountId, selectedId, allBalances]);

  useEffect((): void => {
    isBn(value) && onChange(value);
  }, [value]);

  const _setValue = (value?: BN): void => setValue({ selectedId, value });

  return (
    <InputBalance
      help={t('The amount that is associated with this vote. This value is is locked for the duration of the vote.')}
      label={t('vote value')}
      labelExtra={<BalanceVoting label={<label>{t('voting balance')}</label>} params={accountId} />}
      maxValue={allBalances?.votingBalance}
      onChange={_setValue}
      value={value}
    />
  );
}

export default translate(
  withCalls<Props>(
    ['derive.balances.all', {
      paramName: 'accountId',
      propName: 'allBalances'
    }]
  )(VoteValue)
);
