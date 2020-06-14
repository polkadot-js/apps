// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { H256, Multisig } from '@polkadot/types/interfaces';

import { useContext, useEffect, useState } from 'react';
import { useApi, useIncrement, useIsMountedRef } from '@polkadot/react-hooks';
import { EventsContext } from '@polkadot/react-query';
import { Option, StorageKey } from '@polkadot/types';

export default function useMultisigApprovals (address: string): [H256, Multisig][] {
  const events = useContext(EventsContext);
  const { api } = useApi();
  const [multiInfos, setMultiInfos] = useState<[H256, Multisig][]>([]);
  const [trigger, incTrigger] = useIncrement();
  const mountedRef = useIsMountedRef();

  // increment the trigger by looking at all events
  //   - filter the by multisig module (old utility is not supported)
  //   - find anything data item where the type is AccountId
  //   - increment the trigger when at least one matches our address
  useEffect((): void => {
    events
      .filter(({ record: { event: { section } } }) => section === 'multisig')
      .reduce((hasMultisig: boolean, { record: { event: { data } } }) =>
        data.reduce((hasMultisig: boolean, item) =>
          hasMultisig || (item.toRawType() === 'AccountId' && item.eq(address)),
        hasMultisig),
      false) && incTrigger();
  }, [address, events, incTrigger]);

  // query all the entries for the multisig, extracting approvals with their hash
  useEffect((): void => {
    const multiModule = api.query.multisig || api.query.utility;

    multiModule && multiModule.multisigs &&
      multiModule.multisigs
        .entries(address)
        .then((infos: [StorageKey, Option<Multisig>][]): void => {
          mountedRef.current && setMultiInfos(
            infos
              .filter(([, opt]) => opt.isSome)
              .map(([key, opt]) => [key.args[1] as H256, opt.unwrap()])
          );
        })
        .catch(console.error);
  }, [address, api, mountedRef, trigger]);

  return multiInfos;
}
