// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, StorageKey } from '@polkadot/types';
import type { H256, Multisig } from '@polkadot/types/interfaces';

import { useEffect, useRef, useState } from 'react';

import { createNamedHook, useApi, useBlockEvents, useIncrement, useIsMountedRef } from '@polkadot/react-hooks';

function useMultisigApprovalsImpl (address: string): [H256, Multisig][] | undefined {
  const { events } = useBlockEvents();
  const { api } = useApi();
  const [multiInfos, setMultiInfos] = useState<[H256, Multisig][] | undefined>();
  const [trigger, incTrigger] = useIncrement(1);
  const mountedRef = useIsMountedRef();
  const prevEventsRef = useRef<string>('');

  // increment the trigger by looking at all events
  //   - filter the by multisig module (old utility is not supported)
  //   - find anything data item where the type is AccountId
  //   - increment the trigger when at least one matches our address and is different from previous multisig events
  useEffect((): void => {
    const multisigEvents = events.filter(({ record: { event: { data, section } } }) =>
      section === 'multisig' &&
      data.some((item) =>
        item.toRawType() === 'AccountId' &&
        item.eq(address)
      )
    );

    if (multisigEvents.length) {
      const eventsHash = JSON.stringify(multisigEvents.map((e) => e.key));

      if (eventsHash !== prevEventsRef.current) {
        prevEventsRef.current = eventsHash;
        incTrigger();
      }
    }
  }, [address, events, incTrigger]);

  // query all the entries for the multisig, extracting approvals with their hash
  useEffect((): void => {
    trigger && api.query.multisig?.multisigs && api.query.multisig?.multisigs
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

export default createNamedHook('useMultisigApprovals', useMultisigApprovalsImpl);
