// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletConvictionVotingTally, PalletRankedCollectiveTally } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PalletVote } from '../types';

import React from 'react';

import { Expander } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  id: BN;
  isConvictionVote: boolean;
  palletVote: PalletVote;
  tally: PalletConvictionVotingTally | PalletRankedCollectiveTally;
}

function Votes ({ className = '', isConvictionVote, tally }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <td className={`${className} expand`}>
      <Expander
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
