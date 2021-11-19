// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import type BN from 'bn.js';
// import type { DeriveAccountInfo, DeriveHeartbeatAuthor } from '@polkadot/api-derive/types';
// import type { Option } from '@polkadot/types';
// import type { SlashingSpans, ValidatorPrefs } from '@polkadot/types/interfaces';
// import type { NominatedBy as NominatedByType, ValidatorInfo } from '../../types';
// import type { NominatorValue } from './types';

import React, { useMemo } from 'react';

import { ApiPromise } from '@polkadot/api';
import { AddressSmall, Icon, LinkExternal } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN } from '@polkadot/util';

// import Favorite from './Favorite';
// import NominatedBy from './NominatedBy';
// import StakeOther from './StakeOther';
// import Status from './Status';

interface Props {
  address: string;
  className?: string;
  collatorStake:BN
  collatorInfo:{minNomination:string,maxNominatorsPerCollator:string}
}

function CollatorDetails ({ address, className = '',collatorStake,collatorInfo }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  console.log("collatorInfo",collatorInfo)
      let collatorState2=useCall<string>(api.query.parachainStaking.collatorState2,[address])
      console.log("collatorState2",(collatorState2 as any))
      // const {totalCounted}=collatorState2
      let topNominators=collatorState2?(collatorState2 as any).value.topNominators:[]
      console.log("topNominators",topNominators)
      let minContribution=topNominators?.length==collatorInfo.maxNominatorsPerCollator&&topNominators?.length>0?topNominators[topNominators?.length-1].amount:collatorInfo.minNomination
      console.log("minContribution",minContribution)


  return (
    <tr className={className}>
      {/* <td className='badge together'>
        <Favorite
          address={address}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
        <Status
          isElected={isElected}
          isMain={isMain}
          isPara={isPara}
          isRelay={!!(api.query.parasShared || api.query.shared)?.activeValidatorIndices}
          nominators={isMain ? nominators : nominatedBy}
          onlineCount={recentlyOnline?.blockCount}
          onlineMessage={recentlyOnline?.hasMessage}
        />
      </td> */}
      <td className='address'>
        <AddressSmall value={address} />
      </td>
      <td className='number media--1100'>
          {collatorStake?.gtn(0) && (
            <FormatBalance value={collatorState2?(collatorState2 as any).value.totalCounted:""} /> // counted nominator stake
          )}
        </td>
      <td className='number media--1100'>
          {collatorStake?.gtn(0) && (
            <FormatBalance value={collatorState2?(collatorState2 as any).value.totalBacking:""} /> // total nominator stake
          )}
        </td>
      <td className='number media--1100'>
          {collatorState2?(collatorState2 as any).value.nominators.length:""}
        </td>
      <td className='number media--1100'>
          {collatorStake?.gtn(0) && (
            <FormatBalance value={collatorState2?(collatorState2 as any).value.bond:""} /> // own stake
          )}
        </td>
      <td className='number media--1100'>
          {collatorStake?.gtn(0) && (
            <FormatBalance value={minContribution} /> // minContribution
          )}
        </td>
        {/* <td className='number media--1100'>
          {collatorStake?.gtn(0) && (
            <FormatBalance value={collatorStake} />
          )}
        </td> */}
    </tr>
  );
}

export default React.memo(CollatorDetails);
