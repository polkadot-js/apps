// Copyright 2017-2020 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PeerInfo } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import { Table } from '@polkadot/react-components';

interface Props {
  className?: string;
  peers?: PeerInfo[] | null;
}

function Peers ({ className = '', peers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const header = useMemo(() => [
    [t('connected peers'), 'start'],
    [t('role'), 'start'],
    [t('best #'), 'number'],
    [t('best hash'), 'hash']
  ], [t]);

  return (
    <Table
      className={className}
      empty={t<string>('no peers connected')}
      header={header}
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
