// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedReferendum } from '@polkadot/api-derive/types';
import { BlockNumber } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';
import { AddressMini, Button, Expander, LinkExternal } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance, BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import PreImageButton from './PreImageButton';
import ProposalCell from './ProposalCell';
import Voting from './Voting';
import useVotes from './useVotes';

interface Props {
  className?: string;
  value: DerivedReferendum;
}

function Referendum ({ className, value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const { allAye, allNay, voteCountAye, voteCountNay, votedAye, votedNay } = useVotes(value);

  if (!bestNumber || value.status.end.sub(bestNumber).lten(0)) {
    return null;
  }

  const enactBlock = value.status.end.add(value.status.delay);
  const remainBlock = value.status.end.sub(bestNumber).subn(1);

  return (
    <tr className={className}>
      <td className='number top'><h1>{formatNumber(value.index)}</h1></td>
      <ProposalCell
        className='top'
        proposalHash={value.hash}
        proposal={value.proposal}
      />
      <td className='number together top'>
        <label>{t('remaining')}</label>
        <BlockToTime blocks={remainBlock} />
        {t('{{blocks}} blocks', { replace: { blocks: formatNumber(remainBlock) } })}
      </td>
      <td className='number together top'>
        <label>{t('activate')}</label>
        <BlockToTime blocks={enactBlock.sub(bestNumber)} />
        #{formatNumber(enactBlock)}
      </td>
      <td className='top'>
        <label>{t('Aye {{count}}', { replace: { count: voteCountAye ? `(${formatNumber(voteCountAye)})` : '' } })}</label>
        <Expander summary={<FormatBalance value={votedAye} />}>
          {allAye.map(({ accountId }) =>
            <AddressMini
              key={accountId.toString()}
              value={accountId}
            />
          )}
        </Expander>
      </td>
      <td className='top'>
        <label>{t('Nay {{count}}', { replace: { count: voteCountNay ? `(${formatNumber(voteCountNay)})` : '' } })}</label>
        <Expander summary={<FormatBalance value={votedNay} />}>
          {allNay.map(({ accountId }) =>
            <AddressMini
              key={accountId.toString()}
              value={accountId}
            />
          )}
        </Expander>
      </td>
      <td className='number together top'>
        <Button.Group>
          <Voting
            proposal={value.proposal}
            referendumId={value.index}
          />
          {!value.proposal && (
            <PreImageButton hash={value.hash} />
          )}
        </Button.Group>
        <LinkExternal
          data={value.index}
          type='referendum'
        />
      </td>
    </tr>
  );
}

export default React.memo(styled(Referendum)`
  .democracy--Referendum-results {
    margin-bottom: 1em;

    &.chart {
      text-align: center;
    }
  }
`);
