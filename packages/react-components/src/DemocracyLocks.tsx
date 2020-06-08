// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveDemocracyLock } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { BN_ZERO, bnMax, formatBalance, formatNumber } from '@polkadot/util';

import { useTranslation } from './translate';
import Icon from './Icon';
import Tooltip from './Tooltip';

interface Props {
  className?: string;
  value?: DeriveDemocracyLock[];
}

let id = 0;

function DemocracyLocks ({ className = '', value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<BN>(api.derive.chain.bestNumber, []);
  const [trigger] = useState(`${Date.now()}-democracy-locks-${++id}`);

  if (!value || !value.length || !bestNumber) {
    return null;
  }

  const max = bnMax(...value.map(({ balance }) => balance));
  const mapped = value
    .map((info): [DeriveDemocracyLock, BN] => [info, info.unlockAt.gt(bestNumber) ? info.unlockAt.sub(bestNumber) : BN_ZERO])
    .sort((a, b) => a[1].cmp(b[1]));

  return (
    <div className={className}>
      <Icon
        data-for={trigger}
        data-tip
        name='clock'
      />
      <FormatBalance value={max} />
      <Tooltip
        text={mapped.map(([{ balance, isFinished, referendumId, vote }, blocks], index): React.ReactNode => (
          <div
            className='row'
            key={index}
          >
            <div>#{referendumId.toString()} {formatBalance(balance, { forceUnit: '-' })} {vote.conviction.toString()}</div>
            <div className='faded'>
              {blocks.gt(BN_ZERO)
                ? (
                  <BlockToTime
                    blocks={blocks}
                    label={`${t<string>('{{blocks}} blocks', { replace: { blocks: formatNumber(blocks) } })}, `}
                  />
                )
                : isFinished
                  ? t<string>('lock expired')
                  : t<string>('ongoing referendum')
              }
            </div>
          </div>
        ))}
        trigger={trigger}
      />
    </div>
  );
}

export default React.memo(styled(DemocracyLocks)`
  white-space: nowrap;

  i.icon {
    margin-left: 0;
    margin-right: 0.25rem;
  }

  .ui--FormatBalance {
    display: inline-block;
  }
`);
