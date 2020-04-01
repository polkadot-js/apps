// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveReferendumVote } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Expander } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import ReferendumVote from './ReferendumVote';

interface Props {
  count: number;
  total: BN;
  votes: DeriveReferendumVote[];
}

const LOCKS = [1, 10, 20, 30, 40, 50];

function ReferendumVotes ({ count, total, votes }: Props): React.ReactElement<Props> {
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
    <td className='number'>
      <Expander summary={<><FormatBalance value={total} />{count ? ` (${formatNumber(count)})` : '' }</>}>
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

export default React.memo(ReferendumVotes);
