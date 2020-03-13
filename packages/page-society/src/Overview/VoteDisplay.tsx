// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { VoteSplit, VoteType } from '../types';

import React, { useEffect, useState } from 'react';
import { AddressMini } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  votes?: VoteType[];
}

export default function VoteDisplay ({ votes }: Props): React.ReactElement<Props> {
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
      <td className='top padtop'>
        {allSkeptic.length !== 0 && (
          <details>
            <summary>
              {t('Skeptics ({{count}})', { replace: { count: allSkeptic.length } })}
            </summary>
            {allSkeptic.map(([who]): React.ReactNode =>
              <AddressMini
                key={who.toString()}
                value={who}
              />
            )}
          </details>
        )}
      </td>
      <td className='top padtop'>
        {allAye.length !== 0 && (
          <details>
            <summary>
              {t('Approvals ({{count}})', { replace: { count: allAye.length } })}
            </summary>
            {allAye.map(([who]): React.ReactNode =>
              <AddressMini
                key={who.toString()}
                value={who}
              />
            )}
          </details>
        )}
      </td>
      <td className='top padtop'>
        {allNay.length !== 0 && (
          <details>
            <summary>
              {t('Rejections ({{count}})', { replace: { count: allNay.length } })}
            </summary>
            {allNay.map(([who]): React.ReactNode =>
              <AddressMini
                key={who.toString()}
                value={who}
              />
            )}
          </details>
        )}
      </td>
    </>
  );
}
