// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Slash } from './types';

import React from 'react';
import { AddressMini, AddressSmall, Expander } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  slash: Slash;
}

function Row ({ slash: { slash: { others, own, payout, reporters, validator }, total, totalOther } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <tr>
      <td className='address'>
        <AddressSmall value={validator} />
      </td>
      <td className='start all'>
        {others.length && (
          <Expander summary={t<string>('Nominators ({{count}})', { replace: { count: formatNumber(others.length) } })}>
            {others.map(([accountId, balance], index): React.ReactNode => (
              <AddressMini
                balance={balance}
                key={index}
                value={accountId}
                withBalance
              />
            ))}
          </Expander>
        )}
      </td>
      <td className='number together'>
        <FormatBalance value={own} />
      </td>
      <td className='number together'>
        <FormatBalance value={totalOther} />
      </td>
      <td className='number together'>
        <FormatBalance value={total} />
      </td>
      <td className='address'>
        {reporters.map((reporter, index): React.ReactNode => (
          <AddressMini
            key={index}
            value={reporter}
          />
        ))}
      </td>
      <td className='number together'>
        <FormatBalance value={payout} />
      </td>
    </tr>
  );
}

export default React.memo(Row);
