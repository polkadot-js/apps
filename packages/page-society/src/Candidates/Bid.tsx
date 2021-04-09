// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bid } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { AddressSmall, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import BidType from './BidType';

interface Props {
  index: number;
  value: Bid;
}

function BidRow ({ index, value: { kind, value, who } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();

  const isBidder = useMemo(
    (): boolean => {
      const address = who.toString();

      return allAccounts.some((accountId) => accountId === address);
    },
    [allAccounts, who]
  );

  return (
    <tr>
      <td className='address all'>
        <AddressSmall value={who} />
      </td>
      <BidType value={kind} />
      <td className='number'>
        <FormatBalance value={value} />
      </td>
      <td className='button'>
        <TxButton
          accountId={who}
          icon='times'
          isDisabled={!isBidder}
          label={t<string>('Unbid')}
          params={[index]}
          tx={api.tx.society.unbid}
        />
      </td>
    </tr>
  );
}

export default React.memo(BidRow);
