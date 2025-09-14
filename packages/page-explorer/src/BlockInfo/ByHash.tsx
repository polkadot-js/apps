// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';
import type { KeyedEvent } from '@polkadot/react-hooks/ctx/types';
import type { V2Weight } from '@polkadot/react-hooks/useWeight';
import type { EventRecord, Hash, RuntimeVersionPartial, SignedBlock } from '@polkadot/types/interfaces';
import type { FrameSupportDispatchPerDispatchClassWeight } from '@polkadot/types/lookup';

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { AddressSmall, Columar, CopyButton, LinkExternal, MarkError, styled, Table } from '@polkadot/react-components';
import { useApi, useIsMountedRef } from '@polkadot/react-hooks';
import { convertWeight } from '@polkadot/react-hooks/useWeight';
import { formatNumber, isBn } from '@polkadot/util';

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
  blockWeight?: FrameSupportDispatchPerDispatchClassWeight | null;
  getBlock?: SignedBlock;
  getHeader?: HeaderExtended;
  nextBlockHash?: Hash | null;
  runtimeVersion?: RuntimeVersionPartial;
}

const EMPTY_HEADER: [React.ReactNode?, string?, number?][] = [['...', 'start', 6]];

function transformResult ([[runtimeVersion, events, blockWeight], getBlock, getHeader]: [[RuntimeVersionPartial, EventRecord[] | null, FrameSupportDispatchPerDispatchClassWeight|null], SignedBlock, HeaderExtended?]): State {
  return {
    blockWeight,
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
  const [{ blockWeight, events, getBlock, getHeader, nextBlockHash, runtimeVersion }, setState] = useState<State>({});
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
                }),
              apiAt.query.system
                .blockWeight()
                .catch(() => {
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

  useEffect((): (() => void) | undefined => {
    if (!mountedRef.current || !getHeader?.number) {
      return;
    }

    const nextBlockNumber = getHeader.number.unwrap().addn(1);
    let unsub: (() => void) | undefined;

    api.rpc.chain.getBlockHash(nextBlockNumber)
      .then((hash) => {
        if (!hash.isEmpty) {
          setState((prev) => ({
            ...prev,
            nextBlockHash: hash
          }));
        } else {
          // Subscribe to new block headers until the next block is found, then unsubscribes.
          api.derive.chain.subscribeNewHeads((header: HeaderExtended): void => {
            if (mountedRef.current && header.number.unwrap().eq(nextBlockNumber)) {
              setState((prev) => ({
                ...prev,
                nextBlockHash: header.hash
              }));
              unsub && unsub();
            }
          }).then((_unsub) => {
            unsub = _unsub;
          }).catch((error: Error) => {
            mountedRef.current && setBlkError(error);
          });
        }
      })
      .catch((error: Error) => {
        mountedRef.current && setBlkError(error);
      });

    return (): void => {
      unsub && unsub();
    };
  }, [api, getHeader?.number, mountedRef]);

  const header = useMemo<[React.ReactNode?, string?, number?][]>(
    () => getHeader
      ? [
        [formatNumber(getHeader.number.unwrap()), 'start --digits', 1],
        [t('hash'), 'start'],
        [t('parent'), 'start'],
        [t('next'), 'start'],
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
        blockWeight={blockWeight}
        events={events}
        maxBlockWeight={(maxBlockWeight as V2Weight).refTime.toBn()}
        maxProofSize={isBn(maxBlockWeight.proofSize) ? maxBlockWeight.proofSize : (maxBlockWeight as V2Weight).proofSize.toBn()}
        signedBlock={getBlock}
      />
      <StyledTable header={header}>
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
                  ? (
                    <span className='inline-hash-copy'>
                      <Link to={`/explorer/query/${parentHash || ''}`}>{parentHash}</Link>
                      <CopyButton value={parentHash} />
                    </span>
                  )
                  : parentHash
              }</td>
              <td className='hash overflow'>{
                nextBlockHash
                  ? (
                    <span className='inline-hash-copy'>
                      <Link to={`/explorer/query/${nextBlockHash.toHex()}`}>{nextBlockHash.toHex()}</Link>
                      <CopyButton value={nextBlockHash.toHex()} />
                    </span>
                  )
                  : t('Waiting for next block...')
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
      </StyledTable>
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

const StyledTable = styled(Table)`
  .inline-hash-copy {
    align-items: center;
    display: inline-flex;
    gap: 0.25em;
    width: 100%;

    a {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

export default React.memo(BlockByHash);
