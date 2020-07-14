// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Bid } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { AddressSmall, TxButton } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';

interface Props {
  index: number;
  value: Bid;
}

function BidRow ({ index, value: { kind, value, who } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const [isBidder, setIsBidder] = useState(false);

  useEffect((): void => {
    const address = who.toString();

    setIsBidder(allAccounts.some((accountId) => accountId === address));
  }, [allAccounts, who]);

  return (
    <tr>
      <td className='all top'>
        <AddressSmall value={who} />
      </td>
      <td className='number top'>
        {kind.type}
      </td>
      <td className='number top'>
        <FormatBalance value={value} />
      </td>
      <td className='button'>
        <TxButton
          accountId={who}
          icon='times'
          isDisabled={!isBidder}
          label={t<string>('Unbid')}
          params={[index]}
          tx='society.unbid'
        />
      </td>
    </tr>
  );
}

export default React.memo(BidRow);
