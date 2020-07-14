// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveReferendumVote } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Expander, Icon, Tooltip } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import ReferendumVote from './ReferendumVote';

interface Props {
  change: BN;
  className?: string;
  count: number;
  isWinning: boolean;
  index: BN;
  total: BN;
  votes: DeriveReferendumVote[];
}

const LOCKS = [1, 10, 20, 30, 40, 50, 60];

let id = 0;

function ReferendumVotes ({ change, className = '', count, index, isWinning, total, votes }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [trigger] = useState(`votes-${index.toString()}-${++id}`);
  const [sorted, setSorted] = useState<DeriveReferendumVote[]>([]);

  useEffect((): void => {
    setSorted(
      votes.sort((a, b) => {
        const ta = a.balance.muln(LOCKS[a.vote.conviction.toNumber()]).divn(10);
        const tb = b.balance.muln(LOCKS[b.vote.conviction.toNumber()]).divn(10);

        return tb.cmp(ta);
      })
    );
  }, [votes]);

  return (
    <td className={`${className} number`}>
      <Expander
        summary={
          <FormatBalance
            labelPost={count ? ` (${formatNumber(count)})` : '' }
            value={total}
          />
        }
        summarySub={
          change.gtn(0)
            ? (
              <>
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
              </>
            )
            : ''
        }
      >
        {sorted.map((vote) =>
          <ReferendumVote
            key={vote.accountId.toString()}
            vote={vote}
          />
        )}
      </Expander>
    </td>
  );
}

export default React.memo(styled(ReferendumVotes)`
  .ui--Expander .ui--Expander-summary .double-icon {
    margin-bottom: -0.125rem;
    margin-right: 0.375rem;
    margin-top: 0.125rem;
  }

  .ui--Expander-summary {
    .ui--Icon+.ui--Icon {
      margin-left: -0.375rem;
    }
  }
`);
