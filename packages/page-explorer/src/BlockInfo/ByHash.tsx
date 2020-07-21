// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EventRecord, SignedBlock } from '@polkadot/types/interfaces';
import { KeyedEvent } from '@polkadot/react-query/types';

import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderExtended } from '@polkadot/api-derive';
import { AddressSmall, Columar, Column, LinkExternal, Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Events from '../Events';
import Extrinsics from './Extrinsics';
import Logs from './Logs';

interface Props {
  className?: string;
  value: string;
}

function BlockByHash ({ className = '', value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const events = useCall<KeyedEvent[]>(api.query.system.events.at, [value], {
    isSingle: true,
    transform: (events: EventRecord[]): KeyedEvent[] =>
      events.map((record, index) => ({
        indexes: [index],
        key: `${Date.now()}-${index}-${record.hash.toHex()}`,
        record
      }))
  });
  const getBlock = useCall<SignedBlock>(api.rpc.chain.getBlock, [value], { isSingle: true });
  const getHeader = useCall<HeaderExtended>(api.derive.chain.getHeader, [value]);

  const blockNumber = getHeader?.number.unwrap();
  const parentHash = getHeader?.parentHash.toHex();

  return (
    <div className={className}>
      <Table
        header={
          getHeader
            ? [
              [formatNumber(blockNumber), 'start', 1],
              [t('hash'), 'start'],
              [t('parent'), 'start'],
              [t('extrinsics'), 'start'],
              [t('state'), 'start'],
              []
            ]
            : [['...', 'start', 6]]
        }
        isFixed
      >
        {getBlock && !getBlock.isEmpty && getHeader && !getHeader.isEmpty && (
          <tr>
            <td className='address'>
              {getHeader.author && (
                <AddressSmall value={getHeader.author} />
              )}
            </td>
            <td className='hash overflow'>{getHeader.hash.toHex()}</td>
            <td className='hash overflow'><Link to={`/explorer/query/${parentHash || ''}`}>{parentHash}</Link></td>
            <td className='hash overflow'>{getHeader.extrinsicsRoot.toHex()}</td>
            <td className='hash overflow'>{getHeader.stateRoot.toHex()}</td>
            <td>
              <LinkExternal
                data={value}
                type='block'
              />
            </td>
          </tr>
        )}
      </Table>
      {getBlock && getHeader && (
        <>
          <Extrinsics
            blockNumber={blockNumber}
            events={events}
            value={getBlock.block.extrinsics}
          />
          <Columar>
            <Column>
              <Events
                eventClassName='explorer--BlockByHash-block'
                events={events?.filter(({ record: { phase } }) => !phase.isApplyExtrinsic)}
                label={t<string>('system events')}
              />
            </Column>
            <Column>
              <Logs value={getHeader.digest.logs} />
            </Column>
          </Columar>
        </>
      )}
    </div>
  );
}

export default React.memo(BlockByHash);
