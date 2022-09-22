// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletReferendaDecidingStatus, PalletReferendaTrackInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { Referendum, ReferendumProps as Props } from '../types';

import React, { useMemo } from 'react';

import usePreimage from '@polkadot/app-preimages/usePreimage';
import { CallExpander, Progress } from '@polkadot/react-components';
import { useBestNumber } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Deposits from './Deposits';
import Vote from './Vote';
import Votes from './Votes';

interface Expanded {
  ongoing: Referendum['info']['asOngoing'];
  tallyTotal: BN;
  shortHash: string;
}

function expandOngoing (info: Referendum['info']): Expanded {
  const ongoing = info.asOngoing;
  const hexHash = ongoing.proposalHash.toHex();

  return {
    ongoing,
    shortHash: `${hexHash.slice(0, 8)}…${hexHash.slice(-6)}`,
    tallyTotal: ongoing.tally.ayes.add(ongoing.tally.nays)
  };
}

function expandPeriods (submitted: BN, optDeciding: Option<PalletReferendaDecidingStatus>, track?: PalletReferendaTrackInfo): [BN | null, BN | null, BN | null, BN | null] {
  if (!track) {
    return [null, null, null, null];
  }

  let prepareEnd: BN | null = null;
  let decideEnd: BN | null = null;
  let confirmEnd: BN | null = null;

  if (optDeciding.isSome) {
    const deciding = optDeciding.unwrap();

    if (deciding.confirming.isSome) {
      // we are confirming
      confirmEnd = deciding.confirming.unwrap().add(track.confirmPeriod);
    } else {
      // we are still deciding
      decideEnd = deciding.since.add(track.decisionPeriod);
    }
  } else {
    // we are still preparing
    prepareEnd = submitted.add(track.preparePeriod);
  }

  return [prepareEnd, decideEnd, confirmEnd, confirmEnd || decideEnd || prepareEnd];
}

function Ongoing ({ isMember, members, palletReferenda, palletVote, value: { id, info, isConvictionVote, track } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const bestNumber = useBestNumber();

  const { ongoing: { deciding, decisionDeposit, proposalHash, submissionDeposit, submitted, tally }, shortHash, tallyTotal } = useMemo(
    () => expandOngoing(info),
    [info]
  );

  const [, decideEnd, confirmEnd, periodEnd] = useMemo(
    () => expandPeriods(submitted, deciding, track),
    [deciding, submitted, track]
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
      <td className='number'>
        {bestNumber && periodEnd && (
          <>
            {
              confirmEnd
                ? t<string>('Confirming')
                : decideEnd
                  ? t<string>('Deciding')
                  : t<string>('Preparing')
            }
            <BlockToTime value={periodEnd.sub(bestNumber)} />
            #{formatNumber(periodEnd)}
          </>
        )}
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
