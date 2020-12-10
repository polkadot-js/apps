// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import type { KeyedEvent } from '@polkadot/react-query/types';
import type { EventRecord, SignedBlock } from '@polkadot/types/interfaces';
import { HeaderExtended } from '@polkadot/api-derive';
import { AddressSmall, Columar, Column, LinkExternal, Table } from '@polkadot/react-components';
import { useApi, useIsMountedRef } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useLazyQuery } from 'react-apollo';
import { getQuery } from '../apollo-helpers';
import gql from 'graphql-tag';

import Events from '../Events';
import { useTranslation } from '../translate';
import Extrinsics from './Extrinsics';
import Logs from './Logs';

const EXTRINSIC_QUERY = gql`
  query ExtrinsicSearchQuery($filter: String!) {
    extrinsic(order_by: { block_number: desc }, where: {
      hash: { _eq: $filter }
    }) {
      block_number
      extrinsic_index
      is_signed
      signer
      section
      method
      hash
      success
    }
  }
`;

interface Props {
  className?: string;
  error?: Error | null;
  value?: string | null;
  extrinsicIndex?: number | null;
}

// TODO: Same as in ByHash.tsx, should export from there and reuse here
function transformResult ([events, getBlock, getHeader]: [EventRecord[], SignedBlock, HeaderExtended?]): [KeyedEvent[], SignedBlock, HeaderExtended?] {
  return [
    events.map((record, index) => ({
      indexes: [index],
      key: `${Date.now()}-${index}-${record.hash.toHex()}`,
      record
    })),
    getBlock,
    getHeader
  ];
}

function BlockByHash ({ className = '', error, value, extrinsicIndex = 0 }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [[events, getBlock, getHeader], setState] = useState<[KeyedEvent[]?, SignedBlock?, HeaderExtended?]>([]);
  const [myError, setError] = useState<Error | null | undefined>(error);

  useEffect((): void => {
    value && Promise
      .all([
        api.query.system.events.at(value),
        api.rpc.chain.getBlock(value),
        api.derive.chain.getHeader(value)
      ])
      .then((result): void => {
        mountedRef.current && setState(transformResult(result));
      })
      .catch((error: Error): void => {
        mountedRef.current && setError(error);
      });
  }, [api, mountedRef, value]);

  const blockNumber = getHeader?.number.unwrap();
  const parentHash = getHeader?.parentHash.toHex();
  const hasParent = !getHeader?.parentHash.isEmpty;

  return (
    <div className={className}>
      <Table
        header={
          getHeader
            ? [
              ['in block', 'start', 1],
              [t('block hash'), 'start'],
              [t('extrinsics root'), 'start'],
              [t('extrinsic index'), 'start'],
              []
            ]
            : [['...', 'start', 6]]
        }
        isFixed
      >
        {myError
          ? <tr><td colSpan={6}>{t('Unable to retrieve the specified block details. {{error}}', { replace: { error: myError.message } })}</td></tr>
          : getBlock && !getBlock.isEmpty && getHeader && !getHeader.isEmpty && (
            <tr>
              <td className='address'>
                <Link to={`/explorer/query/${blockNumber}`}>{formatNumber(blockNumber)}</Link>
              </td>
              <td className='hash overflow'>
                <Link to={`/explorer/query/${getHeader.hash.toHex()}`}>
                  {getHeader.hash.toHex()}
                </Link>
              </td>
              <td className='hash overflow'>{getHeader.extrinsicsRoot.toHex()}</td>
              <td className='hash overflow'>{extrinsicIndex}</td>
              <td>
                <LinkExternal
                  data={value}
                  type='block'
                />
              </td>
            </tr>
          )
        }
      </Table>
      {getBlock && getHeader && (
        <>
          <Extrinsics
            blockNumber={blockNumber}
            events={events}
            value={getBlock.block.extrinsics}
            extrinsicIndex={extrinsicIndex}
          />
        </>
      )}
    </div>
  );
}

export default React.memo(BlockByHash);
