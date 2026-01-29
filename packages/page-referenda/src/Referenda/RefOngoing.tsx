// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Hash } from '@polkadot/types/interfaces';
import type { PalletConvictionVotingTally, PalletRankedCollectiveTally, PalletReferendaDeposit, PalletReferendaReferendumStatusConvictionVotingTally, PalletReferendaReferendumStatusRankedCollectiveTally, PalletReferendaTrackDetails } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';
import type { Referendum, ReferendumProps as Props } from '../types.js';

import React, { useMemo } from 'react';

import { Progress } from '@polkadot/react-components';
import { useApi, usePreimage } from '@polkadot/react-hooks';
import { getPreimageHash } from '@polkadot/react-hooks/usePreimage';
import { CallExpander } from '@polkadot/react-params';

import { useTranslation } from '../translate.js';
import Deposits from './Deposits/index.js';
import Vote from './Vote/index.js';
import RefEnd from './RefEnd.js';
import { unwrapDeposit } from './util.js';
import Votes from './Votes.js';

interface Expanded {
  decisionDeposit: PalletReferendaDeposit | null;
  periods: {
    periodEnd: BN | null;
    prepareEnd: BN | null;
    decideEnd: BN | null;
    confirmEnd: BN | null;
  };
  ongoing: PalletReferendaReferendumStatusConvictionVotingTally | PalletReferendaReferendumStatusRankedCollectiveTally;
  proposalHash?: HexString;
  submissionDeposit: PalletReferendaDeposit | null;
  tally: PalletConvictionVotingTally | PalletRankedCollectiveTally;
  tallyTotal: BN;
}

function expandOngoing (api: ApiPromise, info: Referendum['info'], track?: PalletReferendaTrackDetails): Expanded {
  const ongoing = info.asOngoing;
  const proposalHash = getPreimageHash(api, ongoing.proposal || (ongoing as unknown as { proposalHash: Hash }).proposalHash).proposalHash;
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
    decisionDeposit: unwrapDeposit(ongoing.decisionDeposit),
    ongoing,
    periods: {
      confirmEnd,
      decideEnd,
      periodEnd: confirmEnd || decideEnd || prepareEnd,
      prepareEnd
    },
    proposalHash,
    submissionDeposit: unwrapDeposit(ongoing.submissionDeposit),
    tally: ongoing.tally,
    tallyTotal: ongoing.tally.ayes.add(ongoing.tally.nays)
  };
}

function Ongoing ({ isMember, members, palletReferenda, palletVote, ranks, trackInfo, value: { id, info, isConvictionVote, track } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  const { decisionDeposit, ongoing, periods: { confirmEnd, decideEnd, periodEnd }, submissionDeposit, tally, tallyTotal } = useMemo(
    () => expandOngoing(api, info, track),
    [api, info, track]
  );

  const preimage = usePreimage(ongoing.proposal || (ongoing as unknown as { proposalHash: Hash }).proposalHash);

  return (
    <>
      <td className='all'>
        {preimage?.proposal
          ? (
            <CallExpander
              labelHash={t('preimage')}
              value={preimage.proposal}
              withHash
            />
          )
          : <div className='shortHash'>{preimage?.proposalHash}</div>
        }
      </td>
      <Deposits
        canDeposit
        decision={decisionDeposit}
        id={id}
        palletReferenda={palletReferenda}
        submit={submissionDeposit}
        track={track}
      />
      <RefEnd
        label={
          confirmEnd
            ? t('Confirming')
            : decideEnd
              ? t('Deciding')
              : t('Preparing')
        }
        when={periodEnd}
      />
      <Votes
        id={id}
        isConvictionVote={isConvictionVote}
        palletVote={palletVote}
        tally={tally}
      />
      <td className='middle chart media--1300-noPad'>
        <Progress
          className='media--1300'
          total={tallyTotal}
          value={tally.ayes}
        />
      </td>
      <td className='actions button'>
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
