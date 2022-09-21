// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, {useCallback, useMemo} from 'react';

import { ApiPromise } from '@polkadot/api';
import {AddressSmall, Icon, Spinner} from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useDeriveAccountInfo } from '@polkadot/react-hooks';
import {queryAddress} from "@polkadot/app-staking/Targets/Validator";

interface Props {
  address: string;
  filterName: string;
  session?: number;
  blocksCreated?: number,
  blocksTarget: number,
  rewardPercentage?: string,
}

function useAddressCalls (api: ApiPromise, address: string) {
  const accountInfo = useDeriveAccountInfo(address);

  return { accountInfo };
}

function Address ({ address, session, blocksCreated, blocksTarget, filterName, rewardPercentage, }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { accountInfo } = useAddressCalls(api, address);

  const isVisible = useMemo(
    () => accountInfo ? checkVisibility(api, address, accountInfo, filterName) : true,
    [api, accountInfo, address, filterName]
  );

  if (!isVisible) {
    return null;
  }

  const _onQueryStats = useCallback(
    () => queryAddress(address),
    [address]
  );

  return (
    <tr>
      <td className='address'>
        <AddressSmall value={address} />
      </td>
      {session && <td className='number'>
        {session}
      </td>}
      <td className='number'>
        {blocksCreated === undefined ? <Spinner noLabel={true}/> : blocksCreated}
      </td>
      <td className='number'>
        {blocksTarget}
      </td>
      <td className='number'>
        {blocksCreated === undefined ? '' : rewardPercentage}
      </td>
      {!session && <td className='number'>
        <Icon
          className='staking--stats highlight--color'
          icon='chart-line'
          onClick={_onQueryStats}
        />
      </td>}
    </tr>
  );
}

export default React.memo(Address);
