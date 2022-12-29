// Copyright 2017-2022 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletSocietyBid } from '@polkadot/types/lookup';

import React, { useMemo } from 'react';

import { AddressSmall, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import BidType from './BidType';

interface Props {
  index: number;
  value: PalletSocietyBid;
}

function BidRow ({ index, value: { kind, value, who } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();

  const [voucher, tip] = useMemo(
    () => kind.isVouch
      ? kind.asVouch
      : [null, null],
    [kind]
  );

  const [isBidder, isVoucher] = useMemo(
    (): [boolean, boolean] => {
      const whoSS58 = who.toString();
      const vouchSS58 = voucher && voucher.toString();

      return [
        allAccounts.some((accountId) => accountId === whoSS58),
        vouchSS58
          ? allAccounts.some((accountId) => accountId === vouchSS58)
          : false
      ];
    },
    [allAccounts, voucher, who]
  );

  return (
    <tr>
      <td className='address all'>
        <AddressSmall value={who} />
      </td>
      <td className='start'>
        <BidType value={kind} />
        {kind.isVouch
          ? isVoucher && (
            <TxButton
              accountId={voucher}
              icon='times'
              label={t<string>('Unvouch')}
              params={[index]}
              tx={api.tx.society.unvouch}
            />
          )
          : isBidder && (
            <TxButton
              accountId={who}
              icon='times'
              label={t<string>('Unbid')}
              params={[index]}
              tx={api.tx.society.unbid}
            />
          )
        }
      </td>
      <td className='number'>
        <FormatBalance value={value} />
      </td>
      <td className='number'>
        {tip && (
          <FormatBalance value={tip} />
        )}
      </td>
    </tr>
  );
}

export default React.memo(BidRow);
