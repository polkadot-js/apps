// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { PayoutStash } from './types';

import React, { useEffect, useState } from 'react';

import { AddressSmall } from '@polkadot/react-components';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';

import useEraBlocks from './useEraBlocks';
import { createErasString } from './util';

interface Props {
  className?: string;
  payout: PayoutStash;
}

interface EraInfo {
  eraStr: React.ReactNode;
  oldestEra?: BN;
}

function Stash ({ className = '', payout: { available, rewards, stashId } }: Props): React.ReactElement<Props> {
  const [{ eraStr, oldestEra }, setEraInfo] = useState<EraInfo>({ eraStr: '' });
  const eraBlocks = useEraBlocks(oldestEra);

  useEffect((): void => {
    rewards && setEraInfo({
      eraStr: createErasString(rewards.map(({ era }) => era)),
      oldestEra: rewards[0]?.era
    });
  }, [rewards]);

  return (
    <tr className={className}>
      <td
        className='address'
        colSpan={2}
      >
        <AddressSmall value={stashId} />
      </td>
      <td className='start'>
        <span className='payout-eras'>{eraStr}</span>
      </td>
      <td className='number'><FormatBalance value={available} /></td>
      <td className='number'>{eraBlocks && <BlockToTime value={eraBlocks} />}</td>
      <td
        className='button'
        colSpan={3}
      />
    </tr>
  );
}

export default React.memo(Stash);
