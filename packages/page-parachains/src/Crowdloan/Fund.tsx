// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { EventRecord, ParaId } from '@polkadot/types/interfaces';
import type { Campaign } from '../types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { AddressMini, Digits, Icon, ParaLink, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useEventTrigger } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';

import { useTranslation } from '../translate';
import FundContribute from './FundContribute';

interface Props {
  bestNumber?: BN;
  className?: string;
  isOngoing?: boolean;
  value: Campaign;
}

interface Contributions {
  uniqueCount?: number;
  myAccounts?: string[];
}

function Fund ({ bestNumber, className, isOngoing, value: { childKey, info: { cap, depositor, end, firstSlot, lastSlot, raised, retiring }, isCapped, isEnded, isRetired, isWinner, paraId, retireEnd } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [{ myAccounts, uniqueCount }, setContributors] = useState<Contributions>({});
  const trigger = useEventTrigger([api.events.crowdloan.Contributed], useCallback(
    ({ event: { data: [, fundIndex] } }: EventRecord) =>
      (fundIndex as ParaId).eq(paraId),
    [paraId]
  ));

  useEffect((): void => {
    trigger &&
      api.rpc.childstate
        .getKeys(childKey, '0x')
        .then((keys) => setContributors((): Contributions => {
          const contributors = keys.map((k) => encodeAddress(k));

          return {
            myAccounts: contributors.filter((c) => allAccounts.includes(c)),
            uniqueCount: contributors.length
          };
        }))
        .catch(console.error);
  }, [allAccounts, api, childKey, trigger]);

  const isDepositor = useMemo(
    (): boolean => {
      const address = depositor.toString();

      return allAccounts.some((a) => a === address);
    },
    [allAccounts, depositor]
  );

  const [blocksLeft, retiringLeft] = useMemo(
    () => bestNumber
      ? [
        end.gt(bestNumber)
          ? end.sub(bestNumber)
          : null,
        retireEnd?.gt(bestNumber)
          ? retireEnd.sub(bestNumber)
          : null
      ]
      : [null, null],
    [bestNumber, end, retireEnd]
  );

  // TODO Dissolve should look at retirement and the actual period

  const percentage = useMemo(
    () => cap.isZero()
      ? '100.00%'
      : `${(raised.muln(10000).div(cap).toNumber() / 100).toFixed(2)}%`,
    [cap, raised]
  );

  const canContribute = isOngoing && blocksLeft && !isCapped && !isWinner && retiring.isFalse;
  const canDissolve = raised.isZero() || isRetired;

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(paraId)}</h1></td>
      <td className='badge'><ParaLink id={paraId} /></td>
      <td>
        {isWinner
          ? t<string>('Winner')
          : isRetired
            ? t<string>('Retired')
            : retiring.isTrue
              ? t<string>('Retiring')
              : blocksLeft
                ? isCapped
                  ? t<string>('Capped')
                  : isOngoing
                    ? t<string>('Active')
                    : t<string>('Past')
                : t<string>('Ended')
        }
      </td>
      <td className='address media--1400'><AddressMini value={depositor} /></td>
      {!isOngoing && (
        <td className='all number together'>
          {(isRetired || retiring.isTrue) && (
            <>
              {retiringLeft && (
                <BlockToTime value={retiringLeft} />
              )}
              #{formatNumber(retireEnd)}
            </>
          )}
        </td>
      )}
      <td className={`all number together${isOngoing ? '' : ' media--1200'}`}>
        {blocksLeft && (
          <BlockToTime value={blocksLeft} />
        )}
        #{formatNumber(end)}
      </td>
      <td className='number'><Digits value={`${formatNumber(firstSlot)} - ${formatNumber(lastSlot)}`} /></td>
      <td className='number together'>
        <FormatBalance
          value={raised}
          withCurrency={false}
        />&nbsp;/&nbsp;<FormatBalance
          value={cap}
        />
        <div>{percentage}</div>
      </td>
      <td className='number media--1100'>
        {uniqueCount && (
          formatNumber(uniqueCount)
        )}
      </td>
      <td className='badge'>
        <Icon
          color={myAccounts?.length ? 'green' : 'gray'}
          icon='asterisk'
        />
      </td>
      <td className='button'>
        {canDissolve && (
          <TxButton
            accountId={depositor}
            icon='times'
            isDisabled={!isDepositor}
            label={
              isEnded
                ? t<string>('Dissolve')
                : t<string>('Cancel')
            }
            params={[paraId]}
            tx={api.tx.crowdloan.dissolve}
          />
        )}
        {isOngoing && canContribute && (
          <FundContribute
            cap={cap}
            paraId={paraId}
            raised={raised}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(Fund);
