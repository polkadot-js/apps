// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { StorageKey } from '@polkadot/types';
import type { EventRecord, ParaId } from '@polkadot/types/interfaces';
import type { Campaign, LeasePeriod } from '../types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { AddressMini, Digits, Icon, ParaLink, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useEventTrigger } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';

import { useTranslation } from '../translate';
import Contribute from './Contribute';
import Refund from './Refund';

interface Props {
  bestNumber?: BN;
  className?: string;
  isOngoing?: boolean;
  leasePeriod?: LeasePeriod;
  value: Campaign;
}

interface Contributions {
  uniqueKeys: string[];
  myAccounts: string[];
}

const NO_CONTRIB: Contributions = { myAccounts: [], uniqueKeys: [] };

function extractContributors (allAccounts: string[], keys: StorageKey[]): Contributions {
  const uniqueKeys = keys.map((k) => k.toHex());
  const contributors = keys.map((k) => encodeAddress(k));

  return {
    myAccounts: contributors.filter((c) => allAccounts.includes(c)),
    uniqueKeys
  };
}

function Fund ({ bestNumber, className, isOngoing, leasePeriod, value: { childKey, info: { cap, depositor, end, firstSlot, lastSlot, raised, retiring }, isCapped, isEnded, isRetired, isWinner, paraId, retireEnd } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, isAccount } = useAccounts();
  const [{ myAccounts, uniqueKeys }, setContributors] = useState<Contributions>(NO_CONTRIB);
  const trigger = useEventTrigger([api.events.crowdloan.Contributed, api.events.crowdloan.Withdrew], useCallback(
    ({ event: { data: [, fundIndex] } }: EventRecord) =>
      (fundIndex as ParaId).eq(paraId),
    [paraId]
  ));

  useEffect((): void => {
    trigger &&
      api.rpc.childstate
        .getKeys(childKey, '0x')
        .then((keys) => setContributors(
          extractContributors(allAccounts, keys))
        )
        .catch(console.error);
  }, [allAccounts, api, childKey, trigger]);

  const isDepositor = useMemo(
    () => isAccount(depositor.toString()),
    [depositor, isAccount]
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

  const isLeaseOver = !blocksLeft && !!leasePeriod && (
    isWinner
      ? leasePeriod.currentPeriod.gt(lastSlot)
      : leasePeriod.currentPeriod.gt(firstSlot)
  );
  const canContribute = !!blocksLeft && isOngoing && !isCapped && !isWinner && retiring.isFalse;
  const canDissolve = raised.isZero() || (retiring.isTrue && isLeaseOver);
  const canWithdraw = !raised.isZero() && isLeaseOver;

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(paraId)}</h1></td>
      <td className='badge'><ParaLink id={paraId} /></td>
      <td>
        {isWinner
          ? t<string>('Winner')
          : isRetired
            ? retiring.isTrue
              ? t<string>('Retired')
              : t<string>('Completed')
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
        {uniqueKeys.length !== 0 && (
          formatNumber(uniqueKeys.length)
        )}
      </td>
      <td className='badge'>
        <Icon
          color={myAccounts.length ? 'green' : 'gray'}
          icon='asterisk'
        />
      </td>
      <td className='button'>
        {canWithdraw && uniqueKeys.length !== 0 && (
          <Refund
            allAccounts={uniqueKeys}
            myAccounts={myAccounts}
            paraId={paraId}
          />
        )}
        {canDissolve && (
          <TxButton
            accountId={depositor}
            icon='times'
            isDisabled={!isDepositor}
            label={
              isEnded
                ? t<string>('Close')
                : t<string>('Cancel')
            }
            params={[paraId]}
            tx={api.tx.crowdloan.dissolve}
          />
        )}
        {isOngoing && canContribute && (
          <Contribute
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
