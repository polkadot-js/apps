// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { AccountId, Balance, BlockNumber, Hash, Proposal, ReferendumIndex } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';

import React, { useEffect, useState } from 'react';
import { useApi, trackStream } from '@polkadot/react-hooks';
import { Bytes, Option } from '@polkadot/types';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';
import ProposalCell from './ProposalCell';

interface Props extends I18nProps {
  blockNumber?: BlockNumber;
  hash: Hash;
  referendumIndex: ReferendumIndex;
}

function DispatchEntry ({ blockNumber, hash, referendumIndex, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const preimage = trackStream<Option<ITuple<[Bytes, AccountId, Balance, BlockNumber]>>
  >(api.query.democracy.preimages, [hash]);
  const [proposal, setProposal] = useState<Proposal | undefined>();

  useEffect((): void => {
    if (preimage?.isSome) {
      setProposal(api.createType('Proposal', preimage.unwrap()[0].toU8a(true)));
    }
  }, [preimage]);

  return (
    <tr>
      <td className='number top'><h1>{formatNumber(referendumIndex)}</h1></td>
      <td className='number top'>
        {blockNumber && (
          <>
            <label>{t('enact at')}</label>
            {formatNumber(blockNumber)}
          </>
        )}
      </td>
      <ProposalCell proposalHash={hash} proposal={proposal} />
    </tr>
  );
}

export default translate(DispatchEntry);
