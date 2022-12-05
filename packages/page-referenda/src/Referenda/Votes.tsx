// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';
import type { PalletConvictionVotingTally, PalletRankedCollectiveTally } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PalletVote } from '../types';

import React, { useCallback, useMemo } from 'react';

import { AddressMini, Expander } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import useVotes from './useVotes';

interface Props {
  className?: string;
  id: BN;
  isConvictionVote: boolean;
  palletVote: PalletVote;
  tally: PalletConvictionVotingTally | PalletRankedCollectiveTally;
}

function Votes ({ className = '', id, isConvictionVote, palletVote, tally }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const votes = useVotes(palletVote, id, isConvictionVote);

  const [ayes, nays] = useMemo(
    () => votes
      ? Object.entries(votes).reduce<[[string, u32][], [string, u32][]]>(([ayes, nays], [accountId, vote]) => {
        if (vote.isAye) {
          ayes.push([accountId, vote.asAye]);
        } else {
          nays.push([accountId, vote.asNay]);
        }

        return [ayes, nays];
      }, [[], []])
      : [],
    [votes]
  );

  const renderAyes = useCallback(
    () => ayes?.map(([a]) => (
      <AddressMini
        key={a}
        value={a}
      />
    )),
    [ayes]
  );

  const renderNays = useCallback(
    () => nays?.map(([a]) => (
      <AddressMini
        key={a}
        value={a}
      />
    )),
    [nays]
  );

  return (
    <td className={`${className} expand`}>
      <Expander
        renderChildren={ayes && ayes.length !== 0 && renderAyes}
        summary={
          isConvictionVote
            ? (
              <>
                {t<string>('Aye')}
                <div><FormatBalance value={tally.ayes} /></div>
              </>
            )
            : t<string>('Aye {{count}}', { replace: { count: tally.ayes.toNumber() } })
        }
      />
      <Expander
        renderChildren={nays && nays.length !== 0 && renderNays}
        summary={
          isConvictionVote
            ? (
              <>
                {t<string>('Nay')}
                <div><FormatBalance value={tally.nays} /></div>
              </>
            )
            : t<string>('Nay {{count}}', { replace: { count: tally.nays.toNumber() } })
        }
      />
    </td>
  );
}

export default React.memo(Votes);
