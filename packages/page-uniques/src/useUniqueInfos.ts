// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { PalletUniquesClassDetails, PalletUniquesClassMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { UniqueInfo } from './types';

import { useEffect, useState } from 'react';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';

const EMPTY_FLAGS = {
  isAdminMe: false,
  isFreezerMe: false,
  isIssuerMe: false,
  isOwnerMe: false
};

const QUERY_OPTS = { withParams: true };

function isAccount (allAccounts: string[], accountId: AccountId): boolean {
  const address = accountId.toString();

  return allAccounts.some((a) => a === address);
}

function extractInfo (allAccounts: string[], id: BN, optDetails: Option<PalletUniquesClassDetails>, metadata: PalletUniquesClassMetadata): UniqueInfo {
  const details = optDetails.unwrapOr(null);

  return {
    ...(details
      ? {
        isAdminMe: isAccount(allAccounts, details.admin),
        isFreezerMe: isAccount(allAccounts, details.freezer),
        isIssuerMe: isAccount(allAccounts, details.issuer),
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

function useUniqueInfosImpl (ids?: BN[]): UniqueInfo[] | undefined {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const metadata = useCall<[[BN[]], PalletUniquesClassMetadata[]]>(api.query.uniques.classMetadataOf.multi, [ids], QUERY_OPTS);
  const details = useCall<[[BN[]], Option<PalletUniquesClassDetails>[]]>(api.query.uniques.class.multi, [ids], QUERY_OPTS);
  const [state, setState] = useState<UniqueInfo[] | undefined>();

  useEffect((): void => {
    details && metadata && (details[0][0].length === metadata[0][0].length) &&
      setState(
        details[0][0].map((id, index) =>
          extractInfo(allAccounts, id, details[1][index], metadata[1][index])
        )
      );
  }, [allAccounts, details, ids, metadata]);

  return state;
}

export default createNamedHook('useUniqueInfos', useUniqueInfosImpl);
