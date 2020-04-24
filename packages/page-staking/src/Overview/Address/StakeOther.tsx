// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import { AddressMini, Expander } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

interface Props {
  stakeOther?: BN;
  nominators: [string, Balance][];
}

function StakeOther ({ nominators, stakeOther }: Props): React.ReactElement<Props> {
  return (
    <td className='number all'>
      {stakeOther?.gtn(0) && (
        <>
          <Expander summary={
            <FormatBalance
              labelPost={` (${nominators.length})`}
              value={stakeOther}
            />
          }>
            {nominators.map(([who, bonded]): React.ReactNode =>
              <AddressMini
                bonded={bonded}
                key={who}
                value={who}
                withBonded
              />
            )}
          </Expander>
        </>
      )}
    </td>
  );
}

export default React.memo(StakeOther);
