// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, BlockNumber, OpenTip, OpenTipTo225 } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddressSmall, AddressMini, Expander, Icon, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { Option } from '@polkadot/types';
import { formatNumber, isBoolean } from '@polkadot/util';

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
  setClosed: (hash: string, blockNumber: BlockNumber) => void;
}

interface TipState {
  closesAt: BlockNumber | null;
  deposit: Balance | null;
  finder: AccountId | null;
  isFinder: boolean;
  isTipper: boolean;
}

function isCurrentTip (tip: OpenTip | OpenTipTo225): tip is OpenTip {
  return isBoolean((tip as OpenTip).findersFee);
}

function Tip ({ bestNumber, className = '', hash, isMember, members, setClosed }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [{ closesAt, deposit, finder, isFinder, isTipper }, setTipState] = useState<TipState>({ closesAt: null, deposit: null, finder: null, isFinder: false, isTipper: false });
  const tip = useCall<OpenTip | OpenTipTo225 | null>(api.query.treasury.tips, [hash], {
    transform: (optTip: Option<OpenTip>) => optTip.unwrapOr(null)
  });

  useEffect((): void => {
    if (tip) {
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

      closesAt && setClosed(hash, closesAt);
      setTipState({
        closesAt,
        deposit,
        finder,
        isFinder: !!finder && allAccounts.includes(finder.toString()),
        isTipper: tip.tips.some(([address]) => allAccounts.includes(address.toString()))
      });
    }
  }, [allAccounts, hash, setClosed, tip]);

  if (!tip) {
    return null;
  }

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
      <td className='button'>
        {closesAt
          ? bestNumber && (
            closesAt.gt(bestNumber)
              ? (
                <div className='closingTimer'>
                  <BlockToTime blocks={closesAt.sub(bestNumber)} />
                  #{formatNumber(closesAt)}
                </div>
              )
              : (
                <TipClose
                  hash={hash}
                  isMember={isMember}
                  members={members}
                />
              )
          )
          : (
            <>
              {finder && (
                <TxButton
                  accountId={finder}
                  icon='times'
                  isDisabled={!isFinder}
                  label={t('Cancel')}
                  params={[hash]}
                  tx='treasury.retractTip'
                />
              )}
              <TipEndorse
                hash={hash}
                isMember={isMember}
                members={members}
              />
            </>
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
    padding: 0 0.5rem;
  }
`);
