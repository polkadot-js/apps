// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { EventRecord, ParaId } from '@polkadot/types/interfaces';
import type { Campaign } from '../types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { AddressMini, Digits, ParaLink, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useEventTrigger } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import FundContribute from './FundContribute';

interface Props {
  bestNumber?: BN;
  className?: string;
  isOngoing?: boolean;
  value: Campaign;
}

function Fund ({ bestNumber, className, isOngoing, value: { childKey, info: { cap, depositor, end, firstSlot, lastSlot, raised, retiring }, isCapped, isEnded, isRetired, isWinner, paraId, retireEnd } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [contributors, setContributors] = useState<string[] | null>();
  const trigger = useEventTrigger([api.events.crowdloan.Contributed], useCallback(
    ({ event: { data: [, fundIndex] } }: EventRecord) =>
      (fundIndex as ParaId).eq(paraId),
    [paraId]
  ));

  useEffect((): void => {
    trigger &&
      api.rpc.childstate
        .getKeys(childKey, '0x')
        .then((keys) => setContributors(keys.map((k) => k.toHex())))
        .catch(console.error);
  }, [api, childKey, trigger]);

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
      <td className='address'><AddressMini value={depositor} /></td>
      {!isOngoing && (
        <td className='all number together'>
          {retiringLeft && retiring.isTrue && (
            <BlockToTime value={retiringLeft} />
          )}
          {!blocksLeft && <>#{formatNumber(retireEnd)}</>}
        </td>
      )}
      <td className='all number together'>
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
      <td className='number'>
        {contributors && (
          formatNumber(contributors.length)
        )}
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
