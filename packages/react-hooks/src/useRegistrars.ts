// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RegistrarInfo } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';
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
  const query = useCall<Option<RegistrarInfo>[]>(!skipQuery && hasAccounts && api.query.identity?.registrars, []);
  const [state, setState] = useState<State>({ isRegistrar: false, registrars: [] });

  // determine if we have a registrar or not - registrars are allowed to approve
  useEffect((): void => {
    if (allAccounts && query) {
      const registrars = query
        .map((registrar, index): RegistrarNull => ({
          address: registrar.isSome
            ? registrar.unwrap().account.toString()
            : null,
          index
        }))
        .filter((registrar): registrar is Registrar => !!registrar.address);

      setState({
        isRegistrar: registrars.some(({ address }) => allAccounts.includes(address)),
        registrars
      });
    }
  }, [allAccounts, query]);

  return state;
}
