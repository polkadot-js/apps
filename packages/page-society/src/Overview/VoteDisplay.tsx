// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { VoteSplit, VoteType } from '../types';

import React, { useEffect, useState } from 'react';
import { AddressMini, Expander } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  votes?: VoteType[];
}

function VoteDisplay ({ votes }: Props): React.ReactElement<Props> {
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
    <>
      <td>
        {allSkeptic.length !== 0 && (
          <Expander summary={t('Skeptics ({{count}})', { replace: { count: allSkeptic.length } })}>
            {allSkeptic.map(([who]): React.ReactNode =>
              <AddressMini
                key={who.toString()}
                value={who}
              />
            )}
          </Expander>
        )}
      </td>
      <td>
        {allAye.length !== 0 && (
          <Expander summary={t('Approvals ({{count}})', { replace: { count: allAye.length } })}>
            {allAye.map(([who]): React.ReactNode =>
              <AddressMini
                key={who.toString()}
                value={who}
              />
            )}
          </Expander>
        )}
      </td>
      <td>
        {allNay.length !== 0 && (
          <Expander summary={t('Rejections ({{count}})', { replace: { count: allNay.length } })}>
            {allNay.map(([who]): React.ReactNode =>
              <AddressMini
                key={who.toString()}
                value={who}
              />
            )}
          </Expander>
        )}
      </td>
    </>
  );
}

export default React.memo(VoteDisplay);
