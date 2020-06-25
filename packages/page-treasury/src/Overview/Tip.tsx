// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, BlockNumber, OpenTip } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { AddressSmall, AddressMini, Expander, Icon, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { Option } from '@polkadot/types';
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
}

interface TipState {
  closesAt: BlockNumber | null;
  finder: AccountId | null;
  findersFee: Balance | null;
  isFinder: boolean;
  isTipper: boolean;
}

function Tip ({ bestNumber, className = '', hash, isMember, members }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [{ closesAt, finder, findersFee, isFinder, isTipper }, setTipState] = useState<TipState>({ closesAt: null, finder: null, findersFee: null, isFinder: false, isTipper: false });
  const tip = useCall<OpenTip | null>(api.query.treasury.tips, [hash], {
    transform: (optTip: Option<OpenTip>) => optTip.unwrapOr(null)
  });

  useEffect((): void => {
    if (tip) {
      const finderInfo = tip.finder.unwrapOr(null);
      const finder = (finderInfo && finderInfo[0]) || null;

      setTipState({
        closesAt: tip.closes.unwrapOr(null),
        finder,
        findersFee: (finderInfo && finderInfo[1]) || null,
        isFinder: !!finder && allAccounts.includes(finder.toString()),
        isTipper: tip.tips.some(([address]) => allAccounts.includes(address.toString()))
      });
    }
  }, [allAccounts, tip]);

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
        {findersFee && (
          <FormatBalance value={findersFee} />
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
                <>
                  <BlockToTime blocks={closesAt.sub(bestNumber)} />
                  #{formatNumber(closesAt)}
                </>
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
      {isMember && (
        <td className='badge'>
          <Icon
            color={isTipper ? 'green' : 'gray'}
            icon='asterisk'
          />
        </td>
      )}
    </tr>
  );
}

export default React.memo(Tip);
