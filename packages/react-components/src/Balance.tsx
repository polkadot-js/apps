// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React from 'react';

import { formatDarwiniaPower } from '@polkadot/app-staking/Query/util';
import { BalanceFree, FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from './translate';

export interface RenderProps {
  className?: string;
  label?: React.ReactNode;
  value?: BN | BN[];
  isDarwiniaPower?: boolean;
  powerUnit?: string;
}

export interface Props {
  balance?: BN | BN[];
  className?: string;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
  withLabel?: boolean;
}

export function renderProvided ({ className = '', isDarwiniaPower, label, powerUnit, value }: RenderProps): React.ReactNode {
  let others: undefined | React.ReactNode;

  if (Array.isArray(value)) {
    const totals = value.filter((_, index): boolean => index !== 0);
    const total = totals.reduce((total, value): BN => total.add(value), BN_ZERO).gtn(0);

    if (total) {
      others = totals.map((balance, index): React.ReactNode =>
        <FormatBalance
          key={index}
          value={balance}
        />
      );
    }
  }

  return (
    <FormatBalance
      className={`ui--Balance ${className}`}
      isDarwiniaPower={isDarwiniaPower}
      label={label}
      value={isDarwiniaPower ? undefined : Array.isArray(value) ? value[0] : value}
      valueFormatted={isDarwiniaPower ? formatDarwiniaPower(value as BN, powerUnit) : undefined}
    >
      {others && (
        <span>&nbsp;(+{others})</span>
      )}
    </FormatBalance>
  );
}

function BalanceDisplay (props: Props): React.ReactElement<Props> | null {
  const { balance, className = '', label, params } = props;
  const { t } = useTranslation();

  if (!params) {
    return null;
  }

  return balance
    ? <>{renderProvided({ className, label, powerUnit: t('power', 'power'), value: balance })}</>
    : (
      <BalanceFree
        className={`ui--Balance ${className}`}
        label={label}
        params={params}
      />
    );
}

export default React.memo(BalanceDisplay);
