// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EventRecord, SignedBlock } from '@polkadot/types/interfaces';

import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderExtended } from '@polkadot/api-derive';
import { AddressMini, Columar, Column, LinkExternal, Table } from '@polkadot/react-components';
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

function BlockByHash ({ className, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const events = useCall<EventRecord[]>(api.query.system.events.at, [value], { isSingle: true });
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
                <AddressMini value={getHeader.author} />
              )}
            </td>
            <td className='hash overflow'>{getHeader.hash.toHex()}</td>
            <td className='hash overflow'><Link to={`/explorer/query/${parentHash}`}>{parentHash}</Link></td>
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
                events={(events || []).filter(({ phase }) => !phase.isApplyExtrinsic)}
                label={t('system events')}
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
