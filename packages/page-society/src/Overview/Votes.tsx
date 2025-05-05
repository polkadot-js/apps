// Copyright 2017-2025 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VoteSplit, VoteType } from '../types.js';

import React, { useEffect, useState } from 'react';

import { useTranslation } from '../translate.js';
import VotesExpander from './VotesExpander.js';

interface Props {
  votes?: VoteType[];
}

function Votes ({ votes }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ allAye, allNay, allSkeptic }, setVoteSplit] = useState<VoteSplit>({ allAye: [], allNay: [], allSkeptic: [] });

  useEffect((): void => {
    votes && setVoteSplit({
      allAye: votes.filter(([, vote]) => vote.isApprove),
      allNay: votes.filter(([, vote]) => vote.isReject),
      allSkeptic: votes.filter(([, vote]) => vote.isSkeptic)
    });
  }, [votes]);

  return (
    <td className='expand'>
      <VotesExpander
        label={t('Skeptics')}
        votes={allSkeptic}
      />
      <VotesExpander
        label={t('Approvals')}
        votes={allAye}
      />
      <VotesExpander
        label={t('Rejections')}
        votes={allNay}
      />
    </td>
  );
}

export default React.memo(Votes);
