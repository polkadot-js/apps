// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PeerInfo } from '@polkadot/types/interfaces';

import React, { useMemo, useRef } from 'react';

import { styled, Table } from '@polkadot/react-components';
import { formatNumber, stringPascalCase } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  peers?: PeerInfo[] | null;
}

function sortPeers (peers: PeerInfo[]) {
  return peers
    .map(({ bestHash, bestNumber, peerId, roles }) => ({
      bestHash: bestHash.toHex(),
      bestNumber,
      peerId: peerId.toString(),
      roles: stringPascalCase(roles)
    }))
    .sort((a, b) => a.peerId.localeCompare(b.peerId))
    .sort((a, b) => a.roles.localeCompare(b.roles))
    .sort((a, b) => b.bestNumber.cmp(a.bestNumber));
}

function Peers ({ className = '', peers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('connected peers'), 'start', 2],
    [t('best hash'), 'start'],
    [t('best #'), 'number']
  ]);

  const sorted = useMemo(
    () => peers && sortPeers(peers),
    [peers]
  );

  return (
    <StyledTable
      className={className}
      empty={t('no peers connected')}
      header={headerRef.current}
    >
      {sorted?.map(({ bestHash, bestNumber, peerId, roles }) => (
        <tr key={peerId}>
          <td className='roles'>{roles}</td>
          <td className='hash overflow'>{peerId}</td>
          <td className='hash overflow'>{bestHash}</td>
          <td className='number bestNumber'>{formatNumber(bestNumber)}</td>
        </tr>
      ))}
    </StyledTable>
  );
}

const StyledTable = styled(Table)`
  overflow-x: auto;

  td.roles {
    max-width: 9ch;
    width: 9ch;
  }

  td.bestNumber {
    max-width: 11ch;
    width: 11ch;
  }
`;

export default React.memo(Peers);
