// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';

import React, { useCallback, useEffect, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { BalanceVoting } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import InputBalance from './InputBalance.js';
import { useTranslation } from './translate.js';

interface Props {
  accountId?: string | null;
  autoFocus?: boolean;
  isCouncil?: boolean;
  label?: string;
  noDefault?: boolean;
  onChange: (value: BN) => void;
}

interface ValueState {
  defaultValue: BN;
  maxValue: BN;
  selectedId?: string | null;
  value: BN;
}

const LOCKS_ORDERED = ['pyconvot', 'democrac', 'phrelect'] as const;

function getValues (selectedId: string | null | undefined, noDefault: boolean | undefined, allBalances: DeriveBalancesAll, existential: BN): ValueState {
  const sortedLocks = allBalances.lockedBreakdown
    // first sort by amount, so greatest value first
    .sort((a, b) =>
      b.amount.cmp(a.amount)
    )
    // then sort by the type of lock (we try to find relevant)
    .sort((a, b): number => {
      if (!a.id.eq(b.id)) {
        for (let i = 0, count = LOCKS_ORDERED.length; i < count; i++) {
          const lockName = LOCKS_ORDERED[i];

          if (a.id.eq(lockName)) {
            return -1;
          } else if (b.id.eq(lockName)) {
            return 1;
          }
        }
      }

      return 0;
    })
    .map(({ amount }) => amount);

  const maxValue = allBalances.votingBalance;
  let defaultValue: BN = sortedLocks[0] || allBalances.lockedBalance;

  if (noDefault) {
    defaultValue = BN_ZERO;
  } else if (defaultValue.isZero()) {
    // NOTE As of now (7 Jan 2023) taking the max and subtracting existential is still too high
    // (on Kusama) where the tx fees for a conviction vote is more than the existential. So try to
    // adapt to get some sane default starting value
    let withoutExist = maxValue.sub(existential);

    for (let i = 0; i < 3; i++) {
      if (withoutExist.gt(existential)) {
        defaultValue = withoutExist;
        withoutExist = withoutExist.sub(existential);
      }
    }
  }

  return {
    defaultValue,
    maxValue,
    selectedId,
    value: defaultValue
  };
}

function VoteValue ({ accountId, autoFocus, label, noDefault, onChange }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [accountId]);
  const [{ defaultValue, maxValue, selectedId, value }, setValue] = useState<ValueState>({ defaultValue: BN_ZERO, maxValue: BN_ZERO, value: BN_ZERO });

  useEffect((): void => {
    // if the set accountId changes and the new balances is for that id, set it
    allBalances && allBalances.accountId.eq(accountId) && setValue((state) =>
      state.selectedId !== accountId
        ? getValues(accountId, noDefault, allBalances, api.consts.balances.existentialDeposit)
        : state
    );
  }, [allBalances, accountId, api, noDefault]);

  // only do onChange to parent when the BN value comes in, not our formatted version
  useEffect((): void => {
    onChange(value);
  }, [onChange, value]);

  const _setValue = useCallback(
    (value?: BN) => setValue((state) =>
      state.selectedId === accountId && value && !value.eq(state.value)
        ? ({ ...state, value })
        : state
    ),
    [accountId]
  );

  const isDisabled = accountId !== selectedId;

  return (
    <InputBalance
      autoFocus={autoFocus}
      defaultValue={
        isDisabled
          ? undefined
          : defaultValue
      }
      isDisabled={isDisabled}
      isZeroable
      label={label || t('vote value')}
      labelExtra={
        <BalanceVoting
          label={<label>{t('voting balance')}</label>}
          params={accountId}
        />
      }
      maxValue={maxValue}
      onChange={_setValue}
    />
  );
}

export default React.memo(VoteValue);
