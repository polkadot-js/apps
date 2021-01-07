// Copyright 2017-2021 @polkadot/app-nodeinfo authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PeerInfo } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';
import styled from 'styled-components';

import { Table } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  peers?: PeerInfo[] | null;
}

function Peers ({ className = '', peers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('connected peers'), 'start'],
    [t('role'), 'start'],
    [t('best #'), 'number'],
    [t('best hash'), 'hash']
  ]);

  return (
    <Table
      className={className}
      empty={t<string>('no peers connected')}
      header={headerRef.current}
    >
      {peers?.sort((a, b): number => b.bestNumber.cmp(a.bestNumber)).map((peer) => (
        <tr key={peer.peerId.toString()}>
          <td className='hash'>{peer.peerId.toString()}</td>
          <td>{peer.roles.toString().toLowerCase()}</td>
          <td className='number all'>{formatNumber(peer.bestNumber)}</td>
          <td className='hash'>{peer.bestHash.toHex()}</td>
        </tr>
      ))}
    </Table>
  );
}

export default React.memo(styled(Peers)`
  overflow-x: auto;
`);
