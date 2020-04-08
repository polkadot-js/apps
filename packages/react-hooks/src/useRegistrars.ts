// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RegistrarInfo } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';
import { Option } from '@polkadot/types';

import useAccounts from './useAccounts';
import useApi from './useApi';
import useCall from './useCall';

interface State {
  isRegistrar: boolean;
  registrars: (string | null)[];
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
      const registrars = query.map((registrar): string| null =>
        registrar.isSome
          ? registrar.unwrap().account.toString()
          : null
      );

      setState({
        isRegistrar: registrars.some((registrar) => !!registrar && allAccounts.includes(registrar)),
        registrars
      });
    }
  }, [allAccounts, query]);

  return state;
}
