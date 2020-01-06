// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedFees } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { ExtraFees } from './types';

import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import { Compact, UInt } from '@polkadot/types';
import { Icon } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatBalance } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  deposit: BN | Compact<UInt>;
  fees: DerivedFees;
  democracy_minimumDeposit?: BN;
  onChange: (fees: ExtraFees) => void;
}

interface State extends ExtraFees {
  isBelowMinimum: boolean;
}

const ZERO = new BN(0);

export function Proposal ({ deposit, onChange, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const minDeposit = api.consts.democracy.minimumDeposit || useCall<BN>(api.query.democracy.minimumDeposit, []);
  const [{ extraAmount, isBelowMinimum }, setState] = useState<State>({
    extraFees: ZERO,
    extraAmount: ZERO,
    extraWarn: false,
    isBelowMinimum: false
  });

  useEffect((): void => {
    if (minDeposit) {
      const extraAmount = deposit instanceof Compact
        ? deposit.toBn()
        : deposit;
      const isBelowMinimum = extraAmount.lt(minDeposit);
      const update = {
        extraAmount,
        extraFees: ZERO,
        extraWarn: isBelowMinimum
      };

      onChange(update);

      setState({
        ...update,
        isBelowMinimum
      });
    }
  }, [minDeposit]);

  return (
    <>
      {isBelowMinimum && (
        <div>
          <Icon name='warning sign' />
          {t('The deposit is below the {{minimum}} minimum required for the proposal to be evaluated', {
            replace: {
              minimum: formatBalance(minDeposit, { forceUnit: '-' })
            }
          })}
        </div>
      )}
      {!extraAmount.isZero() && (
        <div>
          <Icon name='arrow right' />
          {t('The deposit of {{deposit}} will be reserved until the proposal is completed', {
            replace: {
              deposit: formatBalance(extraAmount, { forceUnit: '-' })
            }
          })}
        </div>
      )}
    </>
  );
}

export default translate(Proposal);
