// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import { AddressMini, Expander } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  stakeOther?: BN;
  nominators: [AccountId, Balance][];
}

function StakeOther ({ nominators, stakeOther }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <td className='top'>
      {stakeOther?.gtn(0) && (
        <>
          <label>{t('other stake')}</label>
          <Expander summary={
            <FormatBalance value={stakeOther}>
              &nbsp;({formatNumber(nominators.length)})
            </FormatBalance>
          }>
            {nominators.map(([who, bonded]): React.ReactNode =>
              <AddressMini
                bonded={bonded}
                key={who.toString()}
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
