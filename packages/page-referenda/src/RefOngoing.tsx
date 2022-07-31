// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { Referendum, ReferendumProps as Props } from './types';

import React, { useMemo } from 'react';

import usePreimage from '@polkadot/app-preimages/usePreimage';
import { CallExpander, Progress } from '@polkadot/react-components';

import { useTranslation } from './translate';
import Vote from './Vote';

interface Expanded {
  ongoing: Referendum['info']['asOngoing'];
  tallyTotal: BN;
  shortHash: string;
}

function expandOngoing (info: Referendum['info']): Expanded {
  const ongoing = info.asOngoing;

  return {
    ongoing,
    shortHash: ongoing.proposalHash.toHex(),
    tallyTotal: ongoing.tally.ayes.add(ongoing.tally.nays)
  };
}

function Ongoing ({ isMember, members, palletVote, value: { id, info } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { ongoing: { proposalHash, tally }, shortHash, tallyTotal } = useMemo(
    () => expandOngoing(info),
    [info]
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
          : t('preimage {{hash}}', { replace: { hash: `${shortHash.slice(0, 8)}…${shortHash.slice(-8)}` } })
        }
      </td>
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
