// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

import { ApiPromise } from '@polkadot/api';
import { AddressSmall } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useDeriveAccountInfo } from '@polkadot/react-hooks';

import Favorite from './Favorite';

interface Props {
  address: string;
  className?: string;
  filterName: string;
  isFavorite: boolean;
  toggleFavorite: (accountId: string) => void;
  blocksCreated: number,
  blocksTarget: number,
  rewardPercentage: string,
}

function useAddressCalls (api: ApiPromise, address: string) {
  const accountInfo = useDeriveAccountInfo(address);

  return { accountInfo };
}

function Address ({ address, blocksCreated, blocksTarget, className = '', filterName, isFavorite, rewardPercentage, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { accountInfo } = useAddressCalls(api, address);

  const isVisible = useMemo(
    () => accountInfo ? checkVisibility(api, address, accountInfo, filterName) : true,
    [api, accountInfo, address, filterName]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <tr className={className}>
      <td className='badge together'>
        <Favorite
          address={address}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
      </td>
      <td className='address'>
        <AddressSmall value={address} />
      </td>
      <td className='number'>
        {blocksCreated}
      </td>
      <td className='number'>
        {blocksTarget}
      </td>
      <td className='number'>
        {rewardPercentage}
      </td>

    </tr>
  );
}

export default React.memo(Address);
