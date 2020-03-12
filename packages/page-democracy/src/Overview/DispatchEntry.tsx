// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, BlockNumber, Hash, Proposal, ReferendumIndex } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { LinkExternal } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { Bytes, Option } from '@polkadot/types';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import ProposalCell from './ProposalCell';
import PreImageButton from './PreImageButton';

interface Props {
  blockNumber?: BlockNumber;
  hash: Hash;
  referendumIndex: ReferendumIndex;
}

export default function DispatchEntry ({ blockNumber, hash, referendumIndex }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []) || new BN(0);
  const preimage = useCall<Option<ITuple<[Bytes, AccountId, Balance, BlockNumber]>>
  >(api.query.democracy.preimages, [hash]);
  const [proposal, setProposal] = useState<Proposal | undefined>();

  useEffect((): void => {
    preimage?.isSome && setProposal(api.createType('Proposal', preimage.unwrap()[0].toU8a(true)));
  }, [preimage]);

  return (
    <tr>
      <td className='number top'><h1>{formatNumber(referendumIndex)}</h1></td>
      <td className='number together top'>
        {blockNumber && (
          <>
            <label>{t('enact at')}</label>
            <BlockToTime blocks={blockNumber.sub(bestNumber)} />
            {formatNumber(blockNumber)}
          </>
        )}
      </td>
      <ProposalCell
        proposalHash={hash}
        proposal={proposal}
      />
      <td className='together number top'>
        <PreImageButton
          hash={hash}
          isImminent
          proposal={proposal}
        />
        <LinkExternal
          data={referendumIndex}
          type='referendum'
        />
      </td>
    </tr>
  );
}
