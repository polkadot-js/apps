// Copyright 2017-2022 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { Campaign, LeasePeriod } from '../types';

import React, { useEffect, useMemo, useState } from 'react';

import { AddressMini, Expander, Icon, ParaLink, Spinner, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useParaEndpoints } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Contribute from './Contribute';
import Refund from './Refund';
import useContributions from './useContributions';

interface Props {
  bestHash?: string;
  bestNumber?: BN;
  className?: string;
  isOngoing?: boolean;
  leasePeriod?: LeasePeriod;
  value: Campaign;
}

interface LastChange {
  prevHash: string;
  prevLength: number;
}

function Fund ({ bestHash, bestNumber, className = '', isOngoing, leasePeriod, value: { info: { cap, depositor, end, firstPeriod, lastPeriod, raised, verifier }, isCapped, isEnded, isWinner, paraId } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isAccount } = useAccounts();
  const endpoints = useParaEndpoints(paraId);
  const { blockHash, contributorsHex, hasLoaded, myAccounts, myAccountsHex, myContributions } = useContributions(paraId);
  const [lastChange, setLastChange] = useState<LastChange>(() => ({ prevHash: '', prevLength: 0 }));

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
  const homepage = endpoints.length !== 0 && endpoints[0].homepage;

  useEffect((): void => {
    setLastChange((prev): LastChange => {
      const prevLength = contributorsHex.length;

      return prev.prevLength !== prevLength
        ? { prevHash: blockHash, prevLength }
        : prev;
    });
  }, [contributorsHex, blockHash]);

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
      <td className='address media--2000'><AddressMini value={depositor} /></td>
      <td className='all number together media--1200'>
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
        />&nbsp;/&nbsp;<FormatBalance value={cap} />
        <div>{percentage}</div>
        {myAccounts.length !== 0 && (
          <Expander
            summary={t<string>('My contributions ({{count}})', { replace: { count: myAccounts.length } })}
            withBreaks
          >
            {myAccounts.map((a, index) => (
              <AddressMini
                balance={myContributions[myAccountsHex[index]]}
                key={a}
                value={a}
                withBalance
              />
            ))}
          </Expander>
        )}
      </td>
      <td className='number together media--1100'>
        {!hasLoaded
          ? <Spinner noLabel />
          : (
            <>
              {bestHash && (
                <Icon
                  color={
                    lastChange.prevHash === bestHash
                      ? 'green'
                      : 'transparent'
                  }
                  icon='chevron-up'
                  isPadded
                />
              )}
              {contributorsHex.length !== 0 && (
                formatNumber(contributorsHex.length)
              )}
            </>
          )}
      </td>
      <td className='button media--1000'>
        {canWithdraw && contributorsHex.length !== 0 && (
          <Refund paraId={paraId} />
        )}
        {canDissolve && (
          <TxButton
            accountId={depositor}
            className='media--1400'
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
            needsSignature={verifier.isSome}
            paraId={paraId}
            raised={raised}
          />
        )}
        {isOngoing && homepage && (
          <div>
            <a
              href={homepage}
              rel='noopener noreferrer'
              target='_blank'
            >{t<string>('Homepage')}</a>&nbsp;&nbsp;&nbsp;
          </div>
        )}
      </td>
    </tr>
  );
}

export default React.memo(Fund);
