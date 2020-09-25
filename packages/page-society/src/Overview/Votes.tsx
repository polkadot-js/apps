// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { VoteSplit, VoteType } from '../types';

import React, { useEffect, useState } from 'react';

import { useTranslation } from '../translate';
import VotesExpander from './VotesExpander';

interface Props {
  votes?: VoteType[];
}

function Votes ({ votes }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ allAye, allNay, allSkeptic }, setVoteSplit] = useState<VoteSplit>({ allAye: [], allNay: [], allSkeptic: [] });

  useEffect((): void => {
    votes && setVoteSplit({
      allAye: votes.filter(([, vote]): boolean => vote.isApprove),
      allNay: votes.filter(([, vote]): boolean => vote.isReject),
      allSkeptic: votes.filter(([, vote]): boolean => vote.isSkeptic)
    });
  }, [votes]);

  return (
    <td className='expand'>
      <VotesExpander
        label={t<string>('Skeptics')}
        votes={allSkeptic}
      />
      <VotesExpander
        label={t<string>('Approvals')}
        votes={allAye}
      />
      <VotesExpander
        label={t<string>('Rejections')}
        votes={allNay}
      />
    </td>
  );
}

export default React.memo(Votes);
