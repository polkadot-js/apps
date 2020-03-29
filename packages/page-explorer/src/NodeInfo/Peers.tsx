// Copyright 2017-2020 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PeerInfo } from '@polkadot/types/interfaces';

import React from 'react';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import { Table } from '@polkadot/react-components';

interface Props {
  className?: string;
  peers?: PeerInfo[] | null;
}

function Peers ({ className, peers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Table className={className}>
      <Table.Head>
        <th className='start' colSpan={2}><h1>{t('connected peers')}</h1></th>
        <th className='number'>{t('best #')}</th>
        <th className='start'>{t('best hash')}</th>
      </Table.Head>
      <Table.Body empty={t('no peers connected')}>
        {peers?.sort((a, b): number => b.bestNumber.cmp(a.bestNumber)).map((peer) => (
          <tr key={peer.peerId.toString()}>
            <td>{peer.roles.toString().toLowerCase()}</td>
            <td className='hash'>{peer.peerId.toString()}</td>
            <td className='number'>{formatNumber(peer.bestNumber)}</td>
            <td className='hash'>{peer.bestHash.toHex()}</td>
          </tr>
        ))}
      </Table.Body>
    </Table>
  );
}

export default React.memo(Peers);
