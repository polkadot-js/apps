// Copyright 2017-2024 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';
import type { KeyedEvent } from '@polkadot/react-hooks/ctx/types';
import type { V2Weight } from '@polkadot/react-hooks/useWeight';
import type { EventRecord, RuntimeVersionPartial, SignedBlock } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { AddressSmall, Columar, LinkExternal, MarkError, Table } from '@polkadot/react-components';
import { useApi, useIsMountedRef } from '@polkadot/react-hooks';
import { convertWeight } from '@polkadot/react-hooks/useWeight';
import { formatNumber } from '@polkadot/util';

import Events from '../Events.js';
import { useTranslation } from '../translate.js';
import Extrinsics from './Extrinsics.js';
import Justifications from './Justifications.js';
import Logs from './Logs.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
  error?: Error | null;
  value?: string | null;
}

interface State {
  events?: KeyedEvent[] | null;
  getBlock?: SignedBlock;
  getHeader?: HeaderExtended;
  runtimeVersion?: RuntimeVersionPartial;
}

const EMPTY_HEADER: [React.ReactNode?, string?, number?][] = [['...', 'start', 6]];

function transformResult ([[runtimeVersion, events], getBlock, getHeader]: [[RuntimeVersionPartial, EventRecord[] | null], SignedBlock, HeaderExtended?]): State {
  return {
    events: events?.map((record, index) => ({
      indexes: [index],
      key: `${Date.now()}-${index}-${record.hash.toHex()}`,
      record
    })),
    getBlock,
    getHeader,
    runtimeVersion
  };
}

function BlockByHash ({ className = '', error, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [{ events, getBlock, getHeader, runtimeVersion }, setState] = useState<State>({});
  const [blkError, setBlkError] = useState<Error | null | undefined>(error);
  const [evtError, setEvtError] = useState<Error | null | undefined>();

  const [isVersionCurrent, maxBlockWeight] = useMemo(
    () => [
      !!runtimeVersion && api.runtimeVersion.specName.eq(runtimeVersion.specName) && api.runtimeVersion.specVersion.eq(runtimeVersion.specVersion),
      api.consts.system.blockWeights && api.consts.system.blockWeights.maxBlock && convertWeight(api.consts.system.blockWeights.maxBlock).v2Weight
    ],
    [api, runtimeVersion]
  );

  useEffect((): void => {
    error && setBlkError(error);
  }, [error]);

  const systemEvents = useMemo(
    () => events?.filter(({ record: { phase } }) => !phase.isApplyExtrinsic),
    [events]
  );

  useEffect((): void => {
    value && Promise
      .all([
        api
          .at(value)
          .then((apiAt) =>
            Promise.all([
              Promise.resolve(apiAt.runtimeVersion),
              apiAt.query.system
                .events()
                .catch((error: Error) => {
                  mountedRef.current && setEvtError(error);

                  return null;
                })
            ])
          ),
        api.rpc.chain.getBlock(value),
        api.derive.chain.getHeader(value)
      ])
      .then((result): void => {
        mountedRef.current && setState(transformResult(result));
      })
      .catch((error: Error): void => {
        mountedRef.current && setBlkError(error);
      });
  }, [api, mountedRef, value]);

  const header = useMemo<[React.ReactNode?, string?, number?][]>(
    () => getHeader
      ? [
        [formatNumber(getHeader.number.unwrap()), 'start --digits', 1],
        [t('hash'), 'start'],
        [t('parent'), 'start'],
        [t('extrinsics'), 'start media--1300'],
        [t('state'), 'start media--1200'],
        [runtimeVersion ? `${runtimeVersion.specName.toString()}/${runtimeVersion.specVersion.toString()}` : undefined, 'media--1000']
      ]
      : EMPTY_HEADER,
    [getHeader, runtimeVersion, t]
  );

  const blockNumber = getHeader?.number.unwrap();
  const parentHash = getHeader?.parentHash.toHex();
  const hasParent = !getHeader?.parentHash.isEmpty;

  return (
    <div className={className}>
      <Summary
        events={events}
        maxBlockWeight={(maxBlockWeight as V2Weight).refTime.toBn()}
        maxProofSize={(maxBlockWeight as V2Weight).proofSize.toBn()}
        signedBlock={getBlock}
      />
      <Table header={header}>
        {blkError
          ? (
            <tr>
              <td colSpan={6}>
                <MarkError content={t('Unable to retrieve the specified block details. {{error}}', { replace: { error: blkError.message } }) } />
              </td>
            </tr>
          )
          : getBlock && getHeader && !getBlock.isEmpty && !getHeader.isEmpty && (
            <tr>
              <td className='address'>
                {getHeader.author && (
                  <AddressSmall value={getHeader.author} />
                )}
              </td>
              <td className='hash overflow'>{getHeader.hash.toHex()}</td>
              <td className='hash overflow'>{
                hasParent
                  ? <Link to={`/explorer/query/${parentHash || ''}`}>{parentHash}</Link>
                  : parentHash
              }</td>
              <td className='hash overflow media--1300'>{getHeader.extrinsicsRoot.toHex()}</td>
              <td className='hash overflow media--1200'>{getHeader.stateRoot.toHex()}</td>
              <td className='media--1000'>
                {value && (
                  <LinkExternal
                    data={value}
                    type='block'
                  />
                )}
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
            maxBlockWeight={(maxBlockWeight as V2Weight).refTime.toBn()}
            value={getBlock.block.extrinsics}
            withLink={isVersionCurrent}
          />
          <Columar>
            <Columar.Column>
              <Events
                error={evtError}
                eventClassName='explorer--BlockByHash-block'
                events={systemEvents}
                label={t('system events')}
              />
            </Columar.Column>
            <Columar.Column>
              <Logs value={getHeader.digest.logs} />
              <Justifications value={getBlock.justifications} />
            </Columar.Column>
          </Columar>
        </>
      )}
    </div>
  );
}

export default React.memo(BlockByHash);
