// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, Hash, ReferendumIndex } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';

import React, { useEffect, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { Option, StorageKey, Vec, createType } from '@polkadot/types';
import { hexToU8a } from '@polkadot/util';

import DispatchEntry from './DispatchEntry';

interface Props {
  entries: Option<Vec<Option<ITuple<[Hash, ReferendumIndex]>>>>;
  keyPrefix: string;
  storageKey: StorageKey;
}

interface Entry {
  blockNumber?: BlockNumber;
  hash: Hash;
  referendumIndex: ReferendumIndex;
}

export default function DispatchBlock ({ entries, keyPrefix, storageKey }: Props): React.ReactElement<Props> | null {
  const [blockNumber, setBlockNumber] = useState<BlockNumber | undefined>();
  const [expanded, setExpanded] = useState<Entry[]>([]);

  useEffect((): void => {
    if (keyPrefix && storageKey) {
      setBlockNumber(createType(registry, 'BlockNumber', hexToU8a(
        `0x${storageKey.toHex().replace(keyPrefix, '').substr(16)}`)
      ));
    }
  }, [keyPrefix, storageKey]);

  useEffect((): void => {
    setExpanded(
      entries?.isSome
        ? entries
          .unwrap()
          .map((entry): [Hash, ReferendumIndex] | null => entry.unwrapOr(null))
          .filter((entry): boolean => !!entry)
          .map(([hash, referendumIndex]: any): Entry => ({
            blockNumber, hash, referendumIndex
          }))
        : []
    );
  }, [blockNumber, entries]);

  if (!expanded.length) {
    return null;
  }

  return (
    <>
      {expanded.map(({ blockNumber, hash, referendumIndex }): React.ReactNode => (
        <DispatchEntry
          blockNumber={blockNumber}
          hash={hash}
          key={referendumIndex.toString()}
          referendumIndex={referendumIndex}
        />
      ))}
    </>
  );
}
