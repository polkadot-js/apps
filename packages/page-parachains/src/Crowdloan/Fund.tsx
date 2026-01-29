// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { Campaign, LeasePeriod } from '../types.js';

import React, { useEffect, useMemo, useState } from 'react';

import { AddressMini, Button, Expander, Icon, InputAddress, Modal, ParaLink, Table, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useParaEndpoints, useToggle } from '@polkadot/react-hooks';
import { CallExpander } from '@polkadot/react-params';
import { Available, BlockToTime, FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import Contribute from './Contribute.js';
import Refund from './Refund.js';
import useContributions from './useContributions.js';

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
      <Table.Column.Id value={paraId} />
      <td className='badge'><ParaLink id={paraId} /></td>
      <td className='media--800'>
        {isWinner
          ? t('Winner')
          : blocksLeft
            ? isCapped
              ? t('Capped')
              : isOngoing
                ? t('Active')
                : t('Past')
            : t('Ended')
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
            summary={t('My contributions ({{count}})', { replace: { count: myAccounts.length } })}
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
        {hasLoaded
          ? (
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
          )
          : <span className='--tmp'>999</span>
        }
      </td>
      <td className='button media--1000'>
        {canWithdraw && contributorsHex.length !== 0 && (
          <Refund paraId={paraId} />
        )}
        {canDissolve && (
          <DissolveCrowdloan
            hasEnded={hasEnded}
            isDepositor={isDepositor}
            isEnded={isEnded}
            paraId={paraId}
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
            >{t('Homepage')}</a>&nbsp;&nbsp;&nbsp;
          </div>
        )}
      </td>
    </tr>
  );
}

interface IDissolveCrowdloan{
  isEnded?: boolean;
  paraId: ParaId;
  isDepositor: boolean;
  hasEnded: boolean;
}

function DissolveCrowdloan ({ hasEnded, isDepositor, isEnded, paraId }: IDissolveCrowdloan) {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isDissolveOpen, toggleDissolveOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);

  const extrinsic = useMemo(() => api.tx.crowdloan.dissolve(paraId), [api.tx.crowdloan, paraId]);

  return <>
    {isDissolveOpen && (
      <Modal
        header={t('dissolve crowdloan')}
        onClose={toggleDissolveOpen}
        size='large'
      >
        <Modal.Content>
          <Modal.Columns hint={t('This account will pay the fees for the dissolving crowdloan')}>
            <InputAddress
              label={t('send from account')}
              labelExtra={
                <Available
                  label={<span className='label'>{t('transferable')}</span>}
                  params={accountId}
                />
              }
              onChange={setAccountId}
              type='account'
            />
          </Modal.Columns>
          <Modal.Columns>
            <CallExpander
              isExpanded
              isHeader
              value={extrinsic}
              withHash
            />
          </Modal.Columns>
        </Modal.Content>
        <Modal.Actions>
          <TxButton
            accountId={accountId}
            extrinsic={extrinsic}
            icon='check'
            isDisabled={!(isDepositor || hasEnded)}
            label={t('Submit')}
            onStart={toggleDissolveOpen}
          />
        </Modal.Actions>
      </Modal>
    )}
    <Button
      icon='times'
      isDisabled={!(isDepositor || hasEnded)}
      label={
        isEnded
          ? t('Close')
          : t('Cancel')
      }
      onClick={toggleDissolveOpen}
    />
  </>;
}

export default React.memo(Fund);
