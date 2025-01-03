// Copyright 2017-2025 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletSocietyBid } from '@polkadot/types/lookup';

import React, { useMemo } from 'react';

import { AddressSmall, Table, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import BidType from './BidType.js';

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
      const vouchSS58 = voucher?.toString();

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
              label={t('Unvouch')}
              params={[index]}
              tx={api.tx.society.unvouch}
            />
          )
          : isBidder && (
            <TxButton
              accountId={who}
              icon='times'
              label={t('Unbid')}
              params={[index]}
              tx={api.tx.society.unbid}
            />
          )
        }
      </td>
      <Table.Column.Balance value={value} />
      <Table.Column.Balance value={tip} />
    </tr>
  );
}

export default React.memo(BidRow);
