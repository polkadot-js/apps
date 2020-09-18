// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RegistrarInfo } from '@polkadot/types/interfaces';

import { useMemo } from 'react';
import { Option } from '@polkadot/types';

import useAccounts from './useAccounts';
import useApi from './useApi';
import useCall from './useCall';

interface RegistrarNull {
  address: string | null;
  index: number;
}

interface Registrar {
  address: string;
  index: number;
}

interface State {
  isRegistrar: boolean;
  registrars: Registrar[];
  skipQuery?: boolean;
}

export default function useRegistrars (skipQuery?: boolean): State {
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const query = useCall<Option<RegistrarInfo>[]>(!skipQuery && hasAccounts && api.query.identity?.registrars);

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
        isRegistrar: registrars.some(({ address }) => allAccounts.includes(address)),
        registrars
      };
    },
    [allAccounts, query]
  );
}
