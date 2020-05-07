// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveContractFees } from '@polkadot/api-derive/types';
import { ExtraFees as State } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Compact, UInt } from '@polkadot/types';

interface Props {
  endowment: BN | Compact<UInt>;
  fees: DeriveContractFees;
  onChange: (fees: State) => void;
}

function ContractDeploy ({ endowment, fees, onChange }: Props): React.ReactElement<Props> | null {
  const [, setState] = useState<State>({
    extraAmount: new BN(0),
    extraFees: new BN(0),
    extraWarn: false
  });

  useEffect((): void => {
    const extraFees = fees.contractFee;
    const extraAmount = endowment instanceof Compact
      ? endowment.toBn()
      : new BN(endowment || 0);

    const update = {
      extraAmount,
      extraFees,
      extraWarn: false
    };

    setState((state): State => {
      if (!update.extraAmount.eq(state.extraAmount) || !update.extraFees.eq(state.extraFees)) {
        onChange(update);
      }

      return update;
    });
  }, [endowment, fees, onChange]);

  return null;
}

export default React.memo(ContractDeploy);
