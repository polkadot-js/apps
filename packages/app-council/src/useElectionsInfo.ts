// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedElectionsInfo } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types/interfaces';

import { ApiPromise } from '@polkadot/api';
import { registry } from '@polkadot/react-api';
import { useApi, useCall } from '@polkadot/react-hooks';
import { createType } from '@polkadot/types';
import { ComponentProps } from './types';

const NULL_INFO: DerivedElectionsInfo = {
  candidates: [],
  candidateCount: createType(registry, 'u32'),
  desiredSeats: createType(registry, 'u32'),
  members: [],
  runnersUp: [],
  termDuration: createType(registry, 'BlockNumber')
};

export default function useElectionsInfo (anApi?: ApiPromise): ComponentProps {
  let api = anApi || useApi().api;

  const electionsInfo = useCall<DerivedElectionsInfo>(api.derive.elections.info, []) || NULL_INFO;
  const allVotes = useCall<Record<string, AccountId[]>>((api.query.electionsPhragmen || api.query.elections).votesOf, [], {
    transform: ([voters, casted]: [AccountId[], AccountId[][]]): Record<string, AccountId[]> =>
      voters.reduce((result: Record<string, AccountId[]>, voter, index): Record<string, AccountId[]> => {
        casted[index].forEach((candidate): void => {
          const address = candidate.toString();

          if (!result[address]) {
            result[address] = [];
          }

          result[address].push(voter);
        });

        return result;
      }, {})
  }) || {};

  return { electionsInfo, allVotes };
}
