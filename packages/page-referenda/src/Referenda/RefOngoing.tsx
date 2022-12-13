// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash } from '@polkadot/types/interfaces';
import type { PalletReferendaTrackInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';
import type { Referendum, ReferendumProps as Props } from '../types';

import React, { useMemo } from 'react';

import usePreimage, { getPreimageHash } from '@polkadot/app-preimages/usePreimage';
import { CallExpander, Progress } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Deposits from './Deposits';
import RefEnd from './RefEnd';
import Vote from './Vote';
import Votes from './Votes';

interface Expanded {
  ongoing: Referendum['info']['asOngoing'];
  periods: {
    periodEnd: BN | null;
    prepareEnd: BN | null;
    decideEnd: BN | null;
    confirmEnd: BN | null;
  };
  proposalHash: HexString;
  shortHash: string;
  tallyTotal: BN;
}

function expandOngoing (info: Referendum['info'], track?: PalletReferendaTrackInfo): Expanded {
  const ongoing = info.asOngoing;
  const proposalHash = getPreimageHash(ongoing.proposal || (ongoing as unknown as { proposalHash: Hash }).proposalHash);
  let prepareEnd: BN | null = null;
  let decideEnd: BN | null = null;
  let confirmEnd: BN | null = null;

  if (track) {
    const { deciding, submitted } = ongoing;

    if (deciding.isSome) {
      const { confirming, since } = deciding.unwrap();

      if (confirming.isSome) {
        // we are confirming with the specific end block
        confirmEnd = confirming.unwrap();
      } else {
        // we are still deciding, start + length
        decideEnd = since.add(track.decisionPeriod);
      }
    } else {
      // we are still preparing, start + length
      prepareEnd = submitted.add(track.preparePeriod);
    }
  }

  return {
    ongoing,
    periods: {
      confirmEnd,
      decideEnd,
      periodEnd: confirmEnd || decideEnd || prepareEnd,
      prepareEnd
    },
    proposalHash,
    shortHash: `${proposalHash.slice(0, 10)}…${proposalHash.slice(-8)}`,
    tallyTotal: ongoing.tally.ayes.add(ongoing.tally.nays)
  };
}

function Ongoing ({ isMember, members, palletReferenda, palletVote, ranks, trackInfo, value: { id, info, isConvictionVote, track } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const { ongoing: { decisionDeposit, submissionDeposit, tally }, periods: { confirmEnd, decideEnd, periodEnd }, proposalHash, shortHash, tallyTotal } = useMemo(
    () => expandOngoing(info, track),
    [info, track]
  );

  const preimage = usePreimage(proposalHash);

  return (
    <>
      <td className='all'>
        {preimage && preimage.proposal
          ? (
            <CallExpander
              labelHash={t<string>('preimage')}
              value={preimage.proposal}
              withHash
            />
          )
          : t('preimage {{shortHash}}', { replace: { shortHash } })
        }
      </td>
      <RefEnd
        label={
          confirmEnd
            ? t<string>('Confirming')
            : decideEnd
              ? t<string>('Deciding')
              : t<string>('Preparing')
        }
        when={periodEnd}
      />
      <Deposits
        canDeposit
        decision={decisionDeposit}
        id={id}
        palletReferenda={palletReferenda}
        submit={submissionDeposit}
        track={track}
      />
      <Votes
        id={id}
        isConvictionVote={isConvictionVote}
        palletVote={palletVote}
        tally={tally}
      />
      <td className='middle chart'>
        <Progress
          total={tallyTotal}
          value={tally.ayes}
        />
      </td>
      <td className='button'>
        <Vote
          id={id}
          isConvictionVote={isConvictionVote}
          isMember={isMember}
          members={members}
          palletVote={palletVote}
          preimage={preimage}
          ranks={ranks}
          trackInfo={trackInfo}
        />
      </td>
    </>
  );
}

export default React.memo(Ongoing);
