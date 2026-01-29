// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletConvictionVotingTally, PalletRankedCollectiveTally, PalletRankedCollectiveVoteRecord } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PalletVote } from '../types.js';

import React, { useCallback, useMemo } from 'react';

import { AddressMini, Expander } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import useVotes from './useVotes.js';

interface Props {
  className?: string;
  id: BN;
  isConvictionVote: boolean;
  palletVote: PalletVote;
  tally: PalletConvictionVotingTally | PalletRankedCollectiveTally;
}

function renderMini (list?: [string, BN][]): React.ReactNode[] | undefined {
  return list
    ?.sort(([, a], [, b]) => b.cmp(a))
    .map(([a]) => (
      <AddressMini
        key={a}
        value={a}
      />
    ));
}

function extractVotes (votes: Record<string, PalletRankedCollectiveVoteRecord> = {}): [[string, BN][]?, [string, BN][]?] {
  const ayes: [string, BN][] = [];
  const nays: [string, BN][] = [];
  const entries = Object.entries(votes);

  for (let i = 0, count = entries.length; i < count; i++) {
    const [accountId, vote] = entries[i];

    if (vote.isAye) {
      ayes.push([accountId, vote.asAye]);
    } else {
      nays.push([accountId, vote.asNay]);
    }
  }

  return [
    ayes.length ? ayes : undefined,
    nays.length ? nays : undefined
  ];
}

function Votes ({ className = '', id, isConvictionVote, palletVote, tally }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const votes = useVotes(palletVote, id, isConvictionVote);

  const [ayes, nays] = useMemo(
    () => extractVotes(votes),
    [votes]
  );

  const renderAyes = useCallback(
    () => renderMini(ayes),
    [ayes]
  );

  const renderNays = useCallback(
    () => renderMini(nays),
    [nays]
  );

  return (
    <td className={`${className} expand media--1200-noPad`}>
      <Expander
        className='media--1200'
        renderChildren={ayes && renderAyes}
        summary={
          isConvictionVote
            ? (
              <>
                {t('Aye')}
                <div><FormatBalance value={tally.ayes} /></div>
              </>
            )
            : t('Aye {{count}}', { replace: { count: formatNumber(tally.ayes) } })
        }
      />
      <Expander
        className='media--1200'
        renderChildren={nays && renderNays}
        summary={
          isConvictionVote
            ? (
              <>
                {t('Nay')}
                <div><FormatBalance value={tally.nays} /></div>
              </>
            )
            : t('Nay {{count}}', { replace: { count: formatNumber(tally.nays) } })
        }
      />
    </td>
  );
}

export default React.memo(Votes);
