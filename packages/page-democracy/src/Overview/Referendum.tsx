// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveReferendumExt } from '@polkadot/api-derive/types';
import { BlockNumber } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { AddressMini, Button, Expander, LinkExternal, Tag } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance, BlockToTime } from '@polkadot/react-query';
import { formatNumber, isBoolean } from '@polkadot/util';

import { useTranslation } from '../translate';
import PreImageButton from './PreImageButton';
import ProposalCell from './ProposalCell';
import Voting from './Voting';

interface Props {
  className?: string;
  value: DeriveReferendumExt;
}

function Referendum ({ className, value: { allAye, allNay, image, imageHash, index, status, isPassing, voteCountAye, voteCountNay, votedAye, votedNay } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const threshold = useMemo(
    () => status.threshold.type.toString().replace('majority', ' majority '),
    [status]
  );

  if (!bestNumber || status.end.sub(bestNumber).lten(0)) {
    return null;
  }

  const enactBlock = status.end.add(status.delay);
  const remainBlock = status.end.sub(bestNumber).subn(1);

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(index)}</h1></td>
      <ProposalCell
        imageHash={imageHash}
        proposal={image?.proposal}
      />
      <td className='number together'>
        <BlockToTime blocks={remainBlock} />
        {t('{{blocks}} blocks', { replace: { blocks: formatNumber(remainBlock) } })}
      </td>
      <td className='number together'>
        <BlockToTime blocks={enactBlock.sub(bestNumber)} />
        #{formatNumber(enactBlock)}
      </td>
      <td className='number'>
        <Expander summary={<><FormatBalance value={votedAye} />{voteCountAye ? ` (${formatNumber(voteCountAye)})` : '' }</>}>
          {allAye.map(({ accountId }) =>
            <AddressMini
              key={accountId.toString()}
              value={accountId}
            />
          )}
        </Expander>
      </td>
      <td className='number'>
        <Expander summary={<><FormatBalance value={votedNay} />{voteCountNay ? ` (${formatNumber(voteCountNay)})` : '' }</>}>
          {allNay.map(({ accountId }) =>
            <AddressMini
              key={accountId.toString()}
              value={accountId}
            />
          )}
        </Expander>
      </td>
      <td>
        {isBoolean(isPassing) && (
          <Tag
            color={isPassing ? 'green' : 'red'}
            hover={isPassing ? t('{{threshold}}, passing', { replace: { threshold } }) : t('{{threshold}}, not passing', { replace: { threshold } })}
            label={isPassing ? t('passing') : t('failing')}
          />
        )}
      </td>
      <td className='button'>
        <Button.Group>
          <Voting
            proposal={image?.proposal}
            referendumId={index}
          />
          {!image?.proposal && (
            <PreImageButton imageHash={imageHash} />
          )}
        </Button.Group>
      </td>
      <td className='mini'>
        <LinkExternal
          data={index}
          type='referendum'
          withShort
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
