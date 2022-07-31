// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { PalletVote, Referendum as ReferendumType } from './types';

import React, { useMemo } from 'react';

import usePreimage from '@polkadot/app-preimages/usePreimage';
import { CallExpander, Progress } from '@polkadot/react-components';

import { useTranslation } from './translate';
import Vote from './Vote';

interface Props {
  id: BN;
  info: ReferendumType['info'];
  isMember: boolean;
  members?: string[];
  palletVote: PalletVote;
}

function Ongoing ({ id, info, isMember, members, palletVote }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { proposalHash, tally } = useMemo(
    () => info.asOngoing,
    [info]
  );
  const [tallyTotal, textHash] = useMemo(
    () => [tally.ayes.add(tally.nays), proposalHash.toHex()],
    [proposalHash, tally]
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
          : t('preimage {{hash}}', { replace: { hash: `${textHash.slice(0, 8)}…${textHash.slice(-8)}` } })
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
