// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { PalletUniquesInstanceDetails, PalletUniquesInstanceMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { UniqueInstanceInfo } from '../types';

import { useEffect, useState } from 'react';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';

const EMPTY_FLAGS = {
  isOwnerMe: false
};

const QUERY_OPTS = { withParams: true };

function isAccount (allAccounts: string[], accountId: AccountId): boolean {
  const address = accountId.toString();

  return allAccounts.some((a) => a === address);
}

function extractInfo (allAccounts: string[], id: BN, optDetails: Option<PalletUniquesInstanceDetails>, metadata: PalletUniquesInstanceMetadata): UniqueInstanceInfo {
  console.log('extract called'); 
  const details = optDetails.unwrapOr(null);
  
  return {
    ...(details
      ? {
        isOwnerMe: isAccount(allAccounts, details.owner)
      }
      : EMPTY_FLAGS
    ),
    details,
    id,
    key: id.toString(),
    metadata: metadata.isEmpty
      ? null
      : metadata
  };
}

function useInstancesImpl (ids?: BN[]): UniqueInstanceInfo[] | undefined {
  // if (ids === undefined ) {
  //   return;
  // }
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  console.log('metadada start'); 
  const metadata = useCall<[[BN[]], PalletUniquesInstanceMetadata[]]>(api.query.uniques.instanceMetadataOf.multi, ids?.map((id) => [id, null]), QUERY_OPTS);
  console.log('metadada end beg'); 
  const details = useCall<[[BN[]], Option<PalletUniquesInstanceDetails>[]]>(api.query.uniques.asset.multi, ids?.map((id) => [id, null]), QUERY_OPTS);
  console.log('metadada fin fin'); 
  const [state, setState] = useState<UniqueInstanceInfo[] | undefined>();

  useEffect((): void => {
    console.log('stt');  
    if (details) {
      console.log(details[0][0])
    }
    console.log(details);  
    console.log(metadata);
    console.log('nddd');  
    details && metadata && (details[0][0].length === metadata[0][0].length) &&
    setState(
        details[0][0].map((id, index) =>
          extractInfo(allAccounts, id, details[1][index], metadata[1][index])
        )
      );
  }, [allAccounts, details, ids, metadata]);

  return state;
}

export default createNamedHook('useInstances', useInstancesImpl);
