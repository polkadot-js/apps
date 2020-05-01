// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveBalancesAll } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BalanceVoting } from '@polkadot/react-query';
import { isBn } from '@polkadot/util';

import InputBalance from './InputBalance';
import { useTranslation } from './translate';

interface Props {
  accountId?: string | null;
  autoFocus?: boolean;
  onChange: (value: BN) => void;
}

interface ValueState {
  selectedId?: string | null;
  value?: BN;
}

function VoteValue ({ accountId, autoFocus, onChange }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances.all, [accountId]);
  const [{ selectedId, value }, setValue] = useState<ValueState>({});

  useEffect((): void => {
    // if the set accountId changes and the new balances is for that id, set it
    (accountId !== selectedId) && allBalances?.accountId.eq(accountId) && setValue({
      selectedId: accountId,
      value: allBalances.lockedBalance
    });
  }, [accountId, selectedId, allBalances]);

  // only do onChange to parent when the BN value comes in, not our formatted version
  useEffect((): void => {
    isBn(value) && onChange(value);
  }, [onChange, value]);

  const _setValue = useCallback(
    (value?: BN) => setValue(({ selectedId }) => ({ selectedId, value })),
    []
  );

  const isDisabled = accountId !== selectedId;

  return (
    <InputBalance
      autoFocus={autoFocus}
      defaultValue={accountId !== selectedId ? undefined : allBalances?.lockedBalance}
      help={t('The amount that is associated with this vote. This value is is locked for the duration of the vote.')}
      isDisabled={isDisabled}
      isZeroable
      label={t('vote value')}
      labelExtra={
        <BalanceVoting
          label={<label>{t('voting balance')}</label>}
          params={accountId}
        />
      }
      maxValue={allBalances?.votingBalance}
      onChange={_setValue}
    />
  );
}

export default React.memo(VoteValue);
