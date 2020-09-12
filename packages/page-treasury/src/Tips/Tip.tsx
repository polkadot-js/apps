// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, BlockNumber, OpenTip, OpenTipTo225 } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { AddressSmall, AddressMini, Checkbox, Expander, Icon, LinkExternal, TxButton } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { BN_ZERO, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import TipClose from './TipClose';
import TipEndorse from './TipEndorse';
import TipReason from './TipReason';

interface Props {
  bestNumber?: BlockNumber;
  className?: string;
  defaultId: string | null;
  hash: string;
  isMember: boolean;
  members: string[];
  onSelect: (hash: string, isSelected: boolean, value: BN) => void;
  onlyUntipped: boolean;
  tip: OpenTip | OpenTipTo225;
}

interface TipState {
  closesAt: BlockNumber | null;
  deposit: Balance | null;
  finder: AccountId | null;
  isFinder: boolean;
  isTipped: boolean;
  isTipper: boolean;
  median: BN;
}

function isCurrentTip (tip: OpenTip | OpenTipTo225): tip is OpenTip {
  return !!(tip as OpenTip)?.findersFee;
}

function extractTipState (tip: OpenTip | OpenTipTo225, hash: string, allAccounts: string[]): TipState {
  const closesAt = tip.closes.unwrapOr(null);
  let finder: AccountId | null = null;
  let deposit: Balance | null = null;

  if (isCurrentTip(tip)) {
    finder = tip.finder;
    deposit = tip.deposit;
  } else if (tip.finder.isSome) {
    const finderInfo = tip.finder.unwrap();

    finder = finderInfo[0];
    deposit = finderInfo[1];
  }

  const values = tip.tips.map(([, value]) => value).sort((a, b) => a.cmp(b));
  const midIndex = Math.floor(values.length / 2);
  const median = values.length
    ? values.length % 2
      ? values[midIndex]
      : values[midIndex - 1].add(values[midIndex]).divn(2)
    : BN_ZERO;

  return {
    closesAt,
    deposit,
    finder,
    isFinder: !!finder && allAccounts.includes(finder.toString()),
    isTipped: !!values.length,
    isTipper: tip.tips.some(([address]) => allAccounts.includes(address.toString())),
    median
  };
}

function Tip ({ bestNumber, className = '', defaultId, hash, isMember, members, onSelect, onlyUntipped, tip }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();

  const { closesAt, finder, isFinder, isTipped, isTipper, median } = useMemo(
    () => extractTipState(tip, hash, allAccounts),
    [allAccounts, hash, tip]
  );

  const [isMedianSelected, setMedianTip] = useState(false);

  useEffect((): void => {
    onSelect(hash, isMedianSelected, median);
  }, [hash, isMedianSelected, median, onSelect]);

  useEffect((): void => {
    setMedianTip(isMember && !isTipper);
  }, [isMember, isTipper]);

  if (onlyUntipped && !closesAt && isTipper) {
    return null;
  }

  const { reason, tips, who } = tip;

  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={who} />
      </td>
      <td className='address media--1400'>
        {finder && (
          <AddressMini value={finder} />
        )}
      </td>
      <TipReason hash={reason} />
      <td className='expand'>
        {tips.length !== 0 && (
          <Expander summary={
            <>
              <div>{t<string>('Tippers ({{count}})', { replace: { count: tips.length } })}</div>
              <FormatBalance value={median} />
            </>
          }>
            {tips.map(([tipper, balance]) => (
              <AddressMini
                balance={balance}
                key={tipper.toString()}
                value={tipper}
                withBalance
              />
            ))}
          </Expander>
        )}
      </td>
      <td className='button together'>
        {closesAt
          ? (bestNumber && closesAt.gt(bestNumber)) && (
            <div className='closingTimer'>
              <BlockToTime blocks={closesAt.sub(bestNumber)} />
              #{formatNumber(closesAt)}
            </div>
          )
          : finder && (
            <TxButton
              accountId={finder}
              className='media--1400'
              icon='times'
              isDisabled={!isFinder}
              label={t('Cancel')}
              params={[hash]}
              tx='treasury.retractTip'
            />
          )
        }
        {(!closesAt || !bestNumber || closesAt.gt(bestNumber))
          ? (
            <TipEndorse
              defaultId={defaultId}
              hash={hash}
              isMember={isMember}
              isTipped={isTipped}
              median={median}
              members={members}
            />
          )
          : (
            <TipClose
              hash={hash}
              isMember={isMember}
              members={members}
            />
          )
        }
      </td>
      <td className='badge media--1700'>
        {isMember && (
          <Icon
            color={isTipper ? 'green' : 'gray'}
            icon='asterisk'
          />
        )}
      </td>
      <td>
        <Checkbox
          isDisabled={!isMember}
          onChange={setMedianTip}
          value={isMedianSelected}
        />
      </td>
      <td className='links media--1700'>
        <LinkExternal
          data={hash}
          isLogo
          type='tip'
        />
      </td>
    </tr>
  );
}

export default React.memo(styled(Tip)`
  .closingTimer {
    display: inline-block;
    padding: 0 0.5rem;
  }
`);
