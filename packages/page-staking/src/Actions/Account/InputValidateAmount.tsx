// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { AmountValidateState } from '../types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';

import { MarkError, MarkWarning } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BN_TEN, BN_THOUSAND, BN_ZERO, formatBalance } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  controllerId: string | null;
  currentAmount?: BN | null;
  isNominating?: boolean;
  minNominated?: BN;
  minNominatorBond?: BN;
  minValidatorBond?: BN;
  onError: (state: AmountValidateState | null) => void;
  stashId: string | null;
  value?: BN | null;
}

function formatExistential (value: BN): string {
  let fmt = (
    value
      .mul(BN_THOUSAND)
      .div(BN_TEN.pow(new BN(formatBalance.getDefaults().decimals)))
      .toNumber() / 1000
  ).toFixed(3);

  while (fmt.length !== 1 && ['.', '0'].includes(fmt[fmt.length - 1])) {
    const isLast = fmt.endsWith('.');

    fmt = fmt.substr(0, fmt.length - 1);

    if (isLast) {
      break;
    }
  }

  return fmt;
}

function ValidateAmount ({ currentAmount, isNominating, minNominated, minNominatorBond, minValidatorBond, onError, stashId, value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const stashBalance = useCall<DeriveBalancesAll>(api.derive.balances?.all, [stashId]);
  const [{ error, warning }, setResult] = useState<AmountValidateState>({ error: null, warning: null });

  useEffect((): void => {
    if (stashBalance && value) {
      // also used in bond extra, take check against total of current bonded and new
      const check = value.add(currentAmount || BN_ZERO);
      const existentialDeposit = api.consts.balances.existentialDeposit;
      const maxBond = stashBalance.freeBalance.sub(existentialDeposit.divn(2));
      let newError: string | null = null;
      let newWarning: string | null = null;

      if (check.gte(maxBond)) {
        newError = t('The specified value is too large and does not allow funds to pay future transaction fees.');
      } else if (check.lt(existentialDeposit)) {
        newError = t('The bonded amount is less than the minimum bond amount of {{existentialDeposit}}', {
          replace: { existentialDeposit: formatExistential(existentialDeposit) }
        });
      } else if (isNominating) {
        if (minNominatorBond && check.lt(minNominatorBond)) {
          newError = t('The bonded amount is less than the minimum threshold of {{minBond}} for nominators', {
            replace: { minBond: formatBalance(minNominatorBond) }
          });
        } else if (minNominated && check.lt(minNominated)) {
          newWarning = t('The bonded amount is less than the current active minimum nominated amount of {{minNomination}} and depending on the network state, may not be selected to participate', {
            replace: { minNomination: formatBalance(minNominated) }
          });
        }
      } else {
        if (minValidatorBond && check.lt(minValidatorBond)) {
          newError = t('The bonded amount is less than the minimum threshold of {{minBond}} for validators', {
            replace: { minBond: formatBalance(minValidatorBond) }
          });
        }
      }

      setResult((state): AmountValidateState => {
        const error = state.error !== newError ? newError : state.error;
        const warning = state.warning !== newWarning ? newWarning : state.warning;

        onError(
          (error || warning)
            ? { error, warning }
            : null
        );

        return { error, warning };
      });
    }
  }, [api, currentAmount, isNominating, minNominated, minNominatorBond, minValidatorBond, onError, stashBalance, t, value]);

  if (error) {
    return <MarkError content={error} />;
  } else if (warning) {
    return <MarkWarning content={warning} />;
  }

  return null;
}

export default React.memo(ValidateAmount);
