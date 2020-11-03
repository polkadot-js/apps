// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveBalancesAll, DeriveFees } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types/interfaces';
import { ExtraFees } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Compact, UInt } from '@polkadot/types';
import { Icon } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatBalance } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  amount: BN | Compact<UInt>;
  fees: DeriveFees;
  recipientId: string | AccountId;
  onChange: (fees: ExtraFees) => void;
}

interface State extends ExtraFees {
  isCreation: boolean;
  isNoEffect: boolean;
}

export default function Transfer ({ amount, fees, onChange, recipientId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances.all as any, [recipientId]);
  const [{ isCreation, isNoEffect }, setState] = useState<State>({
    extraFees: new BN(0),
    extraAmount: new BN(0),
    extraWarn: false,
    isCreation: false,
    isNoEffect: false
  });

  useEffect((): void => {
    if (allBalances) {
      let extraFees = new BN(fees.transferFee);

      if (allBalances.votingBalance.isZero()) {
        extraFees = extraFees.add(fees.creationFee);
      }

      const extraAmount = amount instanceof Compact ? amount.unwrap() : new BN(amount);
      const isCreation = allBalances.votingBalance.isZero() && fees.creationFee.gtn(0);
      const isNoEffect = extraAmount.add(allBalances.votingBalance).lt(fees.existentialDeposit);
      const extraWarn = isCreation || isNoEffect;
      const update = { extraAmount, extraFees, extraWarn };

      onChange(update);

      setState({
        ...update,
        isCreation,
        isNoEffect
      });
    }
  }, [amount, allBalances, fees]);

  return (
    <>
      {isNoEffect && (
        <div>
          <Icon name='warning sign' />
          {t('The final recipient balance is less or equal to {{existentialDeposit}} (the existential amount) and will not be reflected', {
            replace: {
              existentialDeposit: formatBalance(fees.existentialDeposit)
            }
          })}
        </div>
      )}
      {isCreation && (
        <div>
          <Icon name='warning sign' />
          {t('A fee of {{creationFee}} will be deducted from the sender since the destination account does not exist', {
            replace: {
              creationFee: formatBalance(fees.creationFee)
            }
          })}
        </div>
      )}
    </>
  );
}
