// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { StorageKey } from '@polkadot/types';
import type { EventRecord, ParaId } from '@polkadot/types/interfaces';
import type { Campaign, LeasePeriod } from '../types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { AddressMini, Icon, ParaLink, TxButton } from '@polkadot/react-components';
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
  contributors: string[];
  myAccounts: string[];
}

const NO_CONTRIB: Contributions = { contributors: [], myAccounts: [] };

function extractContributors (allAccounts: string[], keys: StorageKey[]): Contributions {
  const contributors = keys.map((k) => encodeAddress(k));

  return {
    contributors,
    myAccounts: contributors.filter((c) => allAccounts.includes(c))
  };
}

function Fund ({ bestNumber, className, isOngoing, leasePeriod, value: { childKey, info: { cap, depositor, end, firstPeriod, lastPeriod, raised }, isCapped, isEnded, isWinner, paraId } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, isAccount } = useAccounts();
  const [{ contributors, myAccounts }, setContributors] = useState<Contributions>(NO_CONTRIB);
  const trigger = useEventTrigger([api.events.crowdloan.Contributed, api.events.crowdloan.Withdrew, api.events.crowdloan.AllRefunded, api.events.crowdloan.PartiallyRefunded], useCallback(
    ({ event: { data } }: EventRecord) =>
      ((data.length === 1
        ? data[0] // AllRefunded, PartiallyRefunded [ParaId]
        : data[1] // Contributed, Withdrew [AccountId, ParaId, Balance]
      ) as ParaId).eq(paraId),
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

  const blocksLeft = useMemo(
    () => bestNumber && end.gt(bestNumber)
      ? end.sub(bestNumber)
      : null,
    [bestNumber, end]
  );

  const percentage = useMemo(
    () => cap.isZero()
      ? '100.00%'
      : `${(raised.muln(10000).div(cap).toNumber() / 100).toFixed(2)}%`,
    [cap, raised]
  );

  const hasEnded = !blocksLeft && !!leasePeriod && (
    isWinner
      ? leasePeriod.currentPeriod.gt(lastPeriod)
      : leasePeriod.currentPeriod.gt(firstPeriod)
  );
  const canContribute = isOngoing && !isCapped && !isWinner && !!blocksLeft;
  const canDissolve = raised.isZero();
  const canWithdraw = !raised.isZero() && hasEnded;

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(paraId)}</h1></td>
      <td className='badge'><ParaLink id={paraId} /></td>
      <td className='media--800'>
        {isWinner
          ? t<string>('Winner')
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
      <td className='all number together media--1100'>
        {blocksLeft && (
          <BlockToTime value={blocksLeft} />
        )}
        #{formatNumber(end)}
      </td>
      <td className='number all together'>
        {firstPeriod.eq(lastPeriod)
          ? formatNumber(firstPeriod)
          : `${formatNumber(firstPeriod)} - ${formatNumber(lastPeriod)}`
        }
      </td>
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
        {contributors.length !== 0 && (
          formatNumber(contributors.length)
        )}
      </td>
      <td className='badge'>
        <Icon
          color={myAccounts.length ? 'green' : 'gray'}
          icon='asterisk'
        />
      </td>
      <td className='button media--1300'>
        {canWithdraw && contributors.length !== 0 && (
          <Refund paraId={paraId} />
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
