// Copyright 2017-2019 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedContractFees } from '@polkadot/api-derive/types';
import { ExtraFees as State } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Compact, UInt } from '@polkadot/types';

interface Props {
  endowment: BN | Compact<UInt>;
  fees: DerivedContractFees;
  onChange: (fees: State) => void;
}

export default function ContractDeploy ({ endowment, fees, onChange }: Props): React.ReactElement<Props> | null {
  const [state, setState] = useState<State>({
    extraFees: new BN(0),
    extraAmount: new BN(0),
    extraWarn: false
  });

  useEffect((): void => {
    const extraFees = new BN(fees.createBaseFee).add(fees.contractFee);
    const extraAmount = endowment instanceof Compact
      ? endowment.toBn()
      : new BN(endowment || 0);

    const update = {
      extraAmount,
      extraFees,
      extraWarn: false
    };

    if (!update.extraAmount.eq(state.extraAmount) || !update.extraFees.eq(state.extraFees)) {
      onChange(update);
    }

    setState(update);
  }, [endowment, fees]);

  return null;
}
