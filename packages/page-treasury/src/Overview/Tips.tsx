// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate';
import Tip from './Tip';

interface Props {
  className?: string;
  hashes?: string[] | null;
  isMember: boolean;
  members: string[];
}

function Tips ({ className = '', hashes, isMember, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const [closed, setClosed] = useState<Record<string, BlockNumber>>({});
  const [sorted, setSorted] = useState<string[]>([]);

  useEffect((): void => {
    hashes && setSorted(
      hashes.sort((a, b) => (closed[a] || BN_ZERO).cmp(closed[b] || BN_ZERO))
    );
  }, [closed, hashes]);

  const _setClosed = useCallback(
    (hash: string, blockNumber: BlockNumber) =>
      setClosed((closed) => ({
        ...closed,
        [hash]: blockNumber
      })),
    []
  );

  const header = useMemo(() => [
    [t('tips'), 'start'],
    [t('finder'), 'address'],
    [t('deposit')],
    [t('reason'), 'start'],
    [],
    [],
    [undefined, 'badge']
  ].filter((v) => v), [t]);

  return (
    <Table
      className={className}
      empty={!sorted.length && t<string>('No open tips')}
      header={header}
    >
      {sorted.length !== 0 && sorted.map((hash): React.ReactNode => (
        <Tip
          bestNumber={bestNumber}
          hash={hash}
          isMember={isMember}
          key={hash}
          members={members}
          setClosed={_setClosed}
        />
      ))}
    </Table>
  );
}

export default React.memo(Tips);
