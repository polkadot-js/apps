// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveReferendumVote } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useMemo, useState } from 'react';
import { Expander, Icon, Tooltip } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import ReferendumVote from './ReferendumVote';

interface Props {
  change: BN;
  className?: string;
  count: number;
  isAye: boolean;
  isWinning: boolean;
  index: BN;
  total: BN;
  votes: DeriveReferendumVote[];
}

const LOCKS = [1, 10, 20, 30, 40, 50, 60];

let id = 0;

function ReferendumVotes ({ change, className, count, index, isAye, isWinning, total, votes }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [trigger] = useState(`votes-${index.toString()}-${++id}`);

  const sorted = useMemo(
    () => votes.sort((a, b) => {
      const ta = a.balance.muln(LOCKS[a.vote.conviction.toNumber()]).divn(10);
      const tb = b.balance.muln(LOCKS[b.vote.conviction.toNumber()]).divn(10);

      return tb.cmp(ta);
    }),
    [votes]
  );

  if (!count) {
    return null;
  }

  return (
    <Expander
      className={className}
      summary={
        <>
          {isAye
            ? t<string>('Aye {{count}}', { replace: { count: ` (${formatNumber(count)})` } })
            : t<string>('Nay {{count}}', { replace: { count: ` (${formatNumber(count)})` } })
          }
          <div><FormatBalance value={total} /></div>
        </>
      }
      summarySub={
        <div>
          {change.gtn(0) && (
            <div>
              <Icon
                className='double-icon'
                icon={isWinning ? 'arrow-circle-down' : 'arrow-circle-up'}
                tooltip={trigger}
              />
              <FormatBalance value={change} />
              <Tooltip
                text={
                  isWinning
                    ? t<string>('The amount this total can be reduced by to change the referendum outcome. This assumes changes to the convictions of the existing votes, with no additional turnout.')
                    : t<string>('The amount this total should be increased by to change the referendum outcome. This assumes additional turnout with new votes at 1x conviction.')
                }
                trigger={trigger}
              />
            </div>
          )}
        </div>
      }
    >
      {sorted.map((vote) =>
        <ReferendumVote
          key={vote.accountId.toString()}
          vote={vote}
        />
      )}
    </Expander>
  );
}

export default React.memo(ReferendumVotes);
