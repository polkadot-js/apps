// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferendaTrackInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { Referendum, ReferendumProps as Props } from '../types';

import React, { useMemo } from 'react';

import usePreimage from '@polkadot/app-preimages/usePreimage';
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
  shortHash: string;
  tallyTotal: BN;
}

function expandOngoing (info: Referendum['info'], track?: PalletReferendaTrackInfo): Expanded {
  const ongoing = info.asOngoing;
  const hexHash = ongoing.proposalHash.toHex();
  let prepareEnd: BN | null = null;
  let decideEnd: BN | null = null;
  let confirmEnd: BN | null = null;

  if (track) {
    const { deciding, submitted } = ongoing;

    if (deciding.isSome) {
      const d = deciding.unwrap();

      if (d.confirming.isSome) {
        // we are confirming
        confirmEnd = d.confirming.unwrap().add(track.confirmPeriod);
      } else {
        // we are still deciding
        decideEnd = d.since.add(track.decisionPeriod);
      }
    } else {
      // we are still preparing
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
    shortHash: `${hexHash.slice(0, 8)}…${hexHash.slice(-6)}`,
    tallyTotal: ongoing.tally.ayes.add(ongoing.tally.nays)
  };
}

function Ongoing ({ isMember, members, palletReferenda, palletVote, value: { id, info, isConvictionVote, track } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const { ongoing: { decisionDeposit, proposalHash, submissionDeposit, tally }, periods: { confirmEnd, decideEnd, periodEnd }, shortHash, tallyTotal } = useMemo(
    () => expandOngoing(info, track),
    [info, track]
  );

  const preimage = usePreimage(proposalHash);

  return (
    <>
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
        {preimage && (
          <Vote
            id={id}
            isConvictionVote={isConvictionVote}
            isMember={isMember}
            members={members}
            palletVote={palletVote}
            preimage={preimage}
          />
        )}
      </td>
    </>
  );
}

export default React.memo(Ongoing);
