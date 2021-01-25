// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Slash } from './types';

import React, { useCallback } from 'react';

import { AddressMini, AddressSmall, Badge, Checkbox, Expander } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  index: number;
  isSelected: boolean;
  onSelect?: (index: number) => void;
  slash: Slash;
}

function Row ({ index, isSelected, onSelect, slash: { isMine, slash: { others, own, payout, reporters, validator }, total, totalOther } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const _onSelect = useCallback(
    () => onSelect && onSelect(index),
    [index, onSelect]
  );

  return (
    <tr>
      <td className='badge'>
        {isMine && (
          <Badge
            color='red'
            icon='skull-crossbones'
          />
        )}
      </td>
      <td className='address'>
        <AddressSmall value={validator} />
      </td>
      <td className='expand all'>
        {!!others.length && (
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
      <td className='address'>
        {reporters.map((reporter, index): React.ReactNode => (
          <AddressMini
            key={index}
            value={reporter}
          />
        ))}
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
      <td className='number together'>
        <FormatBalance value={payout} />
      </td>
      <td>
        <Checkbox
          isDisabled={!onSelect}
          onChange={_onSelect}
          value={isSelected}
        />
      </td>
    </tr>
  );
}

export default React.memo(Row);
