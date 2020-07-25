// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, BlockNumber, OpenTip, OpenTipTo225 } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddressSmall, AddressMini, Expander, Icon, TxButton } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import TipClose from './TipClose';
import TipEndorse from './TipEndorse';
import TipReason from './TipReason';

interface Props {
  bestNumber?: BlockNumber;
  className?: string;
  hash: string;
  isMember: boolean;
  members: string[];
  tip: OpenTip | OpenTipTo225;
}

interface TipState {
  closesAt: BlockNumber | null;
  deposit: Balance | null;
  finder: AccountId | null;
  isFinder: boolean;
  isTipper: boolean;
}

function isCurrentTip (tip: OpenTip | OpenTipTo225): tip is OpenTip {
  return !!(tip as OpenTip)?.findersFee;
}

function Tip ({ bestNumber, className = '', hash, isMember, members, tip }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const [{ closesAt, deposit, finder, isFinder, isTipper }, setTipState] = useState<TipState>({ closesAt: null, deposit: null, finder: null, isFinder: false, isTipper: false });

  useEffect((): void => {
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

    setTipState({
      closesAt,
      deposit,
      finder,
      isFinder: !!finder && allAccounts.includes(finder.toString()),
      isTipper: tip.tips.some(([address]) => allAccounts.includes(address.toString()))
    });
  }, [allAccounts, hash, tip]);

  const { reason, tips, who } = tip;

  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={who} />
      </td>
      <td className='address'>
        {finder && (
          <AddressMini value={finder} />
        )}
      </td>
      <td className='number'>
        {deposit && !deposit.isEmpty && (
          <FormatBalance value={deposit} />
        )}
      </td>
      <TipReason hash={reason} />
      <td className='start all'>
        {tips.length !== 0 && (
          <Expander summary={t<string>('Tippers ({{count}})', { replace: { count: tips.length } })}>
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
              hash={hash}
              isMember={isMember}
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
      <td className='badge'>
        {isMember && (
          <Icon
            color={isTipper ? 'green' : 'gray'}
            icon='asterisk'
          />
        )}
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
