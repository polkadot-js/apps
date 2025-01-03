// Copyright 2017-2025 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveReferendumVote } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';

import React, { useCallback, useMemo } from 'react';

import { ExpanderScroll } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { BN_TEN, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import ReferendumVote from './ReferendumVote.js';

interface Props {
  change: BN;
  className?: string;
  count: number;
  isAye: boolean;
  isWinning: boolean;
  total: BN;
  votes: DeriveReferendumVote[];
}

const LOCKS = [1, 10, 20, 30, 40, 50, 60];

function ReferendumVotes ({ className, count, isAye, total, votes }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  const sorted = useMemo(
    () => votes.sort((a, b) => {
      const ta = a.balance.muln(LOCKS[a.vote.conviction.toNumber()]).div(BN_TEN);
      const tb = b.balance.muln(LOCKS[b.vote.conviction.toNumber()]).div(BN_TEN);

      return tb.cmp(ta);
    }),
    [votes]
  );

  const renderVotes = useCallback(
    () => sorted.map((vote) => (
      <ReferendumVote
        key={vote.accountId.toString()}
        vote={vote}
      />
    )),
    [sorted]
  );

  return (
    <ExpanderScroll
      className={className}
      empty={votes && t('No voters')}
      // help={change.gtn(0) && (
      //   <>
      //     <FormatBalance value={change} />
      //     <p>{isWinning
      //       ? t('The amount this total can be reduced by to change the referendum outcome. This assumes changes to the convictions of the existing votes, with no additional turnout.')
      //       : t('The amount this total should be increased by to change the referendum outcome. This assumes additional turnout with new votes at 1x conviction.')
      //     }</p>
      //   </>
      // )}
      // helpIcon={isWinning ? 'arrow-circle-down' : 'arrow-circle-up'}
      renderChildren={votes.length ? renderVotes : undefined}
      summary={
        <>
          {isAye
            ? t('Aye {{count}}', { replace: { count: count ? ` (${formatNumber(count)})` : '' } })
            : t('Nay {{count}}', { replace: { count: count ? ` (${formatNumber(count)})` : '' } })
          }
          <div><FormatBalance value={total} /></div>
        </>
      }
    />
  );
}

export default React.memo(ReferendumVotes);
