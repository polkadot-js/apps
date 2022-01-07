// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { RegistrarInfo } from '@polkadot/types/interfaces';
import type { Registrar } from './types';

import { useMemo } from 'react';

import { createNamedHook } from './createNamedHook';
import { useAccounts } from './useAccounts';
import { useApi } from './useApi';
import { useCall } from './useCall';

interface RegistrarNull {
  address: string | null;
  index: number;
}

interface State {
  isRegistrar: boolean;
  registrars: Registrar[];
  skipQuery?: boolean;
}

function useRegistrarsImpl (skipQuery?: boolean): State {
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const query = useCall<Option<RegistrarInfo>[]>(!skipQuery && api.query.identity?.registrars);

  // determine if we have a registrar or not - registrars are allowed to approve
  return useMemo(
    (): State => {
      const registrars = (query || [])
        .map((registrar, index): RegistrarNull => ({
          address: registrar.isSome
            ? registrar.unwrap().account.toString()
            : null,
          index
        }))
        .filter((registrar): registrar is Registrar => !!registrar.address);

      return {
        isRegistrar: hasAccounts && registrars.some(({ address }) => allAccounts.includes(address)),
        registrars
      };
    },
    [allAccounts, hasAccounts, query]
  );
}

export const useRegistrars = createNamedHook('useRegistrars', useRegistrarsImpl);
